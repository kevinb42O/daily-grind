import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const banners = [
  {
    id: 1,
    image: "/images/hero/hero-banner-1.jpg",
  },
  {
    id: 2,
    image: "/images/hero/hero-banner-2.jpg",
  },
  {
    id: 3,
    image: "/images/hero/hero-banner-3.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-surface">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner, index) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <img 
              src={banner.image} 
              alt="Daily Grind Hero" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <div>
          <img 
            src="/images/site/dailygrindlogo.png" 
            alt="Daily Grind Skateshop" 
            className="w-[60vw] max-w-[700px] invert mb-8 drop-shadow-2xl"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent text-white font-display font-bold px-8 py-4 uppercase tracking-widest hover:bg-white hover:text-accent transition-all">
              Bekijk Collectie
            </button>
            <button className="border border-white text-white font-display font-bold px-8 py-4 uppercase tracking-widest hover:bg-white hover:text-bg transition-all">
              Onze Riders
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-12 h-1 transition-all ${i === current ? 'bg-accent' : 'bg-fg/20'}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block z-20">
        <div className="flex flex-col gap-2">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="text-[10px] uppercase tracking-widest text-white/50">Est. 2004</span>
        </div>
      </div>
    </section>
  );
}
