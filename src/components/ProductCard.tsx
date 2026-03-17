import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onClick(product)}
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
  );
};

export default ProductCard;
