import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// About Content Component
const AboutContent = () => (
  <>
    {/* Hero Section */}
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-light leading-tight mb-8">
          We believe<br />
          we can all<br />
          make<br />
          a difference.
        </h1>
        <div className="text-lg md:text-xl font-light space-y-2">
          <p>Our way: Exceptional quality.</p>
          <p>Ethical factories. Radical Transparency.</p>
        </div>
      </div>
    </div>

    {/* Philosophy Section */}
    <div className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-8 text-center">
        <p className="text-4xl md:text-5xl font-normal text-gray-900 leading-tight tracking-tight">
          At Everlane, we want the right choice to be as easy
          as putting on a great T-shirt. That's why we partner
          with the best, ethical factories around the world.
          Source only the finest materials. And share those
          stories with you—down to the true cost of every
          product we make. It's a new way of doing things.
          We call it Radical Transparency.
        </p>
      </div>
    </div>

    {/* Our Factories Section */}
    <div className="py-0 bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=800&fit=crop&crop=center"
              alt="Factory Worker"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="bg-gray-100 flex items-center justify-center p-12 lg:p-16">
            <div className="max-w-md">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
                OUR FACTORIES
              </div>
              <h2 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-8 leading-tight">
                Our ethical approach.
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                We spend months finding the best factories around the world—the same
                ones that produce your favorite designer labels. We visit them often and
                build strong personal relationships with the owners. Each factory is given
                a compliance audit to evaluate factors like fair wages, reasonable hours,
                and environment. Our goal? A score of 90 or above for every factory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Industrial Manufacturing Section */}
    <div className="py-0 bg-white">
      <div className="w-full">
        <div className="relative h-screen">
          <img
            src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1920&h=1080&fit=crop&crop=center"
            alt="Industrial Sewing Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      </div>
    </div>

    {/* Our Quality Section */}
    <div className="py-0 bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Content Section */}
          <div className="bg-gray-100 flex items-center justify-center p-12 lg:p-16">
            <div className="max-w-md">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
                OUR QUALITY
              </div>
              <h2 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-8 leading-tight">
                Designed<br />to last.
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                At Everlane, we're not big on trends. We want you to wear our pieces for
                years, even decades, to come. That's why we source the finest materials
                and factories for our timeless products—like our Grade-A cashmere
                sweaters, Italian shoes, and Peruvian Pima tees.
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop&crop=center"
              alt="Quality Materials and Fabrics"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Design Process Section */}
    <div className="py-0 bg-white">
      <div className="w-full">
        <div className="relative h-96 md:h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&h=1080&fit=crop&crop=center"
            alt="Design Process and Creative Workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
      </div>
    </div>

    {/* Pricing Transparency Section */}
    <div className="py-20 bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Chart Section */}
          <div className="bg-gray-50 flex items-center justify-center p-12 lg:p-16">
            <div className="max-w-md w-full">
              <div className="flex items-end justify-center space-x-12 mb-8">
                {/* Everlane T-shirt */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">$30</div>
                  <div className="w-20 h-48 bg-gray-300 rounded-t-lg mb-4 relative">
                    <div className="absolute bottom-0 w-full h-16 bg-amber-600 rounded-b-lg"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">Everlane T-shirt</div>
                </div>

                {/* Traditional Retail */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">$55</div>
                  <div className="w-20 h-64 bg-gray-300 rounded-t-lg mb-4 relative">
                    <div className="absolute bottom-0 w-full h-16 bg-gray-700 rounded-b-lg"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">Traditional Retail</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white flex items-center justify-center p-12 lg:p-16">
            <div className="max-w-md">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
                OUR PRICES
              </div>
              <h2 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-8 leading-tight">
                Radically Transparent.
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                We believe our customers have a right to know how much their clothes
                cost to make. We reveal the true costs behind all of our products—from
                materials to labor to transportation—then offer them to you, minus the
                traditional retail markup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* More to Explore Section */}
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-light text-center text-gray-900 mb-16">
          More to Explore
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Our Products */}
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center"
                alt="Our Products"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-medium text-white text-center">Our Products</h3>
          </div>

          {/* Our Stores */}
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop&crop=center"
                alt="Our Stores"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center">Our Stores</h3>
          </div>

          {/* Careers */}
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop&crop=center"
                alt="Careers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center">Careers</h3>
          </div>
        </div>
      </div>
    </div>

  </>
);

