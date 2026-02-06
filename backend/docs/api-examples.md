# Review System API Examples

## POST /api/reviews - Add Review

### Request
```json
{
  "productId": "60d5ecb74b24a1234567890a",
  "rating": 5,
  "title": "Amazing quality and fit!",
  "comment": "I absolutely love this product. The quality is outstanding and it fits perfectly. Highly recommend!",
  "sizeFit": "True to Size"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Review added successfully",
  "review": {
    "_id": "60d5ecb74b24a1234567890b",
    "userId": "60d5ecb74b24a1234567890c",
    "userName": "Sarah Mitchell",
    "productId": "60d5ecb74b24a1234567890a",
    "rating": 5,
    "title": "Amazing quality and fit!",
    "comment": "I absolutely love this product. The quality is outstanding and it fits perfectly. Highly recommend!",
    "sizeFit": "True to Size",
    "verifiedBuyer": true,
    "isApproved": true,
    "helpfulCount": 0,
    "reportCount": 0,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z",
    "timeAgo": "2 days ago"
  }
}
```

### Response (Error - Already Reviewed)
```json
{
  "success": false,
  "message": "You have already reviewed this product"
}
```

### Response (Error - Validation)
```json
{
  "success": false,
  "message": "All fields are required"
}
```

## GET /api/reviews/:productId - Get Product Reviews

### Request Parameters
- `productId`: Product ID (required)
- `page`: Page number (optional, default: 1)
- `limit`: Items per page (optional, default: 10)
- `sortBy`: Sort criteria (optional, default: 'newest')
  - `newest`: Newest first
  - `oldest`: Oldest first
  - `highest`: Highest rating first
  - `lowest`: Lowest rating first
  - `helpful`: Most helpful first
- `rating`: Filter by rating (optional, 1-5)

### Example Request
```
GET /api/reviews/60d5ecb74b24a1234567890a?page=1&limit=10&sortBy=newest
```

### Response
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "60d5ecb74b24a1234567890b",
      "userId": {
        "_id": "60d5ecb74b24a1234567890c",
        "name": "Sarah Mitchell",
        "avatar": null
      },
      "userName": "Sarah Mitchell",
      "productId": "60d5ecb74b24a1234567890a",
      "rating": 5,
      "title": "Amazing quality and fit!",
      "comment": "I absolutely love this product. The quality is outstanding and it fits perfectly. Highly recommend!",
      "sizeFit": "True to Size",
      "verifiedBuyer": true,
      "helpfulCount": 12,
      "timeAgo": "2 days ago",
      "createdAt": "2023-12-01T10:30:00.000Z"
    },
    {
      "_id": "60d5ecb74b24a1234567890d",
      "userId": {
        "_id": "60d5ecb74b24a1234567890e",
        "name": "Jessica Chen"
      },
      "userName": "Jessica Chen",
      "productId": "60d5ecb74b24a1234567890a",
      "rating": 4,
      "title": "Great quality, runs a bit small",
      "comment": "Beautiful craftsmanship and the material feels premium. However, I found it runs about half a size smaller than expected.",
      "sizeFit": "Runs Small",
      "verifiedBuyer": true,
      "helpfulCount": 8,
      "timeAgo": "5 days ago",
      "createdAt": "2023-11-28T14:20:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalReviews": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "ratingStats": {
    "averageRating": 4.3,
    "totalReviews": 25,
    "distribution": {
      "5": 12,
      "4": 8,
      "3": 3,
      "2": 1,
      "1": 1
    }
  },
  "sizeFitStats": {
    "recommendation": "True to Size",
    "percentage": 68,
    "breakdown": {
      "Runs Small": 5,
      "True to Size": 17,
      "Runs Large": 3
    }
  }
}
```

## DELETE /api/reviews/:id - Delete Review (Admin Only)

### Request
```
DELETE /api/reviews/60d5ecb74b24a1234567890b
Authorization: Bearer <admin_token>
```

### Response (Success)
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Response (Error - Not Found)
```json
{
  "success": false,
  "message": "Review not found"
}
```

### Response (Error - Unauthorized)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

## PUT /api/reviews/:id/helpful - Mark Review as Helpful

### Request
```
PUT /api/reviews/60d5ecb74b24a1234567890b/helpful
Authorization: Bearer <user_token>
```

### Response
```json
{
  "success": true,
  "helpfulCount": 13
}
```

## GET /api/reviews/admin/all - Get All Reviews (Admin)

### Request Parameters
- `page`: Page number (optional, default: 1)
- `limit`: Items per page (optional, default: 20)
- `status`: Filter by status (optional, default: 'all')
  - `all`: All reviews
  - `approved`: Approved reviews only
  - `pending`: Pending reviews only

### Example Request
```
GET /api/reviews/admin/all?page=1&limit=20&status=all
Authorization: Bearer <admin_token>
```

### Response
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "60d5ecb74b24a1234567890b",
      "userId": {
        "_id": "60d5ecb74b24a1234567890c",
        "name": "Sarah Mitchell",
        "email": "sarah@example.com"
      },
      "userName": "Sarah Mitchell",
      "productId": {
        "_id": "60d5ecb74b24a1234567890a",
        "name": "Premium Cotton T-Shirt",
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "alt": "Premium Cotton T-Shirt"
          }
        ]
      },
      "rating": 5,
      "title": "Amazing quality and fit!",
      "comment": "I absolutely love this product. The quality is outstanding and it fits perfectly.",
      "sizeFit": "True to Size",
      "verifiedBuyer": true,
      "isApproved": true,
      "helpfulCount": 12,
      "reportCount": 0,
      "createdAt": "2023-12-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalReviews": 98
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. Please log in."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error while adding review"
}
```

## Review Data Structure

### Review Schema
```javascript
{
  userId: ObjectId,           // Reference to User
  userName: String,           // User's display name
  productId: ObjectId,        // Reference to Product
  rating: Number,             // 1-5 stars
  title: String,              // Review title (max 100 chars)
  comment: String,            // Review text (max 1000 chars)
  sizeFit: String,            // "Runs Small" | "True to Size" | "Runs Large"
  verifiedBuyer: Boolean,     // Whether user purchased the product
  isApproved: Boolean,        // Admin approval status
  helpfulCount: Number,       // Number of helpful votes
  reportCount: Number,        // Number of reports
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### Virtual Fields
- `timeAgo`: Human-readable time since creation (e.g., "2 days ago")

### Indexes
- Compound index on `userId` and `productId` (unique)
- Index on `productId` and `createdAt` (for efficient queries)
- Index on `rating` (for filtering)
- Index on `isApproved` (for admin queries)