const express = require('express');
const Analytics = require('../models/Analytics');
const Contact = require('../models/Contact');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();
const { dbAvailabilityGuard } = require('../middleware/dbStatus');

// @route   POST /api/analytics/track
// @desc    Track analytics event (public)
// @access  Public
router.post('/track', dbAvailabilityGuard, async (req, res) => {
  try {
    const { event, page, projectId, metadata } = req.body;
    
    if (!event || !page) {
      return res.status(400).json({
        success: false,
        message: 'Event and page are required'
      });
    }

    const analyticsData = new Analytics({
      event,
      page,
      projectId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      metadata
    });

    await analyticsData.save();

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get analytics dashboard data (admin only)
// @access  Private
router.get('/dashboard', [dbAvailabilityGuard, auth], async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    // Run all analytics queries in parallel
    const [
      totalPageViews,
      uniqueVisitors,
      contactFormSubmissions,
      projectViews,
      topPages,
      eventBreakdown,
      dailyStats,
      contactStats,
      projectStats
    ] = await Promise.all([
      // Total page views
      Analytics.countDocuments({
        event: 'page_view',
        createdAt: { $gte: startDate }
      }),
      
      // Unique visitors (by IP)
      Analytics.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$ipAddress' } },
        { $count: 'uniqueVisitors' }
      ]),
      
      // Contact form submissions
      Analytics.countDocuments({
        event: 'contact_form',
        createdAt: { $gte: startDate }
      }),
      
      // Project views
      Analytics.countDocuments({
        event: 'project_view',
        createdAt: { $gte: startDate }
      }),
      
      // Top pages
      Analytics.aggregate([
        { $match: { event: 'page_view', createdAt: { $gte: startDate } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Event breakdown
      Analytics.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$event', count: { $sum: 1 } } }
      ]),
      
      // Daily stats
      Analytics.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            pageViews: { $sum: { $cond: [{ $eq: ['$event', 'page_view'] }, 1, 0] } },
            projectViews: { $sum: { $cond: [{ $eq: ['$event', 'project_view'] }, 1, 0] } },
            contactForms: { $sum: { $cond: [{ $eq: ['$event', 'contact_form'] }, 1, 0] } }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Contact stats
      Contact.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Project stats
      Project.aggregate([
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: '$likes' },
            featuredProjects: { $sum: { $cond: ['$featured', 1, 0] } }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      period,
      dateRange: {
        start: startDate,
        end: now
      },
      summary: {
        totalPageViews,
        uniqueVisitors: uniqueVisitors[0]?.uniqueVisitors || 0,
        contactFormSubmissions,
        projectViews
      },
      topPages: topPages.map(page => ({
        page: page._id,
        views: page.count
      })),
      events: eventBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      dailyStats,
      contactStats: contactStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      projectStats: projectStats[0] || {
        totalProjects: 0,
        totalViews: 0,
        totalLikes: 0,
        featuredProjects: 0
      }
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/popular-projects
// @desc    Get most popular projects (admin only)
// @access  Private
router.get('/popular-projects', [dbAvailabilityGuard, auth], async (req, res) => {
  try {
    const { period = '30d', limit = 10 } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
    }

    const popularProjects = await Analytics.aggregate([
      { 
        $match: { 
          event: 'project_view',
          projectId: { $exists: true },
          createdAt: { $gte: startDate }
        }
      },
      { $group: { _id: '$projectId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'project'
        }
      },
      { $unwind: '$project' },
      {
        $project: {
          _id: 1,
          views: 1,
          title: '$project.title',
          category: '$project.category',
          totalViews: '$project.views',
          totalLikes: '$project.likes'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      period,
      projects: popularProjects
    });

  } catch (error) {
    console.error('Popular projects analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
