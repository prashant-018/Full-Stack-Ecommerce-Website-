const express = require('express');
const { query, validationResult } = require('express-validator');
const {
  getProductsV2,
  getProductBySlugV2,
} = require('../controllers/productControllerV2');

const router = express.Router();

// Basic pagination + section validation
const validateListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('section')
    .notEmpty()
    .withMessage("Query parameter 'section' is required")
    .isIn(['men', 'women'])
    .withMessage("Section must be either 'men' or 'women'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// GET /api/v2/products?section=men|women
router.get('/', validateListQuery, getProductsV2);

// GET /api/v2/products/slug/:slug
router.get('/slug/:slug', getProductBySlugV2);

module.exports = router;


