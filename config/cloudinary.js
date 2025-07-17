
const cloudinary = require('cloudinary').v2;

cloudinary.config({  
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
// This module exports the configured Cloudinary instance for use in other parts of the application.
// It allows for image uploads, transformations, and other operations using the Cloudinary service.
// Ensure that the environment variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your .env file.
// These variables are essential for authenticating and interacting with the Cloudinary service.

