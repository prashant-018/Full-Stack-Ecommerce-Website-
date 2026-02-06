import React from "react";

export default function Hero({
  src = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1920&auto=format&fit=crop",
}) {
  return (
    <section className="relative w-full">
      <div
        className="relative w-full h-[520px] overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: `url(${src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute left-10 sm:left-14 top-1/2 -translate-y-1/2 text-white max-w-md space-y-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Your Cozy Era</h1>
          <p className="text-base sm:text-lg leading-relaxed text-gray-100/90">
            Get peak comfy-chic
            <br />
            with new winter essentials.
          </p>
          <button className="inline-block bg-white text-gray-900 px-6 py-2 text-sm tracking-wide">
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
}
