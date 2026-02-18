const session = require('express-session');
const MongoStore = require('connect-mongo');

/**
 * Session configuration with MongoDB store for production
 * and memory store for development
 */
const createSessionConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseConfig = {
    name: 'ecom.sid', // Session cookie name
    secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me_in_production',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    rolling: true, // Reset expiry on activity
    cookie: {
      httpOnly: true, // Prevent XSS attacks
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
    }
  };

  // Use MongoDB store in production for session persistence
  if (isProduction) {
    baseConfig.store = MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600, // Lazy session update (24 hours)
      ttl: 24 * 60 * 60, // Session TTL (24 hours)
      autoRemove: 'native', // Let MongoDB handle expired sessions
      collectionName: 'sessions',
      stringify: false
    });
  }

  return baseConfig;
};

module.exports = createSessionConfig;