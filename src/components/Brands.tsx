import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const brands = [
  "Helas", "Carhartt WIP", "Dickies", "Polar Skate Co", 
  "Magenta", "Huf", "Adidas", "Santa Cruz", 
  "Thrasher", "Independent", "Spitfire", "Bones"
];

export default function Brands() {
  const brandTargets = React.useMemo(() => {
    const productBrandToCategory = new Map<string, string>();

    products.forEach((product) => {
      const brandToken = product.name.split(' ')[0].toUpperCase();
      if (!productBrandToCategory.has(brandToken)) {
        productBrandToCategory.set(brandToken, product.category);
      }
    });

    return brands
      .map((brandLabel) => {
        const brandToken = brandLabel.split(' ')[0].toUpperCase();
        const category = productBrandToCategory.get(brandToken);
        return {
          label: brandLabel,
          brandToken,
          category
        };
      })
      .filter((entry): entry is { label: string; brandToken: string; category: string } => Boolean(entry.category));
  }, []);

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
          {brandTargets.map((brand, index) => (
            <motion.div
              key={brand.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-b border-fg/10 py-6"
            >
              <Link
                to={`/category/${brand.category.toLowerCase()}?brand=${encodeURIComponent(brand.brandToken)}`}
                className="flex items-center justify-between group"
              >
                <span className="font-display text-2xl font-bold uppercase group-hover:text-accent transition-colors text-fg">{brand.label}</span>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-accent font-bold">VIEW ALL</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
