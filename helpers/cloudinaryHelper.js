
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
        folder: 'uploads',
        resource_type: 'auto', // Automatically determine the resource type
        });
        return {
        url: result.secure_url,
        publicId: result.public_id,
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Error while uploading to Cloudinary');
    }
};

module.exports = {
    uploadToCloudinary,
};