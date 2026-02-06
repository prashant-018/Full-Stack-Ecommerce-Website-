const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const seedProducts = async () => {
  try {
    console.log('🌱 Starting to seed products...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Create sample products
    const products = [
      // Men's Products
      {
        name: "Premium Cotton T-Shirt",
        description: "Ultra-soft premium cotton t-shirt with a modern fit. Perfect for everyday wear with superior comfort and durability.",
        price: 25,
        originalPrice: 30,
        category: "Men's T-Shirts",
        section: "men",
        images: [{
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
          alt: "Premium cotton t-shirt",
          isPrimary: true
        }],
        colors: [
          { name: "White", hex: "#ffffff" },
          { name: "Black", hex: "#000000" },
          { name: "Navy", hex: "#1e3a8a" }
        ],
        sizes: [
          { size: "S", stock: 25 },
          { size: "M", stock: 30 },
          { size: "L", stock: 28 },
          { size: "XL", stock: 20 }
        ],
        material: "100% Premium Cotton",
        care: ["Machine wash cold", "Tumble dry low"],
        features: ["Soft cotton", "Modern fit", "Durable"],
        sku: "MEN-TSHIRT-001",
        isNewArrival: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: "Slim Fit Jeans",
        description: "Classic slim fit jeans made from premium denim with stretch for comfort and style.",
        price: 70,
        originalPrice: 90,
        category: "Men's Jeans",
        section: "men",
        images: [{
          url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
          alt: "Slim fit jeans",
          isPrimary: true
        }],
        colors: [
          { name: "Dark Blue", hex: "#1e3a8a" },
          { name: "Black", hex: "#000000" }
        ],
        sizes: [
          { size: "30", stock: 12 },
          { size: "32", stock: 18 },
          { size: "34", stock: 20 },
          { size: "36", stock: 15 }
        ],
        material: "98% Cotton, 2% Elastane",
        care: ["Machine wash cold", "Hang dry"],
        features: ["Slim fit", "Stretch denim", "5-pocket design"],
        sku: "MEN-JEANS-001",
        isFeatured: true,
        isActive: true
      },
      {
        name: "Wool Blend Blazer",
        description: "Sophisticated wool blend blazer perfect for business or formal occasions.",
        price: 200,
        originalPrice: 250,
        category: "Men's Jackets",
        section: "men",
        images: [{
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
          alt: "Wool blend blazer",
          isPrimary: true
        }],
        colors: [
          { name: "Navy", hex: "#1e3a8a" },
          { name: "Charcoal", hex: "#374151" }
        ],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 }
        ],
        material: "70% Wool, 30% Polyester",
        care: ["Dry clean only"],
        features: ["Tailored fit", "Premium wool blend"],
        sku: "MEN-BLAZER-001",
        isNewArrival: true,
        isActive: true
      },

      // Women's Products
      {
        name: "Floral Summer Dress",
        description: "Beautiful floral print summer dress with a flattering A-line silhouette.",
        price: 65,
        originalPrice: 80,
        category: "Women's Dresses",
        section: "women",
        images: [{
          url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
          alt: "Floral summer dress",
          isPrimary: true
        }],
        colors: [
          { name: "Pink Floral", hex: "#f472b6" },
          { name: "Blue Floral", hex: "#3b82f6" }
        ],
        sizes: [
          { size: "XS", stock: 8 },
          { size: "S", stock: 15 },
          { size: "M", stock: 18 },
          { size: "L", stock: 12 }
        ],
        material: "100% Viscose",
        care: ["Hand wash cold", "Hang dry"],
        features: ["A-line silhouette", "Floral print"],
        sku: "WOMEN-DRESS-001",
        isNewArrival: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: "High-Waisted Skinny Jeans",
        description: "Trendy high-waisted skinny jeans with excellent stretch and recovery.",
        price: 50,
        originalPrice: 70,
        category: "Women's Jeans",
        section: "women",
        images: [{
          url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
          alt: "High-waisted skinny jeans",
          isPrimary: true
        }],
        colors: [
          { name: "Dark Wash", hex: "#1e3a8a" },
          { name: "Black", hex: "#000000" }
        ],
        sizes: [
          { size: "24", stock: 10 },
          { size: "26", stock: 15 },
          { size: "28", stock: 20 },
          { size: "30", stock: 18 }
        ],
        material: "92% Cotton, 6% Polyester, 2% Elastane",
        care: ["Machine wash cold", "Tumble dry low"],
        features: ["High-waisted", "Skinny fit", "Stretch denim"],
        sku: "WOMEN-JEANS-001",
        isFeatured: true,
        isActive: true
      },
      {
        name: "Silk Blouse",
        description: "Elegant silk blouse perfect for office or evening wear.",
        price: 85,
        originalPrice: 85,
        category: "Women's Tops",
        section: "women",
        images: [{
          url: "https://images.unsplash.com/photo-1564257577-0a8b7b0b8b0b?w=400&h=500&fit=crop",
          alt: "Silk blouse",
          isPrimary: true
        }],
        colors: [
          { name: "White", hex: "#ffffff" },
          { name: "Black", hex: "#000000" },
          { name: "Navy", hex: "#1e3a8a" }
        ],
        sizes: [
          { size: "XS", stock: 5 },
          { size: "S", stock: 12 },
          { size: "M", stock: 15 },
          { size: "L", stock: 10 }
        ],
        material: "100% Silk",
        care: ["Dry clean only", "Iron on low heat"],
        features: ["Pure silk", "Professional styling", "Versatile"],
        sku: "WOMEN-BLOUSE-001",
        isActive: true
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products successfully!`);

    console.log('\n📊 Products by section:');
    const menCount = products.filter(p => p.section === 'men').length;
    const womenCount = products.filter(p => p.section === 'women').length;
    console.log(`Men's products: ${menCount}`);
    console.log(`Women's products: ${womenCount}`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedProducts();