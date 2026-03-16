import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const products = [
  { id: 1, name: "PRIMXTERM MACHINEHOOD", price: "€89,95", category: "Kledij", image: "/images/products/primitive-primxterm-machinehood-heathergrey.jpg" },
  { id: 2, name: "PRIMXTERM BOXSET L/S TEE", price: "€45,00", category: "Kledij", image: "/images/products/primitive-primxterm-boxsetl-stee-black.jpg" },
  { id: 3, name: "HAMILTON SHADOW DECK", price: "€80,00", category: "Skateboards", image: "/images/products/primitive-hamilton-shadow-deck-black.jpg" },
  { id: 4, name: "BREAKDOWN BEANIE", price: "€30,00", category: "Accessoires", image: "/images/products/primitive-breakdown-beanie-black.jpg" },
  { id: 5, name: "CURRENCY HOOD", price: "€99,95", category: "Kledij", image: "/images/products/primitive-currency-hood-hunter-green.jpg" },
  { id: 6, name: "PRIMXTERM MACHINETEE", price: "€39,95", category: "Kledij", image: "/images/products/primitive-primxterm-machinetee-black.jpg" },
  { id: 7, name: "PRIMXTERM BOXSET LEMOS DECK 8.0", price: "€90,00", category: "Skateboards", image: "/images/products/primitive-primxterm-boxsetlemosdeck-8.jpg" },
  { id: 8, name: "PRIMXTERM NO FATE DECK 8.25", price: "€90,00", category: "Skateboards", image: "/images/products/primitive-primxterm-nofatedeck-825.jpg" },
  { id: 9, name: "Schoenen", price: "€84,95", category: "Schoenen", image: "/images/products/schoenen.jpg" },
  { id: 10, name: "Accessoires", price: "€30,00", category: "Accessoires", image: "/images/products/accessoires.jpg" },
  { id: 11, name: "Skateboards", price: "€90,00", category: "Skateboards", image: "/images/products/skateboards.jpg" },
  { id: 12, name: "Kledij", price: "€58,00", category: "Kledij", image: "/images/products/kledij.jpg" },
];

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-bold uppercase text-xs tracking-widest hover:text-accent transition-colors mb-12">
          <ArrowLeft size={16} /> Terug naar Home
        </Link>

        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">{category}</h1>
          <p className="text-accent font-display font-bold uppercase tracking-widest text-sm">
            Ontdek onze collectie {category?.toLowerCase()}
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
        ) : (
          <div className="py-24 text-center border border-fg/5 bg-surface">
            <p className="font-display font-bold uppercase tracking-widest text-fg/40">Geen producten gevonden in deze categorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
