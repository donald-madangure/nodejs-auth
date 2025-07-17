
const Image = require('../models/Image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');


/**
 * Controller function to handle image upload.
 * It checks if the file is present, uploads it to Cloudinary,
 * and saves the image details in the database.
 *
 * @param {Object} req - The request object containing the file and user information.
 * @param {Object} res - The response object to send back the result.
 */

const uploadImage = async (req, res) => {
    try {
        
        // check if file is missing in req object
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'File is required. Please upload an image.' 
            });
        }

        // upload image to Cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        // store url and publicId along with the uploaded user id in the database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfor.userId,            
        });
        
        await newlyUploadedImage.save();

        // delete the file from local storage after uploading to Cloudinary
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully!',
            data: newlyUploadedImage
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong! Please try again later.' 
        });
    }
};

// fetch all images uploaded by the user
const fetchImagesController = async (req, res) => {
    try {

        // pagination
        const page = parseInt(req.query.page) || 1;// Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 5;// Default to 10 images per page if not provided
        const skip = (page - 1) * limit;// Calculate the number of images to skip
        
        const sortBy = req.query.sortBy || 'createdAt'; // Default to sorting by 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Default to ascending order
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit); 

        const sortObj = {};
        sortObj[sortBy] = sortOrder;


        // find all images in the database
        // Note: This will fetch all images, not just those uploaded by the user.
        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);

        if (images) {
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                message: 'Images fetched successfully!',
                data: images
            });
        }

    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong! Please try again later.' 
        });
    }
};

// delete image controller
const deleteImageController = async (req, res) => {
    try {
       const getCurrentIdOfImageToBeDeleted = req.params.id;
       const userId = req.userInfor.userId;

       //find curent image by id
         const imageToBeDeleted = await Image.findById(getCurrentIdOfImageToBeDeleted);
         if (!imageToBeDeleted) {
            return res.status(404).json({ 
                success: false,
                message: 'Image not found!' 
            });
         }

         // check if the image was uploaded by the current user who is trying to delete it
            if (imageToBeDeleted.uploadedBy.toString() !== userId) {
                return res.status(403).json({ 
                    success: false,
                    message: 'You do not have permission to delete this image!, because you are not the one who uploaded it.' 
                });
            }

            // delete this image first from Cloudinary
            await cloudinary.uploader.destroy(imageToBeDeleted.publicId);

            // delete this image from MongoDb database
            await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

            res.status(200).json({
                success: true,
                message: 'Image deleted successfully!'
            });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ 
            success: false,
            message: 'Something went wrong! Please try again later.' 
        });
    }
};

module.exports = {
    uploadImage,
    fetchImagesController,
    deleteImageController
};
