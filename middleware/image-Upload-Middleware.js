
const multer = require('multer');
const path = require('path');


//set our multer storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // specify the directory to store uploaded files
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // create a unique filename
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // create a unique filename
        // Note: The above line is commented out to avoid confusion with the uniqueSuffix line.       
    }
});

//file filter function to check file type
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // accept the file
    } else {
        cb(new Error('Only images are allowed!')); // reject the file
    }
} 

//multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // limit file size to 5MB
    }
});


/* cb( 
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname) // create a unique filename
        ) */