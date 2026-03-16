import React from 'react';
import { motion } from 'motion/react';

const brands = [
  "Vans", "Carhartt WIP", "Dickies", "Polar Skate Co", 
  "Magenta", "Nike SB", "Adidas", "Santa Cruz", 
  "Thrasher", "Independent", "Spitfire", "Bones"
];

export default function Brands() {
  return (
    <section id="brands" className="py-24 bg-bg text-fg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-6xl md:text-8xl font-black mb-4 text-fg">Brands</h2>
            <p className="font-display text-lg tracking-widest uppercase text-fg/40">Curated Selection</p>
          </div>
          <div className="hidden md:block w-1/3 h-[1px] bg-fg/10 mb-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-b border-fg/10 py-6 flex items-center justify-between group cursor-pointer"
            >
              <span className="font-display text-2xl font-bold uppercase group-hover:text-accent transition-colors text-fg">{brand}</span>
              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-accent font-bold">VIEW ALL</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
