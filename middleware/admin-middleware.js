
const isAdminUser = (req, res, next) => {
   if(req.userInfor.role !== 'admin') {
       return res.status(403).json({
           success: false,
           message: 'Access denied. You do not have permission to access this page. Admin rights are required.'
       });
   }
   next(); // If user is an admin, proceed to the next middleware or route handler
}

module.exports = isAdminUser;