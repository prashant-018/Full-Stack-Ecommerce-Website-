              # Backend Refactoring Plan

              ## Proposed Clean Structure

              ```
              backend/
              ├── config/
              │   ├── database.js          # MongoDB connection
              │   ├── session.js           # Session configuration
              │   └── constants.js         # App constants
              ├── controllers/
              │   ├── productController.js # Single product controller
              │   ├── authController.js    # Keep existing
              │   ├── cartController.js    # Keep existing
              │   ├── orderController.js   # Keep existing
              │   └── userController.js    # Keep existing
              ├── middleware/
              │   ├── auth.js              # Keep existing
              │   ├── admin.js             # Keep existing
              │   ├── validation.js        # Keep existing
              │   └── errorHandler.js      # Enhanced error handling
              ├── models/
              │   ├── Product.js           # Enhanced with slug
              │   ├── User.js              # Keep existing
              │   └── Order.js             # Keep existing
              ├── routes/
              │   ├── products.js          # Single unified product routes
              │   ├── auth.js              # Keep existing
              │   ├── cart.js              # Keep existing
              │   ├── orders.js            # Keep existing
              │   └── admin.js             # Admin-specific routes
              ├── services/
              │   ├── productService.js    # Business logic
              │   └── slugService.js       # Slug generation
              ├── utils/
              │   ├── seedData.js          # Single seed file
              │   ├── helpers.js           # Common utilities
              │   └── constants.js         # App constants
              ├── scripts/
              │   ├── seed.js              # Single seed script
              │   ├── createAdmin.js       # Keep this one
              │   └── cleanup.js           # Database cleanup
              └── server.js                # Main server file
              ```

              ## Key Changes

              1. **Single Product API**: Merge `/api/products` and `/api/mens-fashion`
              2. **Unified Controller**: One productController with proper section handling
              3. **Enhanced Model**: Add slug field and better validation
              4. **Clean Scripts**: Remove duplicates, keep only essential ones
              5. **Better Error Handling**: Graceful fallbacks instead of 500 errors
              6. **Frontend-Optimized**: APIs designed for frontend consumption

              ## API Structure

              ### Products API (`/api/products`)
              - `GET /api/products` - List products with filters (section, category, etc.)
              - `GET /api/products/slug/:slug` - Get product by slug
              - `GET /api/products/:id` - Get product by ID (fallback)
              - `POST /api/products` - Create product (admin)
              - `PUT /api/products/:id` - Update product (admin)
              - `DELETE /api/products/:id` - Delete product (admin)

              ### Specialized Endpoints
              - `GET /api/products/featured` - Featured products
              - `GET /api/products/new-arrivals` - New arrivals
              - `GET /api/products/search` - Search products
              - `GET /api/products/categories` - Get categories by section

              ## Section Handling
              - Products will have `section: 'men' | 'women'`
              - Frontend can filter: `/api/products?section=men`
              - Categories will be section-aware
              - Consistent slug generation: `mens-blue-shirt` vs `womens-red-dress`