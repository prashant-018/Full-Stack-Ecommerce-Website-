const express = require('express');
const { body, validationResult } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
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
 * @route   GET /api/user/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', auth, getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  auth,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .trim()
      .isLength({ min: 10, max: 15 })
      .withMessage('Phone number must be between 10 and 15 characters'),
    body('address')
      .optional()
      .isObject()
      .withMessage('Address must be an object')
  ],
  validate,
  updateProfile
);

module.exports = router;

