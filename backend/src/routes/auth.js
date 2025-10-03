const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const tokenExpiry = process.env.JWT_EXPIRE || '7d';

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  authLimiter,
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const isProduction = process.env.NODE_ENV === 'production';

    // Check if admin exists
    let admin;
    let isPasswordValid = false;
    
    try {
      admin = await Admin.findOne({ email });
      if (admin) {
        isPasswordValid = await admin.comparePassword(password);
      }
    } catch (error) {
      console.log('Database error, checking fallback auth:', error.message);
    }
    
    // Determine if DB has any admins when configured
    let adminCount = 0;
    if (process.env.MONGODB_URI) {
      try {
        adminCount = await Admin.countDocuments();
      } catch (error) {
        console.log('Admin count check failed:', error.message);
      }
    }

    // Fallback authentication logic
    if (!admin) {
      // If DB is configured and at least one admin exists, disallow fallback
      if (process.env.MONGODB_URI && adminCount > 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Production: require valid setup token header to permit fallback
      if (isProduction) {
        const setupToken = req.header('x-setup-token');
        if (!setupToken || setupToken !== process.env.ADMIN_SETUP_TOKEN) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden'
          });
        }
      }

      // In non-production or production with valid setup token, allow fallback if env creds match
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const tempAdmin = {
          _id: 'temp-admin-id',
          email: process.env.ADMIN_EMAIL,
          name: 'HITAYEZU Frank Duff',
          lastLogin: new Date(),
          loginCount: 1
        };

        const token = jwt.sign(
          { id: tempAdmin._id },
          process.env.JWT_SECRET,
          { expiresIn: tokenExpiry }
        );

        return res.status(200).json({
          success: true,
          message: 'Login successful (fallback mode)',
          token,
          admin: tempAdmin
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update login stats
    admin.lastLogin = new Date();
    admin.loginCount += 1;
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        lastLogin: admin.lastLogin,
        loginCount: admin.loginCount
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        lastLogin: req.admin.lastLogin,
        loginCount: req.admin.loginCount
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.admin._id },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get admin with password
    const admin = await Admin.findById(req.admin._id);
    
    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
});

module.exports = router;
