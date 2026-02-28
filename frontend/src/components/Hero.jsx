import React from "react";
import { Link } from "react-router-dom";

export default function Hero({
  src = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1920&auto=format&fit=crop",
}) {
  return (
    <section className="relative w-full">
      <div
        className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] lg:h-[600px] overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: `url(${src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute left-4 sm:left-8 md:left-10 lg:left-14 top-1/2 -translate-y-1/2 text-white max-w-xs sm:max-w-sm md:max-w-md space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
            Your Cozy Era
          </h1>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-100/90">
            Get peak comfy-chic
            <br />
            with new winter essentials.
          </p>
          <Link
            to="/men"
            className="inline-block bg-white text-gray-900 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm tracking-wide hover:bg-gray-100 transition-colors mt-2 sm:mt-4"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