// Stories Content Component
const StoriesContent = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-5xl font-light text-center text-gray-900 mb-16">Our Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-50 p-8 rounded-lg">
          <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=300&fit=crop" alt="Story 1" className="w-full h-48 object-cover rounded mb-6" />
          <h3 className="text-2xl font-semibold mb-4">The Beginning</h3>
          <p className="text-gray-700">How we started our journey towards sustainable fashion and ethical manufacturing.</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop" alt="Story 2" className="w-full h-48 object-cover rounded mb-6" />
          <h3 className="text-2xl font-semibold mb-4">Our Growth</h3>
          <p className="text-gray-700">Expanding our mission while maintaining our core values and commitment to transparency.</p>
        </div>
      </div>
    </div>
  </div>
);

// Factories Content Component
const FactoriesContent = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-5xl font-light text-center text-gray-900 mb-16">Our Factories</h1>
      <div className="space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <img src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&h=400&fit=crop" alt="Factory" className="w-full rounded-lg" />
          <div>
            <h3 className="text-3xl font-light mb-6">Ethical Manufacturing</h3>
            <p className="text-lg text-gray-700 mb-4">We partner with factories that share our commitment to fair wages, safe working conditions, and environmental responsibility.</p>
            <p className="text-lg text-gray-700">Every factory is personally visited and vetted by our team to ensure they meet our high standards.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Environmental Content Component  
const EnvironmentalContent = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-5xl font-light text-center text-gray-900 mb-16">Environmental Initiatives</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Renewable Energy</h3>
          <p className="text-gray-600">100% renewable energy powers all our facilities and operations.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Carbon Neutral</h3>
          <p className="text-gray-600">All shipping and packaging is carbon neutral through verified offset programs.</p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Sustainable Materials</h3>
          <p className="text-gray-600">80% of our products use sustainable, recycled, or organic materials.</p>
        </div>
      </div>
    </div>
  </div>
);

// Carbon Content Component
const CarbonContent = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-5xl font-light text-center text-gray-900 mb-16">Our Carbon Commitment</h1>
      <div className="bg-gray-50 p-12 rounded-lg text-center">
        <h2 className="text-3xl font-light mb-8">Carbon Neutral by 2025</h2>
        <p className="text-xl text-gray-700 mb-8">We're committed to achieving carbon neutrality across our entire supply chain by 2025.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">50%</div>
            <p className="text-gray-600">Reduction in emissions since 2020</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <p className="text-gray-600">Renewable energy in facilities</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
            <p className="text-gray-600">Reduction target by 2024</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Impact Report Content Component
const ImpactReportContent = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-5xl font-light text-center text-gray-900 mb-16">Annual Impact Report</h1>
      <div className="space-y-12">
        <div className="bg-gray-900 text-white p-12 rounded-lg text-center">
          <h2 className="text-3xl font-light mb-6">2023 Impact Report</h2>
          <p className="text-xl mb-8">Our comprehensive report on environmental and social impact.</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded hover:bg-gray-100 transition-colors">
            Download Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">1.2M</div>
            <p className="text-gray-600">Pounds of CO2 offset</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">15K</div>
            <p className="text-gray-600">Workers supported</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">89%</div>
            <p className="text-gray-600">Sustainable materials used</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">Zero</div>
            <p className="text-gray-600">Waste to landfill</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Cleaner Fashion Content Component
const CleanerFashionContent = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-5xl font-light text-center text-gray-900 mb-16">Cleaner Fashion</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-light text-gray-900 mb-8">The Future of Fashion</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're pioneering new ways to make fashion cleaner, more sustainable, and more transparent.
            From innovative materials to circular design principles.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-4"></div>
              <span className="text-gray-700">Recycled and upcycled materials</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-4"></div>
              <span className="text-gray-700">Circular design principles</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-gray-900 rounded-full mr-4"></div>
              <span className="text-gray-700">Zero-waste manufacturing</span>
            </li>
          </ul>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop&crop=center"
            alt="Cleaner Fashion"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

const About = () => {
  const [activeTab, setActiveTab] = useState('About');

  const tabs = [
    'About',
    'Stories',
    'Factories',
    'Environmental Initiatives',
    'Our Carbon Commitment',
    'Annual Impact Report',
    'Cleaner Fashion'
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Stories':
        return <StoriesContent />;
      case 'Factories':
        return <FactoriesContent />;
      case 'Environmental Initiatives':
        return <EnvironmentalContent />;
      case 'Our Carbon Commitment':
        return <CarbonContent />;
      case 'Annual Impact Report':
        return <ImpactReportContent />;
      case 'Cleaner Fashion':
        return <CleanerFashionContent />;
      default:
        return <AboutContent />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-[13px] text-gray-700 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`whitespace-nowrap pb-1 transition-colors ${activeTab === tab
                  ? 'text-black border-b-2 border-black'
                  : 'hover:text-black'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
};

export default About;