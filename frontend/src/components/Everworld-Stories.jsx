import React from 'react';

const EverworldStories = () => {
  const stories = [
    {
      id: 1,
      title: "How To Style Winter Whites",
      category: "Style",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "We Won A Glossy Award",
      category: "Transparency",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Coordinate Your Style: Matching Outfits for Everyone",
      category: "Style",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Black Friday Fund 2023",
      category: "Transparency",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 5,
      title: "What to Wear this Season: Holiday Outfits & Ideas",
      category: "Style",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 6,
      title: "Thanksgiving Outfit Ideas",
      category: "Style",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Black Divider */}
      <div className="h-2 bg-black"></div>

      {/* Main Content Container */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-8 sm:pt-12 md:pt-16 pb-20">
        {/* Large Everworld Heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-black mb-4 sm:mb-6 leading-[0.8] tracking-tighter"
          style={{
            fontWeight: 900,
            textShadow: '0 0 1px rgba(0,0,0,0.3)'
          }}
        >
          everworld
        </h1>

        {/* Mission Statement */}
        <div className="text-sm sm:text-base md:text-lg text-gray-600 leading-normal space-y-0.5 max-w-xl mb-16">
          <p>We're on a mission to clean up a dirty industry.</p>
          <p>These are the people, stories, and ideas that will help us get there.</p>
        </div>

        {/* The Latest Section */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">The Latest</h2>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stories.map((story) => (
              <div key={story.id} className="group cursor-pointer">
                {/* Story Image */}
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Story Content */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    {story.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <button className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
              Load more Articles
            </button>
          </div>
        </div>

        {/* Keep it Clean Section */}
        <div className="mt-20 py-16 bg-white border-t border-gray-200">
          <div className="flex items-center justify-center space-x-8 text-center">
            <span className="text-2xl md:text-3xl font-bold text-black">Keep it Clean</span>

            <span className="text-2xl text-gray-400">↻</span>

            <span className="text-2xl md:text-3xl font-bold text-black">Do right by people</span>

            <span className="text-2xl text-gray-400">↻</span>

            <span className="text-2xl md:text-3xl font-bold text-black">Keep It Clean</span>
          </div>
        </div>

        {/* Our Progress Section */}
        <div className="mt-20 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">Our Progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carbon Commitment */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop&crop=center"
                  alt="Carbon Commitment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-black">Carbon Commitment</h3>
            </div>

            {/* Environmental Initiatives */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&crop=center"
                  alt="Environmental Initiatives"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-black">Environmental Initiatives</h3>
            </div>

            {/* Better Factories */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&h=400&fit=crop&crop=center"
                  alt="Better Factories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-black">Better Factories</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Follow us on social section */}
      <div className="bg-black py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-8">
            Follow us on social for more
          </h2>

          <button className="bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-100 transition-colors">
            @Everlane Instagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default EverworldStories;