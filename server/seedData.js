const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const config = require('./config');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: 'password123',
      role: 'admin',
      phoneNumber: '9876543210'
    });

    await adminUser.save();
    console.log('Admin user created');

    // Create regular users
    const users = [
      {
        name: 'John Doe',
        email: 'user@hostel.com',
        password: 'password123',
        role: 'user',
        roomNumber: 'A101',
        phoneNumber: '9876543211'
      },
      {
        name: 'Jane Smith',
        email: 'jane@hostel.com',
        password: 'password123',
        role: 'user',
        roomNumber: 'B205',
        phoneNumber: '9876543212'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@hostel.com',
        password: 'password123',
        role: 'user',
        roomNumber: 'C310',
        phoneNumber: '9876543213'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    console.log('Regular users created');

    // Create sample complaints
    const sampleComplaints = [
      {
        title: 'Fan not working in room',
        description: 'The ceiling fan in my room has stopped working since yesterday. It does not respond to the regulator and makes a strange noise when I try to turn it on.',
        category: 'Electrical',
        subcategory: 'Fan',
        priority: 'Medium',
        user: createdUsers[0]._id,
        roomNumber: createdUsers[0].roomNumber,
        status: 'Open'
      },
      {
        title: 'Water leakage from bathroom tap',
        description: 'There is continuous water leakage from the bathroom tap. The water is dripping even when the tap is completely closed. This is causing water wastage.',
        category: 'Plumbing',
        subcategory: 'Tap',
        priority: 'High',
        user: createdUsers[1]._id,
        roomNumber: createdUsers[1].roomNumber,
        status: 'In Progress',
        assignedAdmin: adminUser._id,
        resolverName: 'Maintenance Team'
      },
      {
        title: 'WiFi connection issues',
        description: 'The WiFi connection in my room is very slow and keeps disconnecting frequently. Unable to attend online classes properly.',
        category: 'Internet & Connection',
        subcategory: 'WiFi',
        priority: 'High',
        user: createdUsers[2]._id,
        roomNumber: createdUsers[2].roomNumber,
        status: 'Resolved',
        assignedAdmin: adminUser._id,
        resolverName: 'IT Support',
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        rating: 4,
        feedback: 'Issue resolved quickly. Good service!'
      },
      {
        title: 'Room door lock not working',
        description: 'The door lock of my room is jammed and I am having difficulty locking and unlocking the door. Sometimes the key gets stuck.',
        category: 'Carpentry',
        subcategory: 'Door',
        priority: 'Urgent',
        user: createdUsers[0]._id,
        roomNumber: createdUsers[0].roomNumber,
        status: 'Open'
      },
      {
        title: 'Garbage not collected for 3 days',
        description: 'The garbage from our floor has not been collected for the past 3 days. It is creating hygiene issues and bad smell.',
        category: 'Housekeeping',
        subcategory: 'Garbage',
        priority: 'High',
        user: createdUsers[1]._id,
        roomNumber: createdUsers[1].roomNumber,
        status: 'In Progress',
        assignedAdmin: adminUser._id,
        adminNotes: 'Housekeeping team notified. Will be resolved by tomorrow.'
      }
    ];

    for (const complaintData of sampleComplaints) {
      const complaint = new Complaint(complaintData);
      await complaint.save();
    }

    console.log('Sample complaints created');
    console.log('\n=== Demo Accounts Created ===');
    console.log('Admin: admin@hostel.com / password123');
    console.log('User: user@hostel.com / password123');
    console.log('Additional users: jane@hostel.com, mike@hostel.com / password123');
    console.log('\nSeed data creation completed successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();