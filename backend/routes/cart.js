const express = require('express');
const auth = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  removeFromCartByKey,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', auth, getCart);

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', auth, addToCart);

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
router.put('/update/:itemId', auth, updateCartItem);

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove?productId=...&size=...&color=...
// @access  Private
router.delete('/remove', auth, removeFromCartByKey);

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
router.delete('/remove/:itemId', auth, removeFromCart);

// @desc    Remove item from cart (body-based - useful when clients don't like query params)
// @route   POST /api/cart/remove
// @access  Private
router.post('/remove', auth, removeFromCartByKey);

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', auth, clearCart);

module.exports = router;