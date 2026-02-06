const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional auth middleware:
 * - If Authorization: Bearer <token> is present and valid -> sets req.user (same shape as auth middleware)
 * - If missing/invalid -> continues as guest (does not throw)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) return next();

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    return next();
  } catch (error) {
    // Treat as guest on any token error
    return next();
  }
};

module.exports = optionalAuth;


