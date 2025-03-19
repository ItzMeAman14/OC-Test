const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  if (req.path === '/auth/login' || req.path === '/auth/signup' || req.path === "/execute" || req.path === "/credit" || req.path === "/contact-us" || req.path === "/auth/sendOTP" || req.path === "/getUser" || req.path === "/auth/sendRecoverOTP" || req.path === "/auth/reset-password") {
    return next();
  }

    const token = req.header('userAPIKEY');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);

      return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken
