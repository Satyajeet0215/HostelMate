# HostelMate Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Set up Environment Variables
Create a `.env` file in the `server` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelmate
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For macOS (using Homebrew)
brew services start mongodb-community

# For Ubuntu
sudo systemctl start mongod

# For Windows
# Start MongoDB service from Services app or use MongoDB Compass
```

### 4. Seed Database with Demo Data
```bash
npm run seed
```

This will create:
- Admin user: `admin@hostel.com` / `password123`
- Regular user: `user@hostel.com` / `password123`
- Sample complaints for testing

### 5. Start the Application
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend (port 3000).

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Accounts

### Admin Login
- **Email**: admin@hostel.com
- **Password**: password123
- **Features**: View all complaints, update status, manage system

### User Login
- **Email**: user@hostel.com
- **Password**: password123
- **Features**: Raise complaints, track status, give feedback

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is installed and running
2. Check if the connection string in `.env` is correct
3. For MongoDB Atlas, update the URI with your cluster details

### Port Already in Use
If port 3000 or 5000 is busy:
1. Kill the process using the port
2. Or modify the PORT in server/.env and client/package.json proxy

### Package Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
rm -rf client/node_modules
rm -rf server/node_modules
npm run install-all
```

## Production Deployment

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelmate
JWT_SECRET=generate_a_long_random_string_for_production
NODE_ENV=production
```

### Build Frontend
```bash
cd client
npm run build
```

### Deploy Backend
The `server` directory contains the complete backend application ready for deployment on platforms like Heroku, Railway, or DigitalOcean.

## Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify environment variables
3. Check console for error messages
4. Ensure all dependencies are installed correctly