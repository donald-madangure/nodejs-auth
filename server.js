require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');// Import authentication routes
const homeRoutes = require('./routes/home-routes');// Import home routes (if needed)
const adminRoutes = require('./routes/admin-routes');// Import admin routes (if needed)
const uploadImageRoutes = require('./routes/image-routes');// Import image upload routes

const app = express();// Initialize Express app
const PORT = process.env.PORT || 3000;// Set the port from environment variable or default to 3000

app.use(express.json());// Middleware to parse JSON requests

app.use('/api/auth', authRoutes);// Use authentication routes under /api/auth
app.use('/api/home', homeRoutes);// Use home routes under /api/home
app.use('/api/admin', adminRoutes);// Use admin routes under /api/admin
app.use('/api/images', uploadImageRoutes);// Use image upload routes under /api/images

connectToDB();// Connect to MongoDB

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});// Start the server