import React from 'react';
import { motion } from 'motion/react';

const brands = [
  "Helas", "Carhartt WIP", "Dickies", "Polar Skate Co", 
  "Magenta", "Huf", "Adidas", "Santa Cruz", 
  "Thrasher", "Independent", "Spitfire", "Bones",
  "New Balance", "Lakai", "Primitive"
];

export default function Brands() {
  return (
    <section id="brands" className="py-24 bg-bg text-fg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-6xl md:text-8xl font-black mb-4 text-fg">Brands</h2>
            <p className="font-display text-lg tracking-widest uppercase text-fg/40">Brands in onze Shop</p>
          </div>
          <div className="hidden md:block w-1/3 h-[1px] bg-fg/10 mb-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25 }}
              viewport={{ once: true }}
              className="group border-b border-fg/10 py-6 cursor-default"
            >
              <span className="font-display text-2xl font-bold uppercase text-fg transition-colors duration-300 group-hover:text-accent">
                {brand}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
