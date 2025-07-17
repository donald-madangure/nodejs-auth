const express = require('express');
const authMiddleware = require('../middleware/auth-middleware'); // Importing the auth middleware
const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
    const {username, userId, role} = req.userInfor; // Extracting username from the request object
    res.send({
        "message":'Welcome to the Home Page',
        "User": {
            "userId": userId,
            "username": username,
            "role": role
        }
    });
    });


module.exports = router;     