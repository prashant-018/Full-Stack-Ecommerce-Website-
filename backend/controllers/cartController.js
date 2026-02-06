const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    // Ensure user ID exists
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(req.user.userId)
      .populate({
        path: 'cart.product',
        select: 'name price originalPrice images sizes colors isActive'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Filter out inactive products and calculate totals
    const activeCartItems = user.cart.filter(item =>
      item.product && item.product.isActive
    );

    let subtotal = 0;
    const cartItems = activeCartItems.map(item => {
      const price = item.product.price || 0;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return {
        _id: item._id,
        product: item.product,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: price,
        total: itemTotal
      };
    });

    // Update user cart if any items were removed
    if (activeCartItems.length !== user.cart.length) {
      user.cart = activeCartItems;
      await user.save();
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          itemCount: cartItems.length,
          subtotal: Math.round(subtotal * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          shipping: shipping,
          total: Math.round(total * 100) / 100
        }
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);

    // Return empty cart instead of 500 error
    res.status(200).json({
      success: true,
      data: {
        items: [],
        summary: {
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        }
      }
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    // Ensure user ID exists
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { productId, size, color, quantity = 1 } = req.body;

    // Validation
    if (!productId || !size || !color) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, size, and color are required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    // Check if size is available
    const sizeOption = product.sizes.find(s =>
      (s.size && s.size === size) || (s.name && s.name === size)
    );
    if (!sizeOption) {
      return res.status(400).json({
        success: false,
        message: 'Size not available for this product'
      });
    }

    // Check if color is available
    const colorOption = product.colors.find(c => c.name === color);
    if (!colorOption) {
      return res.status(400).json({
        success: false,
        message: 'Color not available for this product'
      });
    }

    // Check stock
    if (sizeOption.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${sizeOption.stock} items available in stock`
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;

      if (newQuantity > sizeOption.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${sizeOption.stock} available in stock`
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        size,
        color,
        quantity
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Add to cart error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check stock availability
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const sizeOption = product.sizes.find(s =>
      (s.size && s.size === cartItem.size) || (s.name && s.name === cartItem.size)
    );

    if (!sizeOption) {
      return res.status(400).json({
        success: false,
        message: 'Size not available'
      });
    }

    if (quantity > sizeOption.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${sizeOption.stock} items available in stock`
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { itemId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    cartItem.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// @desc    Remove item from cart (by productId + size + color)
// @route   DELETE /api/cart/remove?productId=...&size=...&color=...
// @route   POST /api/cart/remove { productId, size, color }
// @access  Private
const removeFromCartByKey = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const productId = req.body?.productId || req.query?.productId;
    const size = req.body?.size || req.query?.size;
    const color = req.body?.color || req.query?.color;

    if (!productId || !size || !color) {
      return res.status(400).json({
        success: false,
        message: 'productId, size, and color are required'
      });
    }

    const result = await User.updateOne(
      { _id: req.user.userId },
      { $pull: { cart: { product: productId, size, color } } }
    );

    // Mongoose can return either modifiedCount (newer) or nModified (older)
    const modifiedCount = result?.modifiedCount ?? result?.nModified ?? 0;

    if (modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found for given productId/size/color'
      });
    }

    return res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart (by key) error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  removeFromCartByKey,
  clearCart
};