const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Robust connect-mongo import (works across CommonJS / ESM builds and Node 22)
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const productRoutesV2 = require('./routes/productsV2');
const mensFashionRoutes = require('./routes/mensFashion');
const userRoutes = require('./routes/users');
const userProfileRoutes = require('./routes/user'); // User profile management routes
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminOrdersRoutes = require('./routes/adminOrders');
const dashboardRoutes = require('./routes/dashboard');
const categoryRoutes = require('./routes/categories');
const reviewRoutes = require('./routes/reviews');

// Import session middleware
const { sessionActivityTracker } = require('./middleware/sessionManager');

// Import admin initialization utility
const { initializeAdminUser } = require('./utils/seedUtils');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More requests allowed in development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// CORS configuration
// Development: allow all localhost origins (Vite, CRA, etc.)
// Production: restrict to configured domain(s)
const devCorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman) or any localhost origin
    // Explicitly allow Vite dev server on port 5173
    if (!origin || 
        origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') ||
        origin.includes('localhost:5173') ||
        origin.includes('127.0.0.1:5173')) {
      return callback(null, true);
    }
    console.log('⚠️  CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true, // Required for cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
};

const prodCorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Get allowed origins from environment variable
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [];

    // Always allow Vercel preview deployments (*.vercel.app)
    const isVercelDomain = origin.includes('.vercel.app');
    
    // Allow common deployment platforms
    const isAllowedPlatform = 
      origin.includes('.vercel.app') ||
      origin.includes('.netlify.app') ||
      origin.includes('.github.io') ||
      origin.includes('.railway.app') ||
      origin.includes('.render.com');
    
    // Check if origin is in allowed list or is from an allowed platform
    if (allowedOrigins.includes(origin) || isVercelDomain || isAllowedPlatform) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }

    console.log('⚠️  CORS blocked origin:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);
    console.log('💡 Tip: Add origin to CORS_ORIGIN env variable or it must be from .vercel.app domain');
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

const corsOptions = process.env.NODE_ENV === 'production' ? prodCorsOptions : devCorsOptions;
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Body parsing & cookie middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration with MongoDB store
const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = {
  name: 'ecom.sid',
  secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me_in_production',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on activity
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
  }
};

// Use MongoDB-backed session store in production for persistence (Render / Atlas)
if (isProduction) {
  const mongoSessionUrl = process.env.MONGO_URI;

  if (!mongoSessionUrl) {
    console.warn('⚠️  No MONGO_URI set for session store. Falling back to in-memory sessions.');
  } else {
    sessionConfig.store = MongoStore.create({
      mongoUrl: mongoSessionUrl,
      mongoOptions: {
        dbName: process.env.DB_NAME || 'ecommerce'
      },
      touchAfter: 24 * 3600, // Lazy session update (24 hours)
      ttl: 24 * 60 * 60, // Session TTL (24 hours)
      autoRemove: 'native', // Let MongoDB handle expired sessions
      collectionName: 'sessions'
    });
  }
}

app.use(session(sessionConfig));

// MongoDB connection with better error handling and status tracking
let mongoConnectionStatus = {
  connected: false,
  state: 'disconnected',
  connectionString: null,
  error: null
};

const connectMongoDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ Missing required environment variable: MONGO_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);

    mongoConnectionStatus = {
      connected: true,
      state: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
      connectionString: mongoURI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      error: null
    };

    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    // Initialize default admin user after successful connection
    setTimeout(async () => {
      try {
        await initializeAdminUser();
      } catch (error) {
        console.error('⚠️  Failed to initialize admin user:', error.message);
      }
    }, 1000); // Small delay to ensure connection is fully established

    // Listen to connection events
    mongoose.connection.on('connected', () => {
      mongoConnectionStatus.connected = true;
      mongoConnectionStatus.state = 'connected';
      console.log('✅ MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      mongoConnectionStatus.connected = false;
      mongoConnectionStatus.state = 'error';
      mongoConnectionStatus.error = err.message;
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      mongoConnectionStatus.connected = false;
      mongoConnectionStatus.state = 'disconnected';
      console.log('⚠️ MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    mongoConnectionStatus = {
      connected: false,
      state: 'error',
      connectionString: mongoURI.replace(/\/\/.*@/, '//***:***@'),
      error: error.message
    };

    console.error('❌ MongoDB connection error:', error.message);

    console.log('� Please ensure MongoDB is reachable and your MONGO_URI is correct');
    process.exit(1);
  }
};

// Connect to MongoDB
connectMongoDB();

// Session activity tracking middleware
app.use(sessionActivityTracker);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Main product routes (existing)
app.use('/api/v2/products', productRoutesV2); // New v2 product routes (section + slug based)
app.use('/api/mens-fashion', mensFashionRoutes); // Men's fashion specific routes
app.use('/api/users', userRoutes); // Existing user routes (wishlist, etc.)
app.use('/api/user', userProfileRoutes); // User profile management routes
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminOrdersRoutes);
app.use('/api/admin', dashboardRoutes); // Admin dashboard stats
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check route with MongoDB status
app.get('/api/health', (req, res) => {
  const mongooseState = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = mongooseState[mongoose.connection.readyState] || 'unknown';
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    message: isConnected ? 'Server is running and MongoDB is connected!' : 'Server is running but MongoDB is not connected',
    timestamp: new Date().toISOString(),
    database: {
      status: dbState,
      connected: isConnected,
      name: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
      port: mongoose.connection.port || null,
      readyState: mongoose.connection.readyState
    }
  });
});

// MongoDB connection status endpoint
app.get('/api/db/status', (req, res) => {
  const mongooseState = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = mongooseState[mongoose.connection.readyState] || 'unknown';
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    message: isConnected ? 'MongoDB is connected' : 'MongoDB is not connected',
    connection: {
      status: dbState,
      connected: isConnected,
      readyState: mongoose.connection.readyState,
      database: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
      port: mongoose.connection.port || null,
      connectionString: mongoConnectionStatus.connectionString,
      error: mongoConnectionStatus.error
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});