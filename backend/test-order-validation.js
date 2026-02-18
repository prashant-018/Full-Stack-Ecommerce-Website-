/**
 * Test order validation to see what's failing
 */

const { body, validationResult } = require('express-validator');

// Sample order payload (what frontend should send)
const samplePayload = {
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890"
  },
  items: [{
    product: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId
    name: "Test Product",
    price: 100,
    quantity: 1,
    size: "M",
    color: "Black",
    image: "/test.jpg"
  }],
  shippingAddress: {
    fullName: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    phone: "1234567890"
  },
  paymentMethod: "COD",
  subtotal: 100,
  shipping: 10,
  tax: 8,
  discount: 0,
  total: 118
};

console.log('✅ Valid Order Payload:');
console.log(JSON.stringify(samplePayload, null, 2));

console.log('\n📋 Required Fields:');
console.log('- items: array with at least 1 item');
console.log('- items[].product OR items[].productId: MongoDB ObjectId');
console.log('- items[].name: string');
console.log('- items[].price: number >= 0');
console.log('- items[].quantity: integer >= 1');
console.log('- items[].size: string');
console.log('- items[].color: string');
console.log('- shippingAddress: object with fullName, address, city, state, zipCode, phone');
console.log('- paymentMethod: "COD" or "CARD" (case insensitive)');
console.log('- subtotal: number >= 0');
console.log('- total: number >= 0');

console.log('\n⚠️ Common Validation Failures:');
console.log('1. items[].product is not a valid MongoDB ObjectId (24 hex characters)');
console.log('2. items[].price is not a number or is negative');
console.log('3. items[].quantity is not an integer or is less than 1');
console.log('4. shippingAddress is missing required fields');
console.log('5. paymentMethod is not "COD" or "CARD"');

console.log('\n🔍 MongoDB ObjectId Format:');
console.log('Valid:   "507f1f77bcf86cd799439011" (24 hex characters)');
console.log('Invalid: "jeans" (not ObjectId format)');
console.log('Invalid: "123" (too short)');
console.log('Invalid: undefined or null');
