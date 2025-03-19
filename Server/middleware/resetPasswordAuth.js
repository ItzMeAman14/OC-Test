const jwt = require('jsonwebtoken');

const authenticateRecoveryToken = (req, res, next) => {

    const token = req.header('recoverToken');
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

module.exports = authenticateRecoveryToken