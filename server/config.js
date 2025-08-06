module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelmate',
  JWT_SECRET: process.env.JWT_SECRET || 'hostelmate_super_secret_key_change_in_production_please',
  NODE_ENV: process.env.NODE_ENV || 'development'
};