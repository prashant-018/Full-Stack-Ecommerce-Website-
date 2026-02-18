# Admin Orders API Schema Fix

## Problem
Admin order routes were using old field names after Order schema was updated, causing 500 Internal Server Errors.

## Schema Changes
```javascript
// OLD SCHEMA
{
  user: ObjectId,
  items: [{ product: ObjectId }],
  total: Number,
  customerInfo: { name, email }
}

// NEW SCHEMA
{
  userId: ObjectId,
  items: [{ productId: ObjectId }],
  totalAmount: Number
  // customerInfo removed
}
```

## Fixes Applied

### 1. GET /api/admin/orders

**Changed:**
- `.populate('user')` → `.populate('userId')`
- `.populate('items.product')` → `.populate('items.productId')`
- `order.user` → `order.userId`
- `item.product` → `item.productId`
- `orderObj.total` → `orderObj.totalAmount`
- Removed `customerInfo` search filters

**Before:**
```javascript
.populate('user', 'name email')
.populate({ path: 'items.product', select: '...' })

customer = order.user ? {
  name: order.user.name,
  email: order.user.email
} : {
  name: order.customerInfo?.name,
  email: order.customerInfo?.email
}
```

**After:**
```javascript
.populate('userId', 'name email')
.populate({ path: 'items.productId', select: '...' })

customer = order.userId ? {
  name: order.userId.name,
  email: order.userId.email
} : {
  name: 'Guest Customer',
  email: 'No email'
}
```

### 2. GET /api/admin/orders/stats

**Changed:**
- Aggregation: `$sum: '$total'` → `$sum: '$totalAmount'`
- `.populate('user')` → `.populate('userId')`
- `.select('... total ...')` → `.select('... totalAmount ...')`
- `order.user` → `order.userId`
- `order.total` → `order.totalAmount`
- Removed `customerInfo` references

**Before:**
```javascript
const statusStats = await Order.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalAmount: { $sum: '$total' }  // ❌ Wrong field
    }
  }
]);

const revenueResult = await Order.aggregate([
  { $match: { status: { $in: ['delivered'] } } },
  { $group: { _id: null, total: { $sum: '$total' } } }  // ❌ Wrong field
]);

const recentOrders = await Order.find()
  .populate('user', 'name email')  // ❌ Wrong field
  .select('orderNumber customerInfo total status createdAt user');  // ❌ Wrong fields
```

**After:**
```javascript
const statusStats = await Order.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalAmount: { $sum: '$totalAmount' }  // ✅ Correct field
    }
  }
]);

const revenueResult = await Order.aggregate([
  { $match: { status: { $in: ['delivered'] } } },
  { $group: { _id: null, total: { $sum: '$totalAmount' } } }  // ✅ Correct field
]);

const recentOrders = await Order.find()
  .populate('userId', 'name email')  // ✅ Correct field
  .select('orderNumber totalAmount status createdAt userId');  // ✅ Correct fields
```

### 3. PUT /api/admin/orders/:id/status

**Changed:**
- `.populate('user')` → `.populate('userId')`
- `.populate('items.product')` → `.populate('items.productId')`
- Removed `statusHistory` push (field doesn't exist in schema)
- Removed `cancelledAt` assignment (field doesn't exist in schema)

**Before:**
```javascript
await order.populate('user', 'name email');
await order.populate({ path: 'items.product', select: '...' });

order.statusHistory.push({...});  // ❌ Field doesn't exist
order.cancelledAt = new Date();   // ❌ Field doesn't exist
```

**After:**
```javascript
await order.populate('userId', 'name email');
await order.populate({ path: 'items.productId', select: '...' });

// statusHistory and cancelledAt removed
// Add these fields to Order model if needed
```

### 4. DELETE /api/admin/orders/:id

**Changed:**
- `order.customerInfo` → removed
- `order.total` → `order.totalAmount`
- `deletedOrder.customerInfo` → `deletedOrder.userId`
- `deletedOrder.total` → `deletedOrder.totalAmount`

**Before:**
```javascript
console.log('📦 Found order to delete:', {
  orderNumber: order.orderNumber,
  customerEmail: order.customerInfo?.email,  // ❌ Field doesn't exist
  total: order.total,                        // ❌ Wrong field name
  status: order.status
});

return res.json({
  data: {
    deletedOrder: {
      customerInfo: deletedOrder.customerInfo,  // ❌ Field doesn't exist
      total: deletedOrder.total                 // ❌ Wrong field name
    }
  }
});
```

**After:**
```javascript
console.log('📦 Found order to delete:', {
  orderNumber: order.orderNumber,
  userId: order.userId,              // ✅ Correct field
  totalAmount: order.totalAmount,    // ✅ Correct field
  status: order.status
});

return res.json({
  data: {
    deletedOrder: {
      userId: deletedOrder.userId,          // ✅ Correct field
      totalAmount: deletedOrder.totalAmount // ✅ Correct field
    }
  }
});
```

## Summary of Field Mappings

| Old Field | New Field | Location |
|-----------|-----------|----------|
| `user` | `userId` | Root level |
| `items[].product` | `items[].productId` | Items array |
| `total` | `totalAmount` | Root level |
| `customerInfo` | ❌ Removed | Root level |
| `statusHistory` | ❌ Not in schema | Root level |
| `cancelledAt` | ❌ Not in schema | Root level |
| `trackingNumber` | ❌ Not in schema | Root level |
| `notes` | ❌ Not in schema | Root level |

## Fields That Don't Exist in Current Schema

These fields are referenced in the code but don't exist in the Order model:
- `trackingNumber` - Used in status update
- `notes` - Used in status update
- `statusHistory` - Used in status update
- `cancelledAt` - Used in status update

**Recommendation:** If you need these fields, add them to the Order model:

```javascript
const orderSchema = new mongoose.Schema({
  // ... existing fields ...
  trackingNumber: String,
  notes: String,
  cancelledAt: Date,
  statusHistory: [{
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: Date,
    note: String
  }]
});
```

## Testing

Test these endpoints:
1. `GET /api/admin/orders` - Should return orders with correct field names
2. `GET /api/admin/orders/stats` - Should calculate stats correctly
3. `PUT /api/admin/orders/:id/status` - Should update order status
4. `DELETE /api/admin/orders/:id` - Should delete order

All should now work without 500 errors!

## What Was Wrong

1. **Populate paths:** Using old field names (`user`, `items.product`) instead of new ones (`userId`, `items.productId`)
2. **Aggregation queries:** Summing `$total` instead of `$totalAmount`
3. **Field access:** Accessing `order.user`, `order.total`, `order.customerInfo` which don't exist
4. **Response mapping:** Returning old field names in API responses

## Why It Failed

MongoDB/Mongoose couldn't:
- Populate `user` field (doesn't exist, should be `userId`)
- Populate `items.product` field (doesn't exist, should be `items.productId`)
- Sum `$total` field (doesn't exist, should be `$totalAmount`)
- Access `customerInfo` field (doesn't exist in schema)

This caused null reference errors and aggregation failures, resulting in 500 errors.
