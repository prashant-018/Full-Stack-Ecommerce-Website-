import React from "react";

const defaultItems = [
  {
    title: "SHIRTS",
    src: "https://i.pinimg.com/1200x/49/54/23/495423f5b21e8fbd182efc0042bb9ab1.jpg",
  },
  {
    title: "DENIM",
    src: "https://i.pinimg.com/736x/07/4e/6f/074e6f77db5baac7351d51c2e8a49022.jpg",
  },
  {
    title: "TEES",
    src: "https://i.pinimg.com/736x/13/e7/b5/13e7b5171be0998f81fd71df8f1956fd.jpg",
  },
  {
    title: "PANTS",
    src: "https://i.pinimg.com/736x/84/71/de/8471de63f630ce977c562bafcb93b994.jpg",
  },
  {
    title: "SWEATERS",
    src: "https://i.pinimg.com/736x/22/a8/51/22a851f2867ae431c849641fcd0d9e3d.jpg",
  },
  {
    title: "OUTERWEAR",
    src: "https://i.pinimg.com/736x/fa/1a/8c/fa1a8c25d56315ad57e5cd1342648237.jpg",
  },
];

const missionBannerSrc =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop";

const promoItems = [
  {
    title: "New Arrivals",
    cta: "SHOP THE LATEST",
    src: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Best-Sellers",
    cta: "SHOP YOUR FAVORITES",
    src: "https://i.pinimg.com/736x/df/69/d1/df69d182addcf2fea9fee89845bff736.jpg",
  },
  {
    title: "The Holiday Outfit",
    cta: "SHOP OCCASION",
    src: "https://i.pinimg.com/736x/18/24/43/182443283cdccfc5fb10c073e67c96ad.jpg",
  },
];

export default function Category({ items = defaultItems }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-10">
      <h2 className="text-center text-base tracking-wide text-gray-800 mb-8">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((it) => (
          <a key={it.title} href="#" className="group block">
            <div className="w-full aspect-[3/4] bg-white overflow-hidden border border-gray-200">
              <img src={it.src} alt={it.title} className="w-full h-full object-cover object-center" />
            </div>
            <div className="pt-3 text-center">
              <span className="inline-block text-[11px] tracking-[0.2em] text-gray-800 pt-2 uppercase underline underline-offset-4 decoration-gray-800">
                {it.title}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Featured Sections - Three equal height columns matching reference */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {promoItems.map((item, idx) => (
          <a key={item.title} href="#" className="group relative block overflow-hidden">
            {/* Fixed height container for consistent sizing */}
            <div className="w-full h-[400px] md:h-[450px] lg:h-[500px] bg-gray-100">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Dynamic overlay based on content */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${item.overlay === 'dark' ? 'bg-black/40' :
              item.overlay === 'medium' ? 'bg-black/25' :
                'bg-black/10'
              }`} />

            {/* Content overlay - centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 space-y-4">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-center leading-tight">
                {item.title}
              </h3>
              <button className="bg-white text-black px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105">
                {item.cta}
              </button>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-14 md:mt-16">
        <a href="#" className="relative block overflow-hidden border border-gray-300">
          <div
            className="w-full h-[220px] sm:h-[260px] md:h-[300px] bg-cover bg-center"
            style={{ backgroundImage: `url(${missionBannerSrc})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 space-y-3">
            <h3 className="text-xl sm:text-2xl font-medium tracking-wide text-center">We’re on a Mission To Clean Up the Industry</h3>
            <p className="text-sm text-white/90 text-center">Read about our progress in our latest Impact Report.</p>
            <span className="inline-block bg-white text-gray-900 px-5 py-2 text-[12px] tracking-[0.18em] uppercase">LEARN MORE</span>
          </div>
        </a>
      </div>
    </section>
  );
}

