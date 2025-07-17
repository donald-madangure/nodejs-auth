
const express = require('express');
const {uploadImage, fetchImagesController, deleteImageController}  = require('../controllers/image-controller');
const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middleware');
const imageUploadMiddleware = require('../middleware/image-Upload-Middleware');

const router = express.Router();

//upload image
router.post('/upload', authMiddleware, isAdminUser, imageUploadMiddleware.single('image'), uploadImage);


//get all the images
router.get('/fetch', authMiddleware, fetchImagesController);

//delete image route
router.delete('/delete/:id', authMiddleware, isAdminUser, deleteImageController);

module.exports = router;
