# 🚀 HostelMate Quick Start Guide

## Prerequisites
- **Node.js** (v16+) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://cloud.mongodb.com/)

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment (Create server/.env file)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelmate
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# macOS (if using Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows - Start MongoDB service or use MongoDB Compass
```

### 4. Seed Demo Data (Optional)
```bash
npm run seed
```
Creates demo accounts:
- **Admin**: admin@hostel.com / password123
- **User**: user@hostel.com / password123

### 5. Start Application
```bash
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## ✨ What You Get

### 🔐 Complete Authentication System
- Role-based access (User/Admin)
- JWT token authentication
- Secure password hashing

### 👨‍🎓 Student Features
- **Dashboard**: Overview with stats and quick actions
- **Raise Complaints**: 13+ categories with subcategories
- **Track Progress**: Real-time status updates
- **Rate Service**: 5-star rating system with feedback

### 👨‍💼 Admin Features
- **Manage All Complaints**: Search, filter, and sort
- **Update Status**: Open → In Progress → Resolved
- **Analytics**: Category-wise statistics
- **Assignment**: Assign to staff members

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Beautiful Interface**: College-appropriate design
- **Real-time Updates**: Live notifications
- **Professional Look**: Clean, modern aesthetics

## 📱 Categories Supported

1. **Electrical** - Powercut, Fan, Socket, Switch, Tube light
2. **Plumbing** - Tap, Shower, Flush, Washbasin, Geyser
3. **Security** - CCTV, Theft issues
4. **Appliances** - TV, Washing Machine, Fridge, Microwave
5. **Housekeeping** - Pest Control, Garbage, Cleaning
6. **Medical** - Doctor availability
7. **Carpentry** - Door, Window, Furniture repairs
8. **Community** - Neighbor, Roommate, Staff issues
9. **Laundry** - Washing, Delivery, Pickup services
10. **Repairs & Maintenance** - Paint, Lock repairs
11. **Food & Beverage** - Menu, Food quality
12. **Internet & Connection** - WiFi, Network issues
13. **Others** - General complaints

## 🔧 Tech Stack

**Frontend**: React 18, TailwindCSS, React Router, React Hook Form
**Backend**: Node.js, Express, MongoDB, JWT, bcrypt
**UI/UX**: Responsive design, Modern components, Real-time updates

## 🆘 Troubleshooting

### MongoDB Connection Error
1. Ensure MongoDB is running locally
2. Check connection string in server/.env
3. For Atlas: Use your cluster connection string

### Port Already in Use
```bash
# Kill process on port 3000 or 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules */node_modules
npm run install-all
```

## 🌟 Demo Flow

1. **Visit** http://localhost:3000
2. **Login** as student: user@hostel.com / password123
3. **Raise** a sample complaint
4. **Logout** and login as admin: admin@hostel.com / password123
5. **Manage** the complaint and update status
6. **Login** back as user to see updates and rate service

## 📝 Production Deployment

### Frontend (Netlify/Vercel)
```bash
cd client && npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway)
```bash
# Deploy the 'server' directory
# Set environment variables in platform dashboard
```

### Database
- Use MongoDB Atlas for production
- Update MONGODB_URI in environment variables

---

**🎉 You're all set! Enjoy using HostelMate!**

For detailed documentation, see `README.md` and `SETUP.md`