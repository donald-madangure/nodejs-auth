
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware'); // Importing the auth middleware
const adminMiddleware = require('../middleware/admin-middleware'); // Importing the admin middleware    


const router = express.Router();


router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {

    res.send({
        "message": 'Welcome to the Admin Page'        
    });
});

module.exports = router;