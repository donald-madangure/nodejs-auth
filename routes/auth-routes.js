const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller');// Importing the authentication controller functions
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware'); // Importing the authentication middleware

//all routes related to authentication and authorization
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
