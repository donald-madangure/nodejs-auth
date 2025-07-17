const User = require('../models/user'); // Importing the User model
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token generation

//register controller
const registerUser = async (req, res) => {
  try {
    //extract information from our request body
    const { username, email, password, role } = req.body;

    // Check if user already exists in our database
    const checkExistingUser = await User.findOne({$or: [{ email }, { username }] });
    if (checkExistingUser) {
      return res.status(400).json({ message: 'User already exists with either same email or username, Please try with different username or email' });
    }

    // Hash User password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user and save to database
    // Note: Role is optional, defaulting to 'user' if not provided
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // Default role to 'user' if not specified
    });

    await newlyCreatedUser.save();

    if(newlyCreatedUser) {
      return res.status(201).json({
         success: true,
         message: 'User registered successfully!' 
        });
    }
    else {
      return res.status(400).json({ message: 'User registration failed! Please try again later.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error! Please try again later.' });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const accessToken = jwt.sign({
         userId: user._id,
         username: user.username,
         role: user.role,
      }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });

    res.status(200).json({
        success: true,
        message: 'User logged in successfully!',
        accessToken: accessToken 
        });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error! Please try again later.' });
  }
};

// change password controller
const changePassword = async (req, res) => {
  try {
    const  userId  = req.userInfor.userId;
    // extract old and new passwords from request body
    const { oldPassword, newPassword } = req.body;

    // find the current logged-in user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found'
       });
    }
    // Check if old password matches
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Old password is incorrect! Please try again.' 
      });
    }

    // check if old password and new password are same
    if (oldPassword === newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'New password cannot be the same as old password! Please choose a different password.' 
      });
    }

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password in the database
    user.password = newHashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error! Please try again later.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword
};