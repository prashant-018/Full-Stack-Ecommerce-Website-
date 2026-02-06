# E-commerce Clothing Store - Backend API

A complete, production-ready REST API for an e-commerce clothing website built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management, wishlist
- **Product Management**: Full CRUD with advanced filtering, sorting, pagination
- **Category Management**: Hierarchical product categories
- **Shopping Cart**: Add, update, remove items with stock validation
- **Order Management**: Complete order lifecycle from creation to delivery
- **Inventory Management**: Real-time stock tracking per size/color

### Advanced Features
- **Infinite Scroll Support**: Pagination designed for infinite scroll UIs
- **Advanced Filtering**: Filter by category, size, color, price range, gender
- **Search Functionality**: Full-text search across products
- **Stock Management**: Automatic stock updates on orders
- **Order Tracking**: Status updates with history
- **Admin Dashboard**: Analytics and management endpoints

### Security & Performance
- **Security Headers**: Helmet.js for security headers
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive validation with express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Password Security**: bcrypt hashing with salt rounds

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js         # MongoDB connection configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product management
│   ├── cartController.js   # Shopping cart operations
│   └── orderController.js  # Order processing
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   ├── adminAuth.js       # Admin authorization middleware
│   ├── validation.js      # Input validation rules
│   └── errorHandler.js    # Error handling middleware
├── models/
│   ├── User.js            # User schema with authentication
│   ├── Product.js         # Product schema with variants
│   ├── Category.js        # Category schema
│   └── Order.js           # Order schema with tracking
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   ├── cart.js            # Cart routes
│   ├── orders.js          # Order routes
│   ├── users.js           # User management routes
│   └── categories.js      # Category routes
├── scripts/
│   └── seedData.js        # Database seeding script
├── .env.sample            # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Main application entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration
Copy the sample environment file and configure your settings:
```bash
cp .env.sample .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_clothing
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=12
```

### 3. Database Setup
Start MongoDB service and seed the database:
```bash
# Seed database with sample data
npm run seed
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000/api`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Include JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| POST | `/auth/logout` | Logout user | Private |

#### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/products` | Get all products with filters | Public |
| GET | `/products/:id` | Get single product | Public |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| GET | `/products/analytics` | Get product analytics | Admin |

#### Shopping Cart
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/cart` | Get user cart | Private |
| POST | `/cart/add` | Add item to cart | Private |
| PUT | `/cart/update/:itemId` | Update cart item | Private |
| DELETE | `/cart/remove/:itemId` | Remove cart item | Private |
| DELETE | `/cart/clear` | Clear entire cart | Private |

#### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/orders` | Create new order | Private |
| GET | `/orders` | Get user orders | Private |
| GET | `/orders/:id` | Get single order | Private |
| PUT | `/orders/:id/cancel` | Cancel order | Private |
| PUT | `/orders/:id/status` | Update order status | Admin |
| GET | `/orders/admin/all` | Get all orders | Admin |

#### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/:id` | Get single category | Public |
| POST | `/categories` | Create category | Admin |
| PUT | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |

### Query Parameters for Products

#### Filtering
- `category` - Filter by category name
- `subcategory` - Filter by subcategory
- `gender` - Filter by gender (men, women, unisex)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sizes` - Filter by sizes (comma-separated)
- `colors` - Filter by colors (comma-separated)
- `search` - Search in name and description
- `isNew` - Filter new products (true/false)
- `isFeatured` - Filter featured products (true/false)
- `onSale` - Filter products on sale (true/false)

#### Pagination & Sorting
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12, max: 100)
- `sortBy` - Sort field (name, price, createdAt, rating)
- `sortOrder` - Sort direction (asc, desc)

#### Example Requests
```bash
# Get men's t-shirts under $50, sorted by price
GET /api/products?gender=men&subcategory=t-shirts&maxPrice=50&sortBy=price&sortOrder=asc

# Get featured products with pagination
GET /api/products?isFeatured=true&page=2&limit=8

# Search for "jeans" in women's clothing
GET /api/products?search=jeans&gender=women
```

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can browse products, manage cart, place orders
- **Admin**: Full access to all endpoints, can manage products and orders

### JWT Token Structure
```json
{
  "userId": "user_id_here",
  "iat": 1640995200,
  "exp": 1643587200
}
```

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

## 🧪 Test Credentials

After running the seed script:

### Admin Account
- **Email**: admin@ecommerce.com
- **Password**: Admin123!

### Test Users
- **Email**: john@example.com / **Password**: Password123!
- **Email**: jane@example.com / **Password**: Password123!

## 📊 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  phone: String,
  addresses: [AddressSchema],
  cart: [CartItemSchema],
  wishlist: [ProductId],
  isActive: Boolean,
  lastLogin: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  salePrice: Number,
  category: ObjectId,
  subcategory: String,
  gender: String,
  images: [ImageSchema],
  colors: [ColorSchema],
  sizes: [SizeSchema],
  material: String,
  care: [String],
  features: [String],
  stock: Number,
  sku: String,
  isNew: Boolean,
  isFeatured: Boolean,
  isActive: Boolean
}
```

### Order Model
```javascript
{
  orderNumber: String,
  user: ObjectId,
  items: [OrderItemSchema],
  shippingAddress: AddressSchema,
  paymentMethod: String,
  paymentDetails: Object,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: String,
  trackingNumber: String,
  statusHistory: [StatusSchema]
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com
```

### Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set strong JWT secret
- [ ] Configure CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Recommended Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2**: Full control with load balancing
- **DigitalOcean**: Cost-effective with managed databases
- **Vercel**: Serverless deployment option

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run tests (when implemented)
```

### Code Style
- Use ESLint and Prettier for code formatting
- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Implement proper error handling
- Write descriptive commit messages

### Adding New Features
1. Create model in `/models` if needed
2. Add controller logic in `/controllers`
3. Create routes in `/routes`
4. Add validation in `/middleware/validation.js`
5. Update this README with new endpoints

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally or check your MongoDB URI

#### JWT Token Error
```bash
Error: JsonWebTokenError: invalid token
```
**Solution**: Check if JWT_SECRET is set correctly in .env file

#### Validation Errors
```bash
Error: Validation failed
```
**Solution**: Check request body format and required fields

#### Port Already in Use
```bash
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in .env or kill process using the port

### Debug Mode
Enable debug logging:
```bash
DEBUG=app:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🚀**