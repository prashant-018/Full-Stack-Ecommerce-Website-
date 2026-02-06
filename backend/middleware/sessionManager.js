/**
 * Session management middleware and utilities
 */

/**
 * Initialize user session data
 * @param {Object} req - Express request object
 * @param {Object} user - User object
 */
const initializeUserSession = (req, user) => {
  req.session.user = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    loginTime: new Date(),
    lastActivity: new Date()
  };

  req.session.isAuthenticated = true;
  req.session.loginTime = new Date();
};

/**
 * Update session activity timestamp
 * @param {Object} req - Express request object
 */
const updateSessionActivity = (req) => {
  if (req.session && req.session.user) {
    req.session.user.lastActivity = new Date();
    req.session.lastActivity = new Date();
  }
};

/**
 * Clear user session
 * @param {Object} req - Express request object
 * @param {Function} callback - Callback function
 */
const clearUserSession = (req, callback) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    if (callback) callback(err);
  });
};

/**
 * Check if session is valid and not expired
 * @param {Object} req - Express request object
 * @returns {boolean} True if session is valid
 */
const isSessionValid = (req) => {
  if (!req.session || !req.session.user) {
    return false;
  }

  const now = new Date();
  const lastActivity = new Date(req.session.user.lastActivity);
  const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

  return (now - lastActivity) < sessionTimeout;
};

/**
 * Middleware to track session activity
 */
const sessionActivityTracker = (req, res, next) => {
  if (req.session && req.session.user) {
    updateSessionActivity(req);
  }
  next();
};

/**
 * Middleware to require valid session
 */
const requireSession = (req, res, next) => {
  if (!isSessionValid(req)) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid',
      code: 'SESSION_INVALID'
    });
  }
  next();
};

/**
 * Get session info for client
 * @param {Object} req - Express request object
 * @returns {Object} Session information
 */
const getSessionInfo = (req) => {
  if (!req.session || !req.session.user) {
    return {
      isAuthenticated: false,
      user: null,
      sessionId: null
    };
  }

  return {
    isAuthenticated: req.session.isAuthenticated || false,
    user: {
      id: req.session.user.id,
      email: req.session.user.email,
      name: req.session.user.name,
      role: req.session.user.role
    },
    sessionId: req.sessionID,
    loginTime: req.session.loginTime,
    lastActivity: req.session.user.lastActivity
  };
};

/**
 * Store cart in session for guest users
 * @param {Object} req - Express request object
 * @param {Array} cartItems - Cart items
 */
const storeGuestCart = (req, cartItems) => {
  if (!req.session.guestCart) {
    req.session.guestCart = [];
  }
  req.session.guestCart = cartItems;
};

/**
 * Get guest cart from session
 * @param {Object} req - Express request object
 * @returns {Array} Cart items
 */
const getGuestCart = (req) => {
  return req.session.guestCart || [];
};

/**
 * Clear guest cart from session
 * @param {Object} req - Express request object
 */
const clearGuestCart = (req) => {
  if (req.session.guestCart) {
    delete req.session.guestCart;
  }
};

/**
 * Store user preferences in session
 * @param {Object} req - Express request object
 * @param {Object} preferences - User preferences
 */
const storeUserPreferences = (req, preferences) => {
  req.session.preferences = preferences;
};

/**
 * Get user preferences from session
 * @param {Object} req - Express request object
 * @returns {Object} User preferences
 */
const getUserPreferences = (req) => {
  return req.session.preferences || {};
};

module.exports = {
  initializeUserSession,
  updateSessionActivity,
  clearUserSession,
  isSessionValid,
  sessionActivityTracker,
  requireSession,
  getSessionInfo,
  storeGuestCart,
  getGuestCart,
  clearGuestCart,
  storeUserPreferences,
  getUserPreferences
};