const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

const router = express.Router();
const { dbAvailabilityGuard } = require('../middleware/dbStatus');

// @route   GET /api/projects
// @desc    Get all projects (public)
// @access  Public
router.get('/', dbAvailabilityGuard, async (req, res) => {
  try {
    const { category, featured, status, limit = 10, page = 1 } = req.query;
    
    // Build query
    let query = {};
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get projects with pagination
    const [projects, total] = await Promise.all([
      Project.find(query)
        .select('-__v')
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(query)
    ]);

    // Track page view analytics
    const analyticsData = new Analytics({
      event: 'page_view',
      page: '/projects',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      metadata: {
        query: req.query,
        projectCount: projects.length
      }
    });
    
    await analyticsData.save().catch(err => console.error('Analytics error:', err));

    res.status(200).json({
      success: true,
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProjects: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project (public)
// @access  Public
router.get('/:id', dbAvailabilityGuard, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment view count
    project.views += 1;
    await project.save();

    // Track project view analytics
    const analyticsData = new Analytics({
      event: 'project_view',
      page: `/projects/${project._id}`,
      projectId: project._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      metadata: {
        projectTitle: project.title,
        category: project.category
      }
    });
    
    await analyticsData.save().catch(err => console.error('Analytics error:', err));

    res.status(200).json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project (admin only)
// @access  Private
router.post('/', [
  dbAvailabilityGuard,
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required (max 100 characters)'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required (max 500 characters)'),
  body('technologies').isArray({ min: 1 }).withMessage('At least one technology is required'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('category').isIn(['frontend', 'backend', 'fullstack', 'mobile', 'design']).withMessage('Invalid category'),
  body('status').optional().isIn(['completed', 'in-progress', 'planned']).withMessage('Invalid status')
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

    const project = new Project(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project (admin only)
// @access  Private
router.put('/:id', [
  dbAvailabilityGuard,
  auth,
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1-500 characters'),
  body('technologies').optional().isArray({ min: 1 }).withMessage('At least one technology is required'),
  body('image').optional().isURL().withMessage('Valid image URL is required'),
  body('category').optional().isIn(['frontend', 'backend', 'fullstack', 'mobile', 'design']).withMessage('Invalid category'),
  body('status').optional().isIn(['completed', 'in-progress', 'planned']).withMessage('Invalid status')
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

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update project fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        project[key] = req.body[key];
      }
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (admin only)
// @access  Private
router.delete('/:id', [dbAvailabilityGuard, auth], async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/projects/:id/like
// @desc    Like/unlike project (public)
// @access  Public
router.patch('/:id/like', dbAvailabilityGuard, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Simple like increment (in production, you'd track user likes)
    project.likes += 1;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project liked successfully',
      likes: project.likes
    });

  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/projects/:id/feature
// @desc    Toggle project featured status (admin only)
// @access  Private
router.patch('/:id/feature', [dbAvailabilityGuard, auth], async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
      project
    });

  } catch (error) {
    console.error('Feature project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/stats/overview
// @desc    Get projects statistics (admin only)
// @access  Private
router.get('/stats/overview', [dbAvailabilityGuard, auth], async (req, res) => {
  try {
    const [
      totalProjects,
      featuredProjects,
      projectsByCategory,
      projectsByStatus,
      totalViews,
      totalLikes
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        featuredProjects,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
        categories: projectsByCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        statuses: projectsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
