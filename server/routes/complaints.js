const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Define subcategories for each category
const categorySubcategories = {
  'Electrical': ['Powercut', 'Fan regulator', 'Tube light', 'Socket', 'Switch', 'Fan', 'Others'],
  'Plumbing': ['Tap', 'Shower', 'Flush', 'Washbasin', 'Geyser', 'Others'],
  'Security': ['CCTV not working', 'Theft', 'Others'],
  'Appliances': ['TV', 'Washing Machine', 'Fridge', 'Microwave', 'Induction', 'Others'],
  'Housekeeping': ['Pest Control', 'Garbage', 'Utensils', 'Cleaning', 'Others'],
  'Medical': ['Doctor', 'Others'],
  'Carpentry': ['Window', 'Door', 'Cupboard', 'Study Table', 'Chair', 'Bed & Mattress', 'Others'],
  'Community': ['Neighbourhood', 'Roommate', 'Staff'],
  'Laundry': ['Washing', 'Delivery', 'Pickup', 'Iron'],
  'Repairs & Maintenance': ['Paint', 'Lock', 'Others'],
  'Food & Beverage': ['Menu', 'Food', 'Others'],
  'Internet & Connection': ['Network Booster', 'DTH', 'WiFi'],
  'Others': ['Others']
};

// @route   GET /api/complaints/categories
// @desc    Get all categories and subcategories
// @access  Private
router.get('/categories', auth, (req, res) => {
  res.json(categorySubcategories);
});

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private (User)
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(Object.keys(categorySubcategories)).withMessage('Invalid category'),
  body('subcategory').custom((value, { req }) => {
    if (!categorySubcategories[req.body.category]?.includes(value)) {
      throw new Error('Invalid subcategory for selected category');
    }
    return true;
  }),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, subcategory, priority } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category,
      subcategory,
      priority: priority || 'Medium',
      user: req.user._id,
      roomNumber: req.user.roomNumber
    });

    await complaint.save();
    
    // Populate user data
    await complaint.populate({ path: 'user', select: 'name email roomNumber' });

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint
    });

  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/complaints/my
// @desc    Get current user's complaints
// @access  Private (User)
router.get('/my', auth, async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = { user: req.user._id };
    
    if (status === 'active') {
      filter.status = { $in: ['Open', 'In Progress'] };
    } else if (status === 'resolved') {
      filter.status = 'Resolved';
    }

    const complaints = await Complaint.find(filter)
      .populate({ path: 'user', select: 'name email roomNumber' })
      .populate({ path: 'assignedAdmin', select: 'name email' })
      .sort({ createdAt: -1 });

    // Group by category
    const groupedComplaints = complaints.reduce((acc, complaint) => {
      const category = complaint.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(complaint);
      return acc;
    }, {});

    res.json({
      complaints: groupedComplaints,
      total: complaints.length
    });

  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/complaints/all
// @desc    Get all complaints (Admin only)
// @access  Private (Admin)
router.get('/all', [auth, adminAuth], async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const complaints = await Complaint.find(filter)
      .populate({ path: 'user', select: 'name email roomNumber phoneNumber' })
      .populate({ path: 'assignedAdmin', select: 'name email' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });

  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', [
  auth,
  adminAuth,
  body('status').isIn(['Open', 'In Progress', 'Resolved']).withMessage('Invalid status'),
  body('resolverName').optional().trim(),
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, resolverName, adminNotes } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.assignedAdmin = req.user._id;
    
    if (resolverName) {
      complaint.resolverName = resolverName;
    }
    
    if (adminNotes) {
      complaint.adminNotes = adminNotes;
    }

    await complaint.save();
    
    await complaint.populate([
      { path: 'user', select: 'name email roomNumber phoneNumber' },
      { path: 'assignedAdmin', select: 'name email' }
    ]);

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });

  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/complaints/:id/feedback
// @desc    Add feedback and rating to resolved complaint
// @access  Private (User - own complaints only)
router.put('/:id/feedback', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, feedback } = req.body;
    
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'Resolved'
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Resolved complaint not found or not accessible' });
    }

    complaint.rating = rating;
    if (feedback) {
      complaint.feedback = feedback;
    }

    await complaint.save();

    res.json({
      message: 'Feedback added successfully',
      complaint
    });

  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/complaints/stats
// @desc    Get complaint statistics (Admin only)
// @access  Private (Admin)
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'Open' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

    // Category-wise statistics
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      total: totalComplaints,
      open: openComplaints,
      inProgress: inProgressComplaints,
      resolved: resolvedComplaints,
      categoryStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;