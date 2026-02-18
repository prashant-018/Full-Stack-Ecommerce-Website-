import React, { useState, useEffect } from "react";

const sampleProducts = [
  {
    id: 1,
    title: "The Waffle Long-Sleeve Crew",
    color: "Bone",
    price: "$60",
    src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "The Bomber Jacket | Uniform",
    color: "Toasted Coconut",
    price: "$98",
    src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "The Slim 4-Way Stretch Organic Jean | Uniform",
    color: "Dark Indigo",
    price: "$148",
    src: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "The Essential Organic Crew",
    color: "Vintage Black",
    price: "$88",
    src: "https://i.pinimg.com/736x/6b/0d/a4/6b0da44720b1c00da844b43b77942f00.jpg",
  },
  {
    id: 5,
    title: "The Heavyweight Overshirt",
    color: "Heathered Brown",
    price: "$90",
    src: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "The Classic Denim Jacket",
    color: "Washed Blue",
    price: "$118",
    src: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "The Organic Cotton Tee",
    color: "Natural White",
    price: "$28",
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "The Cashmere Sweater",
    color: "Camel",
    price: "$168",
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "The Straight Leg Chino",
    color: "Olive Green",
    price: "$78",
    src: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "The Merino Wool Cardigan",
    color: "Charcoal",
    price: "$128",
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 11,
    title: "The Linen Button-Down",
    color: "Sky Blue",
    price: "$68",
    src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 12,
    title: "The Wool Blend Coat",
    color: "Navy",
    price: "$248",
    src: "https://i.pinimg.com/474x/91/54/c4/9154c4f3542f71386e4506cc6b8c473c.jpg",
  },
  {
    id: 13,
    title: "The Organic Jogger",
    color: "Heather Grey",
    price: "$58",
    src: "https://i.pinimg.com/736x/67/45/34/6745347ea33cb5e97d6f189b81e30f17.jpg",
  },
  {
    id: 14,
    title: "The Pima Cotton Polo",
    color: "Forest Green",
    price: "$48",
    src: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 15,
    title: "The Recycled Fleece Hoodie",
    color: "Cream",
    price: "$88",
    src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 16,
    title: "The Relaxed Fit Shirt",
    color: "Soft White",
    price: "$78",
    src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 17,
    title: "The Wide-Leg Jean",
    color: "Vintage Indigo",
    price: "$128",
    src: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 18,
    title: "The Alpaca Crew Sweater",
    color: "Oatmeal",
    price: "$158",
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 19,
    title: "The Utility Jacket",
    color: "Sage Green",
    price: "$138",
    src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 20,
    title: "The Organic Cotton Tank",
    color: "Bone White",
    price: "$18",
    src: "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 21,
    title: "The Corduroy Shirt",
    color: "Rust",
    price: "$88",
    src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 22,
    title: "The Wool Trench Coat",
    color: "Camel",
    price: "$298",
    src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 23,
    title: "The Ribbed Knit Dress",
    color: "Black",
    price: "$98",
    src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 24,
    title: "The Organic Sweatshirt",
    color: "Heather Grey",
    price: "$68",
    src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 25,
    title: "The Linen Blazer",
    color: "Natural",
    price: "$148",
    src: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
  }
];

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "Perfect fit and amazing quality. This has become my go-to piece for both work and weekends.",
    reviewer: "Sarah M.",
    product: "The Cashmere Sweater",
    image: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?q=80&w=1200&auto=format&fit=crop",
    alt: "Woman in cashmere sweater"
  },
  {
    id: 2,
    rating: 4,
    text: "Love the sustainable approach and the fabric feels incredible. Runs slightly large but still great.",
    reviewer: "Alex Chen",
    product: "The Organic Cotton Tee",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    alt: "Man in organic cotton tee"
  },
  {
    id: 3,
    rating: 5,
    text: "Finally found jeans that fit perfectly! The stretch is just right and they look great dressed up or down.",
    reviewer: "Maya P.",
    product: "The Wide-Leg Jean",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    alt: "Woman in wide-leg jeans"
  },
  {
    id: 4,
    rating: 4,
    text: "Beautifully made jacket with attention to detail. The color is even better in person.",
    reviewer: "David K.",
    product: "The Utility Jacket",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop",
    alt: "Man in utility jacket"
  }
];

