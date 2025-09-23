const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const Analytics = require('../models/Analytics');
const { sendContactNotification, sendAutoReply } = require('../config/email');
const auth = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  contactLimiter,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
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

    const { name, email, subject, message } = req.body;
    
    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Create contact record
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent
    });

    await contact.save();

    // Create analytics record
    const analyticsData = new Analytics({
      event: 'contact_form',
      page: '/contact',
      ipAddress,
      userAgent,
      metadata: {
        contactId: contact._id,
        subject: subject.substring(0, 50) // First 50 chars for analytics
      }
    });

    await analyticsData.save();

    // Send emails (don't wait for completion to improve response time)
    Promise.all([
      sendContactNotification({
        name,
        email,
        subject,
        message,
        ipAddress,
        userAgent
      }),
      sendAutoReply({
        name,
        email,
        subject,
        message
      })
    ]).catch(error => {
      console.error('Email sending error:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you within 24 hours.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contacts (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Get contacts with pagination
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(query)
    ]);

    // Get status counts
    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusSummary = {
      unread: 0,
      read: 0,
      replied: 0,
      total
    };

    statusCounts.forEach(item => {
      statusSummary[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      contacts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContacts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      statusSummary
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact (admin only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it was unread
    if (contact.status === 'unread') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update contact status (admin only)
// @access  Private
router.patch('/:id/status', [
  auth,
  body('status').isIn(['unread', 'read', 'replied']).withMessage('Invalid status')
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

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const { status } = req.body;
    contact.status = status;

    if (status === 'replied') {
      contact.replied = true;
      contact.repliedAt = new Date();
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
