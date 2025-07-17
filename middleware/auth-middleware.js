const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);    

    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header
    if (!token) {
        return res.status(401).json({
             "success": false, 
             message: 'Access denied. No token provided. Please login to continue.' 
            });
    }

    //decoding the token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token using the secret key
        console.log(decodedTokenInfo); // Log the decoded token information       
        req.userInfor = decodedTokenInfo; // Attach the decoded user information to the request object

        next(); // Call next() to pass control to the next middleware or route handler
        
    } catch (error) {
        return res.status(500).json({
            "success": false, 
             message: 'Access denied. Invalid token. Please login to continue.' 
            });
    }

   
}

module.exports = authMiddleware;