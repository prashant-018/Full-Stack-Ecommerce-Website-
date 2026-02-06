const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  getSession,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Validation middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validate,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validate,
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, getMe);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Public (requires refresh token cookie)
 */
router.post('/refresh', refreshToken);

/**
 * @route   GET /api/auth/session
 * @desc    Get session information
 * @access  Public
 */
router.get('/session', getSession);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  validate,
  forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validate,
  resetPassword
);

module.exports = router;
