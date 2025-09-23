const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    enum: ['page_view', 'project_view', 'contact_form', 'download_resume', 'skill_hover', 'social_click']
  },
  page: {
    type: String,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    default: 'unknown'
  },
  referrer: {
    type: String
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop'
    },
    browser: String,
    os: String
  },
  sessionId: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
analyticsSchema.index({ event: 1, createdAt: -1 });
analyticsSchema.index({ page: 1, createdAt: -1 });
analyticsSchema.index({ projectId: 1 });
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