export default function EverLane({ products = sampleProducts }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  // Initialize userPhotos from localStorage or use defaults
  const [userPhotos, setUserPhotos] = useState(() => {
    const savedPhotos = localStorage.getItem('everlaneUserPhotos');
    if (savedPhotos) {
      return JSON.parse(savedPhotos);
    }
    return [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop"
    ];
  });

  const totalSlides = Math.ceil(products.length / 5);
  const totalTestimonials = testimonials.length;

  // Auto-scroll effect for testimonials
  useEffect(() => {
    if (!isTestimonialHovered && !isAutoScrollPaused) {
      const interval = setInterval(() => {
        setTestimonialSlide((prev) => (prev + 1) % totalTestimonials);
      }, 4500); // Change every 4.5 seconds

      return () => clearInterval(interval);
    }
  }, [isTestimonialHovered, isAutoScrollPaused, totalTestimonials]);

  // Pause auto-scroll temporarily when user interacts
  const pauseAutoScroll = () => {
    setIsAutoScrollPaused(true);
    setTimeout(() => setIsAutoScrollPaused(false), 8000); // Resume after 8 seconds
  };

  // Fallback image URL for broken images - clean, minimal Everlane-style image
  const fallbackImage = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop";

  // Handle image error by setting fallback
  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      e.target.onerror = null; // Prevent infinite loop
    }
  };

  // Convert file to base64 for permanent storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle photo upload and display with permanent storage
  const handleAddPhoto = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // Convert file to base64 for permanent storage
          const base64Image = await fileToBase64(file);

          // Add the new photo to the beginning of the array
          const updatedPhotos = [base64Image, ...userPhotos.slice(0, 4)];
          setUserPhotos(updatedPhotos);

          // Save to localStorage for persistence
          localStorage.setItem('everlaneUserPhotos', JSON.stringify(updatedPhotos));

          // Show success message
          alert(`Photo "${file.name}" uploaded successfully! Your photo will remain in the gallery even after page refresh.`);

        } catch (error) {
          console.error('Error uploading photo:', error);
          alert('Error uploading photo. Please try again.');
        }
      }
    };
    input.click();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextTestimonial = () => {
    pauseAutoScroll();
    setTestimonialSlide((prev) => (prev + 1) % totalTestimonials);
  };

  const prevTestimonial = () => {
    pauseAutoScroll();
    setTestimonialSlide((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  };

  const goToTestimonial = (index) => {
    pauseAutoScroll();
    setTestimonialSlide(index);
  };

  const currentTestimonial = testimonials[testimonialSlide];

  return (
    <div className="w-full bg-white">
      {/* Product Carousel Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-normal text-gray-900 mb-2">Everlane Favorites</h1>
            <p className="text-sm text-gray-600">
              Beautifully Functional. Purposefully Designed. Consciously Crafted.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Left Arrow - Hidden on mobile */}
            <button
              onClick={prevSlide}
              className="hidden md:block absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md text-2xl text-gray-600 hover:text-gray-900 transition-all"
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Right Arrow - Hidden on mobile */}
            <button
              onClick={nextSlide}
              className="hidden md:block absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md text-2xl text-gray-600 hover:text-gray-900 transition-all"
              aria-label="Next"
            >
              ›
            </button>

            {/* Products - Responsive Grid */}
            <div className="overflow-hidden px-0 md:px-12 lg:px-14">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    {/* Responsive Grid: 1 col mobile, 2 col sm, 3 col md, 4 col lg, 5 col xl */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                      {products
                        .slice(slideIndex * 5, slideIndex * 5 + 5)
                        .map((product) => (
                          <div key={product.id} className="group cursor-pointer">
                            {/* Product Image with Aspect Ratio */}
                            <div className="aspect-[3/4] bg-gray-100 mb-3 sm:mb-4 overflow-hidden rounded-sm">
                              <img
                                src={product.src}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
                                loading="lazy"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                  {product.price}
                                </span>
                              </div>
                              <h3 className="text-xs sm:text-sm text-gray-900 leading-tight line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {product.color}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-1.5">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${index === currentSlide ? 'bg-gray-900' : 'bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* People Are Talking Section */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className="relative"
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
          >
            {/* Left Arrow - Hidden on mobile */}
            <button
              onClick={prevTestimonial}
              className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-10 text-2xl text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Previous testimonial"
            >
              ‹
            </button>

            {/* Right Arrow - Hidden on mobile */}
            <button
              onClick={nextTestimonial}
              className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-10 text-2xl text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Next testimonial"
            >
              ›
            </button>

            {/* Responsive Grid: 1 col mobile, 2 col md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center md:mx-10">
              {/* Left Side - Testimonial */}
              <div className="space-y-3 sm:space-y-4 order-2 md:order-1">
                <h2 className="text-lg sm:text-xl font-normal text-gray-900">People Are Talking</h2>

                {/* Star Rating */}
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm sm:text-base transition-colors duration-300 ${i < currentTestimonial.rating ? 'text-gray-900' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-sm sm:text-base text-gray-900 leading-relaxed transition-opacity duration-500">
                  "{currentTestimonial.text}"
                </blockquote>

                {/* Attribution */}
                <p className="text-xs sm:text-sm text-gray-500 transition-opacity duration-500">
                  -- {currentTestimonial.reviewer}, <span className="underline cursor-pointer">{currentTestimonial.product}</span>
                </p>
              </div>

              {/* Right Side - Product Image */}
              <div className="bg-gray-100 aspect-[4/5] overflow-hidden rounded-sm order-1 md:order-2">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bottom Pagination Dots */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${index === testimonialSlide ? 'bg-gray-900' : 'bg-gray-400'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Gift Picks & Cleaner Fashion Section */}
      <div className="py-12 sm:py-16 border-t border-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Responsive Grid: 1 col mobile, 2 col md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Our Holiday Gift Picks */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 sm:mb-6 rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                  alt="Holiday Gift Picks - Stack of folded sweaters"
                  className="w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-normal text-gray-900">Our Holiday Gift Picks</h3>
                <p className="text-sm text-gray-600 leading-relaxed px-4 sm:px-0">
                  The best presents for everyone on your list.
                </p>
                <button className="text-sm text-gray-900 underline hover:no-underline transition-all">
                  Read More
                </button>
              </div>
            </div>

            {/* Cleaner Fashion */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 sm:mb-6 rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1200&auto=format&fit=crop"
                  alt="Cleaner Fashion - Cotton field"
                  className="w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-normal text-gray-900">Cleaner Fashion</h3>
                <p className="text-sm text-gray-600 leading-relaxed px-4 sm:px-0">
                  See the sustainability efforts behind each of our products.
                </p>
                <button className="text-sm text-gray-900 underline hover:no-underline transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Everlane On You Section */}
      <div className="py-12 sm:py-16 border-t border-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-normal text-gray-900 mb-3 sm:mb-4">Everlane On You</h2>
            <p className="text-sm text-gray-600 mb-2 px-4 sm:px-0">
              Share your latest look with #EverlaneOnYou for a chance to be featured.
            </p>
            <button
              onClick={handleAddPhoto}
              className="text-sm text-gray-900 underline hover:no-underline transition-all cursor-pointer"
            >
              Add Your Photo
            </button>
          </div>

          {/* User Photos Carousel */}
          <div className="relative">
            {/* Left Arrow - Hidden on mobile */}
            <button className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-10 text-2xl text-gray-600 hover:text-gray-900 transition-colors">
              ‹
            </button>

            {/* Right Arrow - Hidden on mobile */}
            <button className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-10 text-2xl text-gray-600 hover:text-gray-900 transition-colors">
              ›
            </button>

            {/* Photos Grid - Responsive: 2 col mobile, 3 col sm, 4 col md, 5 col lg+ */}
            <div className="overflow-hidden md:mx-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {userPhotos.map((photoSrc, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <div className="aspect-square bg-gray-100 overflow-hidden rounded-sm">
                      <img
                        src={photoSrc}
                        alt={`User wearing Everlane outfit ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    {/* New photo indicator */}
                    {index === 0 && photoSrc.startsWith('blob:') && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 border-t border-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Responsive Grid: 1 col mobile, 3 col md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Complimentary Shipping */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-2 sm:mb-3">Complimentary Shipping</h3>
              <p className="text-sm text-gray-600 leading-relaxed px-4 sm:px-0">
                Enjoy free shipping on U.S. orders over $100.
              </p>
            </div>

            {/* Consciously Crafted */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-2 sm:mb-3">Consciously Crafted</h3>
              <p className="text-sm text-gray-600 leading-relaxed px-4 sm:px-0">
                Designed with you and the planet in mind.
              </p>
            </div>

            {/* Come Say Hi */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-2 sm:mb-3">Come Say Hi</h3>
              <p className="text-sm text-gray-600 leading-relaxed px-4 sm:px-0">
                We have 11 stores across the U.S.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="border-t border-gray-400"></div>
    </div>
  );
}