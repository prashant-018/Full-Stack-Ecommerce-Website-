/**
 * MongoDB Connection Checker
 * Run: node check-mongodb.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(colors.blue + '🔍 Checking MongoDB Connection...\n' + colors.reset);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Get MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
console.log('Connection String:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
console.log('');

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000,
};

// Try to connect
mongoose.connect(mongoURI, options)
  .then(() => {
    console.log(colors.green + '✅ MongoDB Connected Successfully!' + colors.reset);
    console.log('');
    console.log('Connection Details:');
    console.log('  Database:', mongoose.connection.name);
    console.log('  Host:', mongoose.connection.host);
    console.log('  Port:', mongoose.connection.port);
    console.log('  Ready State:', mongoose.connection.readyState);
    console.log('');
    
    // Check if we can query
    mongoose.connection.db.admin().ping()
      .then(() => {
        console.log(colors.green + '✅ Database Ping Successful!' + colors.reset);
        console.log('');
        
        // List collections
        mongoose.connection.db.listCollections().toArray()
          .then(collections => {
            console.log('Collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None');
            console.log('');
            
            // Check users collection
            if (collections.some(c => c.name === 'users')) {
              mongoose.connection.db.collection('users').countDocuments()
                .then(count => {
                  console.log('Users in database:', count);
                  console.log('');
                  console.log(colors.green + '🎉 MongoDB is fully operational!' + colors.reset);
                  mongoose.connection.close();
                  process.exit(0);
                })
                .catch(err => {
                  console.log(colors.yellow + '⚠️  Could not count users:' + colors.reset, err.message);
                  mongoose.connection.close();
                  process.exit(0);
                });
            } else {
              console.log('Users collection: Not found (will be created on first user registration)');
              console.log('');
              console.log(colors.green + '🎉 MongoDB is ready to use!' + colors.reset);
              mongoose.connection.close();
              process.exit(0);
            }
          })
          .catch(err => {
            console.log(colors.yellow + '⚠️  Could not list collections:' + colors.reset, err.message);
            mongoose.connection.close();
            process.exit(0);
          });
      })
      .catch(err => {
        console.log(colors.red + '❌ Database Ping Failed!' + colors.reset);
        console.log('Error:', err.message);
        mongoose.connection.close();
        process.exit(1);
      });
  })
  .catch((error) => {
    console.log(colors.red + '❌ MongoDB Connection Failed!' + colors.reset);
    console.log('');
    console.log('Error Details:');
    console.log('  Message:', error.message);
    console.log('');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log(colors.yellow + '💡 MongoDB is not running or not accessible' + colors.reset);
      console.log('');
      console.log('Solutions:');
      console.log('  1. Start MongoDB service:');
      console.log('     Windows: net start MongoDB');
      console.log('     Mac/Linux: sudo systemctl start mongod');
      console.log('');
      console.log('  2. Check if MongoDB is running on port 27017');
      console.log('  3. Verify MONGODB_URI in .env file');
    } else if (error.message.includes('authentication failed')) {
      console.log(colors.yellow + '💡 Authentication failed' + colors.reset);
      console.log('  Check username and password in MONGODB_URI');
    } else if (error.message.includes('timeout')) {
      console.log(colors.yellow + '💡 Connection timeout' + colors.reset);
      console.log('  MongoDB might be slow to respond or not accessible');
    }
    
    console.log('');
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log(colors.green + '📡 Connection event: connected' + colors.reset);
});

mongoose.connection.on('error', (err) => {
  console.log(colors.red + '❌ Connection event: error' + colors.reset);
  console.log('Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log(colors.yellow + '⚠️  Connection event: disconnected' + colors.reset);
});

