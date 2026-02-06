# Backend API Structure for Product Management

## Required API Endpoints

### 1. GET /api/products
**Purpose**: Fetch all products for admin dashboard
**Headers**: 
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "originalPrice": 129.99,
        "category": "Men's Shirts",
        "section": "men",
        "sku": "SKU-001",
        "totalStock": 45,
        "isActive": true,
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "alt": "Product Image"
          }
        ],
        "description": "Product description",
        "brand": "Brand Name",
        "material": "100% Cotton"
      }
    ]
  }
}
```

### 2. GET /api/products/:id
**Purpose**: Fetch single product for editing
**Headers**: 
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
**Response**:
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "originalPrice": 129.99,
      "category": "Men's Shirts",
      "section": "men",
      "sku": "SKU-001",
      "totalStock": 45,
      "isActive": true,
      "images": [
        {
          "url": "https://example.com/image.jpg",
          "alt": "Product Image"
        }
      ],
      "description": "Product description",
      "brand": "Brand Name",
      "material": "100% Cotton"
    }
  }
}
```

### 3. PUT /api/products/:id
**Purpose**: Update existing product
**Headers**: 
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
**Request Body**:
```json
{
  "name": "Updated Product Name",
  "price": 89.99,
  "originalPrice": 99.99,
  "category": "Men's Shirts",
  "section": "men",
  "sku": "SKU-001",
  "totalStock": 50,
  "isActive": true,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Product Image"
    }
  ],
  "description": "Updated product description",
  "brand": "Brand Name",
  "material": "100% Cotton"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { /* updated product object */ }
  }
}
```

### 4. DELETE /api/products/:id
**Purpose**: Delete product
**Headers**: 
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```
**Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication failed"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "Product name is required",
    "price": "Price must be a positive number"
  }
}
```

## Backend Implementation Notes

1. **Authentication Middleware**: All product management endpoints should require admin authentication
2. **Validation**: Implement proper validation for required fields
3. **Error Handling**: Return consistent error responses
4. **Database**: Ensure proper indexing on frequently queried fields (sku, category, section)
5. **Image Handling**: Consider implementing image upload functionality in the future

## Sample Express.js Route Structure

```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/products - Get all products (admin only)
router.get('/', auth, admin, async (req, res) => {
  // Implementation
});

// GET /api/products/:id - Get single product (admin only)
router.get('/:id', auth, admin, async (req, res) => {
  // Implementation
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  // Implementation
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  // Implementation
});

module.exports = router;
```