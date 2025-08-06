const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electrical',
      'Plumbing',
      'Security',
      'Appliances',
      'Housekeeping',
      'Medical',
      'Carpentry',
      'Community',
      'Laundry',
      'Repairs & Maintenance',
      'Food & Beverage',
      'Internet & Connection',
      'Others'
    ]
  },
  subcategory: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolverName: {
    type: String,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Update resolvedAt when status changes to Resolved
complaintSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);