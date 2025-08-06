# HostelMate: Maintenance Ticket System for Colleges

A comprehensive full-stack web application for managing hostel maintenance tickets and complaints. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### 🔐 Authentication
- **Dual Role System**: Users (Students/Residents) and Admins
- **Secure Login/Signup**: Email and password authentication with JWT
- **Role-based Access Control**: Different dashboards for users and admins

### 👨‍🎓 User Features
- **Dashboard Overview**: Statistics and quick actions
- **Raise Complaints**: Comprehensive form with 13+ categories
- **Active Complaints**: Track ongoing issues (Open/In Progress)
- **Past Complaints**: View resolved complaints with feedback option
- **Rating & Feedback**: Rate resolved complaints (1-5 stars)

### 👨‍💼 Admin Features
- **Admin Dashboard**: Complete complaint management system
- **Status Management**: Update complaint status (Open → In Progress → Resolved)
- **Advanced Filtering**: Search by category, status, user, or room
- **Statistics**: Real-time analytics and category-wise insights
- **Assignment**: Assign complaints to staff members

### 📱 Categories Supported
- **Electrical**: Powercut, Fan regulator, Tube light, Socket, Switch, Fan, Others
- **Plumbing**: Tap, Shower, Flush, Washbasin, Geyser, Others
- **Security**: CCTV not working, Theft, Others
- **Appliances**: TV, Washing Machine, Fridge, Microwave, Induction, Others
- **Housekeeping**: Pest Control, Garbage, Utensils, Cleaning, Others
- **Medical**: Doctor, Others
- **Carpentry**: Window, Door, Cupboard, Study Table, Chair, Bed & Mattress, Others
- **Community**: Neighbourhood, Roommate, Staff
- **Laundry**: Washing, Delivery, Pickup, Iron
- **Repairs & Maintenance**: Paint, Lock, Others
- **Food & Beverage**: Menu, Food, Others
- **Internet & Connection**: Network Booster, DTH, WiFi
- **Others**: General category

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TailwindCSS** - Utility-first CSS framework
- **React Router Dom** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "complaint ticket"
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelmate
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

**Note**: Update the MongoDB URI if using MongoDB Atlas or a different configuration.

### 4. Start MongoDB
Make sure MongoDB is running locally or you have access to MongoDB Atlas.

### 5. Run the Application
```bash
# Development mode (runs both client and server)
npm run dev

# Or run separately:
# Server only
npm run server

# Client only
npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👥 Demo Accounts

The application comes with demo credentials for testing:

### Admin Account
- **Email**: admin@hostel.com
- **Password**: password123

### User Account
- **Email**: user@hostel.com
- **Password**: password123

## 📱 Usage Guide

### For Students/Residents:
1. **Sign up** with your details including room number
2. **Login** to access your dashboard
3. **Raise complaints** using the comprehensive form
4. **Track progress** in Active Complaints section
5. **Rate services** once complaints are resolved

### For Admins:
1. **Login** with admin credentials
2. **View all complaints** with filtering options
3. **Update status** and assign to staff members
4. **Monitor statistics** and performance metrics
5. **Add notes** for better communication

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Complaints
- `GET /api/complaints/categories` - Get all categories
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/my` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (Admin)
- `PUT /api/complaints/:id/status` - Update status (Admin)
- `PUT /api/complaints/:id/feedback` - Add feedback
- `GET /api/complaints/stats` - Get statistics (Admin)

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, college-appropriate design
- **Intuitive Navigation**: Easy-to-use dashboard layout
- **Real-time Updates**: Live status updates and notifications
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install-all

# Run development server (both frontend and backend)
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Build frontend for production
npm run build
```

## 📁 Project Structure

```
complaint ticket/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config.js           # Configuration
│   └── index.js
├── package.json            # Root package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` directory

### Database
- Use MongoDB Atlas for production
- Update connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Email notifications for status updates
- Image upload for complaints
- Mobile app version
- Advanced analytics dashboard
- Multi-language support
- Integration with hostel management systems

---

**HostelMate** - Making hostel maintenance management simple and efficient! 🏠✨# HostelMate
