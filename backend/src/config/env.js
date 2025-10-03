// Environment validation and helpers

// Critical vars required for production startup
const REQUIRED_VARS = [
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'MONGODB_URI'
];

// Optional vars (helpful but not fatal if missing)
const OPTIONAL_VARS = [
  'JWT_EXPIRE',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
  'FRONTEND_URL',
  'PORT',
  'NODE_ENV'
];

function validateEnv() {
  const envMode = process.env.NODE_ENV || 'development';

  // Determine missing required variables
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (envMode === 'production') {
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables for production:');
      missing.forEach((key) => console.error(`   - ${key}`));
      console.error('🚫 Server cannot start without these variables. Set them and retry.');
      // Fail fast in production
      process.exit(1);
    }
  } else {
    if (missing.length > 0) {
      console.log('⚠️  Missing required environment variables:');
      missing.forEach((key) => console.log(`   - ${key}`));
      console.log('💡 Add them to your .env file. The server will start, but some features may not work.');
    }
  }

  // Normalize and provide soft defaults
  if (!process.env.JWT_EXPIRE) {
    process.env.JWT_EXPIRE = '7d';
    console.log("ℹ️  JWT_EXPIRE not set. Defaulting to '7d'.");
  }

  if (process.env.EMAIL_PORT && !Number.isFinite(Number(process.env.EMAIL_PORT))) {
    console.log('⚠️  EMAIL_PORT is not a number. Expected a numeric port like 587.');
  }

  if (!process.env.FRONTEND_URL) {
    console.log('ℹ️  FRONTEND_URL not set. Falling back to local dev URLs.');
  }

  return {
    missing,
    optional: OPTIONAL_VARS.reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {})
  };
}

module.exports = { validateEnv };


