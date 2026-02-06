# Admin User Setup Guide

This guide explains how to set up the default admin user for your ecommerce backend.

## Default Admin Credentials

```
Email: admin@gmail.com
Password: prashant123
Role: admin
```

## Automatic Setup (Recommended)

The admin user is automatically created when the server starts up. No manual intervention required.

### How it works:
1. Server connects to MongoDB
2. Checks if admin user exists
3. Creates admin user if it doesn't exist
4. Logs the result to console

### Console Output:
```
✅ Admin user already exists
📧 Email: admin@gmail.com
👤 Name: Admin User
🔐 Role: admin
```

OR

```
🚀 Creating default admin user...
✅ Admin user created successfully!
📧 Email: admin@gmail.com
👤 Name: Admin User
🔐 Role: admin
🆔 ID: 507f1f77bcf86cd799439011
```

## Manual Setup Options

### Option 1: Run Seed Script
```bash
npm run seed:admin
```

### Option 2: Direct Script Execution
```bash
node scripts/seedAdmin.js
```

## Testing Admin Login

### Test Script
```bash
npm run test:admin
```

### Manual Test via API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "prashant123"
  }'
```

## Security Features

### Password Hashing
- Passwords are automatically hashed using bcrypt
- Salt rounds: 12 (configurable via `BCRYPT_SALT_ROUNDS` env var)
- Original password is never stored

### Role-Based Access
- Admin role: `admin`
- User role: `user`
- Role validation in middleware

### Account Security
- Account is active by default (`isActive: true`)
- Email uniqueness enforced
- Password minimum length: 6 characters

## File Structure

```
backend/
├── scripts/
│   ├── seedAdmin.js          # Standalone admin seeding script
│   └── testAdminLogin.js     # Admin login test script
├── utils/
│   └── seedUtils.js          # Server startup utilities
├── models/
│   └── User.js               # User model with bcrypt hashing
└── server.js                 # Server with auto-initialization
```

## Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# JWT (for authentication)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
```

## Troubleshooting

### Admin User Not Created
1. Check MongoDB connection
2. Verify User model is properly imported
3. Check console logs for errors
4. Run manual seed script: `npm run seed:admin`

### Login Issues
1. Verify admin user exists: `npm run test:admin`
2. Check password is correct: `prashant123`
3. Ensure bcrypt is working properly
4. Check JWT configuration

### Database Issues
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. Verify database permissions
4. Check network connectivity

## Production Considerations

### Security Recommendations
1. **Change default password** immediately in production
2. Use strong, unique passwords
3. Enable 2FA if available
4. Regular password rotation
5. Monitor admin access logs

### Environment Setup
```env
NODE_ENV=production
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=strong_random_secret_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
```

### Deployment Checklist
- [ ] Change default admin password
- [ ] Set strong JWT secret
- [ ] Configure production MongoDB
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Enable security headers

## API Endpoints

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "prashant123"
}
```

### Get Profile
```
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Admin Routes
All admin routes require authentication and admin role:
- `GET /api/admin/*` - Admin dashboard data
- `POST /api/admin/*` - Admin operations
- `PUT /api/admin/*` - Admin updates
- `DELETE /api/admin/*` - Admin deletions

## Support

If you encounter issues:
1. Check the console logs
2. Run the test script: `npm run test:admin`
3. Verify your environment variables
4. Check MongoDB connection
5. Review the troubleshooting section above