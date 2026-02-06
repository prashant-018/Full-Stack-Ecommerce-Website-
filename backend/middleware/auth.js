const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware - checking authentication...');

    // Get token from multiple sources
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '').trim();
    }

    // 2. Check cookies as fallback
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token.trim();
    }

    // 3. Check x-auth-token header
    if (!token && req.header('x-auth-token')) {
      token = req.header('x-auth-token').trim();
    }

    console.log('🔐 Token found:', !!token);

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified, userId:', decoded.userId);
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);

      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid authentication token'
        });
      }

      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Authentication token expired'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Token verification failed'
      });
    }

    // Validate decoded token structure
    if (!decoded || !decoded.userId) {
      console.log('❌ Invalid token structure');
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure'
      });
    }

    // Get user from database
    let user;
    try {
      user = await User.findById(decoded.userId).select('-password').lean();
      console.log('👤 User found:', !!user);
    } catch (dbError) {
      console.error('❌ Database error finding user:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error during authentication'
      });
    }

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user account is active
    if (user.isActive === false) {
      console.log('❌ User account is inactive');
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    // Add user info to request object
    req.user = {
      userId: user._id,
      id: user._id, // For backward compatibility
      email: user.email,
      name: user.name || user.firstName + ' ' + user.lastName || 'User',
      role: user.role || 'user'
    };

    console.log('✅ Authentication successful for user:', req.user.email);
    next();

  } catch (error) {
    console.error('❌ Auth middleware unexpected error:', error);
    console.error('❌ Error stack:', error.stack);

    // NEVER return 500 for auth errors - always 401
    res.status(401).json({
      success: false,
      message: 'Authentication failed due to server error'
    });
  }
};

module.exports = auth;