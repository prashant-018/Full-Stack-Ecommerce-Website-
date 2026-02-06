const mongoose = require('mongoose');
require('dotenv').config();

const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const sampleReviews = [
  {
    userName: "Sarah Mitchell",
    rating: 5,
    title: "Perfect fit and amazing quality!",
    comment: "I absolutely love this piece! The fabric is luxurious and the fit is exactly what I was hoping for. I'm 5'6\" and ordered a medium - fits like a glove. The color is even more beautiful in person. Definitely worth the investment and I'll be ordering more colors soon.",
    sizeFit: "True to Size",
    verifiedBuyer: true
  },
  {
    userName: "Jessica Chen",
    rating: 4,
    title: "Great quality, runs a bit small",
    comment: "Beautiful craftsmanship and the material feels premium. However, I found it runs about half a size smaller than expected. I usually wear a large but should have ordered XL. The customer service was excellent when I reached out about sizing. Will definitely shop here again.",
    sizeFit: "Runs Small",
    verifiedBuyer: true
  },
  {
    userName: "Amanda Rodriguez",
    rating: 5,
    title: "Exceeded my expectations",
    comment: "This is hands down one of the best purchases I've made this year. The attention to detail is incredible and it's so versatile - I can dress it up for work or down for weekends. The fabric doesn't wrinkle easily which is a huge plus for travel. Highly recommend!",
    sizeFit: "True to Size",
    verifiedBuyer: true
  },
  {
    userName: "Emily Thompson",
    rating: 4,
    title: "Love the style, wish it came in more colors",
    comment: "The design is exactly what I was looking for - modern yet timeless. The quality is solid and it washes well. My only complaint is the limited color options. I'd love to see this in navy or burgundy. Overall very satisfied with my purchase.",
    sizeFit: "True to Size",
    verifiedBuyer: true
  },
  {
    userName: "Rachel Kim",
    rating: 3,
    title: "Good but not great",
    comment: "It's a decent piece but didn't quite live up to the hype for me. The material is nice but feels a bit thin for the price point. The fit is okay but could be more flattering. It's not bad, just not exceptional. Might work better for different body types.",
    sizeFit: "Runs Large",
    verifiedBuyer: true
  },
  {
    userName: "Lisa Wang",
    rating: 5,
    title: "My new favorite!",
    comment: "I can't say enough good things about this! The quality is outstanding and it's become my go-to piece. I've gotten so many compliments wearing it. The sizing chart was accurate and shipping was fast. This brand has definitely earned a loyal customer.",
    sizeFit: "True to Size",
    verifiedBuyer: true
  },
  {
    userName: "Maria Gonzalez",
    rating: 4,
    title: "Stylish and comfortable",
    comment: "Really happy with this purchase. It's comfortable enough for all-day wear but still looks polished and professional. The fabric has a nice weight to it and the construction seems durable. Only minor issue is that it attracts lint easily.",
    sizeFit: "True to Size",
    verifiedBuyer: true
  },
  {
    userName: "Jennifer Park",
    rating: 5,
    title: "Worth every penny",
    comment: "Initially hesitated because of the price, but I'm so glad I went for it. The quality justifies the cost completely. It's beautifully made and the fit is flattering. I feel confident and comfortable wearing it. Will definitely be purchasing more from this brand.",
    sizeFit: "True to Size",
    verifiedBuyer: true
  },
  {
    userName: "Nicole Davis",
    rating: 2,
    title: "Not what I expected",
    comment: "Unfortunately, this didn't work out for me. The color looked different online than in person - much more muted. The fit was also off despite following the size guide. The return process was smooth though, so no complaints about customer service.",
    sizeFit: "Runs Small",
    verifiedBuyer: true
  },
  {
    userName: "Stephanie Lee",
    rating: 4,
    title: "Great for the office",
    comment: "Perfect for professional settings. The cut is flattering and appropriate for work. The fabric doesn't wrinkle much which is great for long days at the office. I've worn it multiple times and it still looks new. Good investment piece for work wardrobe.",
    sizeFit: "True to Size",
    verifiedBuyer: true
  }
];

const seedReviews = async () => {
  try {
    console.log('🌱 Starting to seed reviews...');

    // Get all products
    const products = await Product.find({});

    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      return;
    }

    // Create a test user if none exists
    let testUser = await User.findOne({ email: 'reviewer@test.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test Reviewer',
        email: 'reviewer@test.com',
        password: 'password123',
        role: 'user'
      });
      await testUser.save();
      console.log('👤 Created test user for reviews');
    }

    let totalReviewsCreated = 0;

    // Add reviews to each product
    for (const product of products) {
      console.log(`📝 Adding reviews for: ${product.name}`);

      // Randomly select 3-7 reviews for each product
      const numReviews = Math.floor(Math.random() * 5) + 3;
      const selectedReviews = sampleReviews
        .sort(() => 0.5 - Math.random())
        .slice(0, numReviews);

      for (const reviewData of selectedReviews) {
        try {
          // Create review with random dates in the past 60 days
          const randomDaysAgo = Math.floor(Math.random() * 60);
          const createdAt = new Date();
          createdAt.setDate(createdAt.getDate() - randomDaysAgo);

          const review = new Review({
            userId: testUser._id,
            userName: reviewData.userName,
            productId: product._id,
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
            sizeFit: reviewData.sizeFit,
            verifiedBuyer: reviewData.verifiedBuyer,
            helpfulCount: Math.floor(Math.random() * 15),
            createdAt,
            updatedAt: createdAt
          });

          await review.save();
          totalReviewsCreated++;
        } catch (error) {
          if (error.code !== 11000) { // Ignore duplicate key errors
            console.error('Error creating review:', error.message);
          }
        }
      }

      // Update product rating
      const ratingStats = await Review.calculateProductRating(product._id);
      await Product.findByIdAndUpdate(product._id, {
        'rating.average': ratingStats.averageRating,
        'rating.count': ratingStats.totalReviews
      });
    }

    console.log('✅ Reviews seeded successfully!');
    console.log(`📊 Total reviews created: ${totalReviewsCreated}`);
    console.log(`🛍️ Products with reviews: ${products.length}`);

    // Show some statistics
    const totalReviews = await Review.countDocuments();
    const avgRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    console.log('\n📈 Review Statistics:');
    console.log(`Total reviews in database: ${totalReviews}`);
    console.log(`Average rating across all reviews: ${avgRating[0]?.avgRating.toFixed(2) || 0}`);

    // Show rating distribution
    const ratingDist = await Review.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    console.log('\n⭐ Rating Distribution:');
    ratingDist.forEach(({ _id, count }) => {
      console.log(`${_id} stars: ${count} reviews`);
    });

    // Show size fit distribution
    const sizeFitDist = await Review.aggregate([
      { $group: { _id: '$sizeFit', count: { $sum: 1 } } }
    ]);

    console.log('\n👕 Size Fit Distribution:');
    sizeFitDist.forEach(({ _id, count }) => {
      console.log(`${_id}: ${count} reviews`);
    });

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedReviews();