const mongoose = require('mongoose');

// Middleware to enforce maintenance mode and DB availability for DB-dependent routes
function dbAvailabilityGuard(req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  const maintenanceEnabled = String(process.env.MAINTENANCE_MODE || 'false').toLowerCase() === 'true';

  if (maintenanceEnabled) {
    if (!isProduction) {
      console.warn('🟠 MAINTENANCE_MODE enabled — responding with 503');
    }
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable, please try again later.'
    });
  }

  // If app expects a DB (MONGODB_URI provided) ensure we are connected
  const expectsDb = Boolean(process.env.MONGODB_URI);
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  if (expectsDb && !isDbConnected) {
    if (!isProduction) {
      console.warn('🟠 Database not connected — responding with 503 for DB-dependent route');
    }
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable, please try again later.'
    });
  }

  next();
}

module.exports = { dbAvailabilityGuard };


