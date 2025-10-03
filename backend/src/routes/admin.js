const express = require('express');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/overview
// @desc    Get admin dashboard overview (admin only)
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const [
      totalContacts,
      unreadContacts,
      totalProjects,
      featuredProjects,
      recentContacts,
      recentAnalytics,
      monthlyStats
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Contact.find({}).sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt'),
      Analytics.find({}).sort({ createdAt: -1 }).limit(10).select('event page createdAt'),
      
      // Monthly stats for the last 6 months
      Analytics.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            pageViews: { $sum: { $cond: [{ $eq: ['$event', 'page_view'] }, 1, 0] } },
            projectViews: { $sum: { $cond: [{ $eq: ['$event', 'project_view'] }, 1, 0] } },
            contacts: { $sum: { $cond: [{ $eq: ['$event', 'contact_form'] }, 1, 0] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      overview: {
        totalContacts,
        unreadContacts,
        totalProjects,
        featuredProjects,
        recentContacts,
        recentAnalytics,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/system-info
// @desc    Get system information (admin only)
// @access  Private
router.get('/system-info', auth, async (req, res) => {
  try {
    const [
      databaseStats,
      collectionStats
    ] = await Promise.all([
      // Get database stats
      Contact.db.db.stats(),
      
      // Get collection counts
      Promise.all([
        Contact.countDocuments(),
        Project.countDocuments(),
        Analytics.countDocuments(),
        Admin.countDocuments()
      ])
    ]);

    const systemInfo = {
      server: {
        nodeVersion: process.version,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        memory: process.memoryUsage()
      },
      database: {
        name: databaseStats.db,
        collections: databaseStats.collections,
        dataSize: databaseStats.dataSize,
        storageSize: databaseStats.storageSize,
        indexSize: databaseStats.indexSize
      },
      collections: {
        contacts: collectionStats[0],
        projects: collectionStats[1],
        analytics: collectionStats[2],
        admins: collectionStats[3]
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      systemInfo
    });

  } catch (error) {
    console.error('System info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/seed-projects
// @desc    Seed initial projects data (admin only)
// @access  Private
router.post('/seed-projects', auth, async (req, res) => {
  try {
    // Check if projects already exist
    const existingProjects = await Project.countDocuments();
    
    if (existingProjects > 0) {
      return res.status(400).json({
        success: false,
        message: 'Projects already exist. Cannot seed data.'
      });
    }

    // Seed projects data
    const seedProjects = [
      {
        title: 'CyberCommerce Platform',
        description: 'Full-stack e-commerce solution with modern UI and secure payment integration',
        longDescription: 'A comprehensive e-commerce platform built with React and Node.js, featuring user authentication, product management, shopping cart functionality, and secure payment processing with Stripe integration.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
        image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
        githubUrl: '#',
        liveUrl: '#',
        category: 'fullstack',
        featured: true,
        status: 'completed',
        order: 1
      },
      {
        title: 'Neural Network Visualizer',
        description: 'Interactive tool for visualizing deep learning architectures and training processes',
        longDescription: 'An educational tool that helps visualize neural network architectures and training processes in real-time, built with Vue.js and D3.js for dynamic data visualization.',
        technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        githubUrl: '#',
        liveUrl: '#',
        category: 'frontend',
        featured: true,
        status: 'completed',
        order: 2
      },
      {
        title: 'Real-time Analytics Dashboard',
        description: 'Modern dashboard with real-time data visualization and quantum-inspired design',
        longDescription: 'A sleek analytics dashboard featuring real-time data updates, interactive charts, and a futuristic quantum-inspired design system built with Angular and WebGL.',
        technologies: ['Angular', 'TypeScript', 'WebGL', 'Socket.io'],
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        githubUrl: '#',
        liveUrl: '#',
        category: 'frontend',
        featured: false,
        status: 'completed',
        order: 3
      },
      {
        title: 'Holographic Portfolio',
        description: 'This very portfolio showcasing advanced CSS animations and modern React architecture',
        longDescription: 'A stunning cyberpunk-themed portfolio website featuring advanced CSS animations, holographic effects, and a complete backend system for content management and analytics.',
        technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'],
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
        githubUrl: '#',
        liveUrl: '#',
        category: 'fullstack',
        featured: true,
        status: 'completed',
        order: 4
      }
    ];

    const projects = await Project.insertMany(seedProjects);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${projects.length} projects`,
      projects
    });

  } catch (error) {
    console.error('Seed projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during seeding'
    });
  }
});

// @route   POST /api/admin/create-admin
// @desc    Create admin user (one-time setup)
// @access  Public (but restricted by environment)
router.post('/create-admin', async (req, res) => {
  try {
    const existingAdmins = await Admin.countDocuments();

    // If an admin already exists, block regardless of environment
    if (existingAdmins > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // In production, require valid setup token header
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      const setupToken = req.header('x-setup-token');
      if (!setupToken || setupToken !== process.env.ADMIN_SETUP_TOKEN) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }
    }

    const adminData = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: 'HITAYEZU Frank Duff'
    };

    const admin = new Admin(adminData);
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin creation'
    });
  }
});

// @route   DELETE /api/admin/clear-analytics
// @desc    Clear old analytics data (admin only)
// @access  Private
router.delete('/clear-analytics', auth, async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const cutoffDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    const result = await Analytics.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} analytics records older than ${days} days`
    });

  } catch (error) {
    console.error('Clear analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
