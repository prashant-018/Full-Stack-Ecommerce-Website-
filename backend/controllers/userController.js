const User = require('../models/User');

/**
 * @desc    Get current user's profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // Get user from database (password is excluded by default)
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate email format if email is being updated
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address'
        });
      }

      // Check if email is already taken by another user
      if (email.toLowerCase() !== user.email) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use by another account'
          });
        }
      }
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) {
      // If address is an object, merge it with existing address
      if (typeof address === 'object' && address !== null) {
        user.address = {
          ...user.address,
          ...address
        };
      } else {
        user.address = address;
      }
    }

    // Save updated user
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar: user.avatar,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use by another account'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};

