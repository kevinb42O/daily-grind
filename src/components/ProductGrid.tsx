import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const products = [
  { 
    id: 1, 
    name: "PRIMITIVE PRIMXTERM-MACHINEHOOD", 
    price: "€89,95", 
    category: "Kledij", 
    image: "/images/products/primitive-primxterm-machinehood-heathergrey.jpg"
  },
  { 
    id: 2, 
    name: "PRIMXTERM BOXSET LEMOS DECK 8.0", 
    price: "€90,00", 
    category: "Skateboards", 
    image: "/images/products/primitive-primxterm-boxsetlemosdeck-8.jpg"
  },
  { 
    id: 3, 
    name: "HAMILTON SHADOW DECK", 
    price: "€80,00", 
    category: "Skateboards", 
    image: "/images/products/primitive-hamilton-shadow-deck-black.jpg"
  },
  { 
    id: 4, 
    name: "PRIMXTERM NO FATE DECK 8.25", 
    price: "€90,00", 
    category: "Skateboards", 
    image: "/images/products/primitive-primxterm-nofatedeck-825.jpg"
  },
  { 
    id: 5, 
    name: "PRIMITIVE PRIMXTERM-BOXSETTEE", 
    price: "€39,95", 
    category: "Kledij", 
    image: "/images/products/primitive-primxterm-boxsettee-black.jpg"
  },
  { 
    id: 6, 
    name: "DAILY GRIND TEAM DECK", 
    price: "€60,00", 
    category: "Skateboards", 
    image: "/images/products/skateboards.jpg"
  },
];

export default function ProductGrid() {
  return (
    <section id="products" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Nieuwste Producten</h2>
            <p className="text-accent font-display font-bold uppercase tracking-widest text-sm mt-2">New Arrivals</p>
          </div>
          <button className="hidden md:flex items-center gap-2 font-display font-bold uppercase text-xs tracking-widest hover:text-accent transition-colors">
            Bekijk Alles <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-surface mb-6 border border-fg/5">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-display font-bold text-lg leading-tight group-hover:text-accent transition-colors">{product.name}</h3>
                </div>
                <span className="font-display font-bold">{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
