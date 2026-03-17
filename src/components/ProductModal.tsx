import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-bg brutal-border overflow-y-auto max-h-[95vh] md:overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-fg text-bg flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-[4/5] md:aspect-auto bg-surface overflow-hidden">
              <motion.img
                layoutId={`product-image-${product.id}`}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-accent font-display font-bold uppercase tracking-[0.3em] text-xs mb-4">{product.category}</p>
                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">{product.name}</h3>
                <div className="w-12 h-1 bg-fg mb-8" />
                <p className="text-lg text-fg/70 leading-relaxed mb-8 font-medium">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-12">
                  <span className="text-3xl font-display font-bold">{product.price}</span>
                  <span className="text-[10px] uppercase tracking-widest text-fg/40 font-bold">In stock: Kerkstraat 61</span>
                </div>
                
                <button className="hidden md:flex w-full bg-fg text-bg font-display font-bold py-5 uppercase tracking-[0.2em] hover:bg-accent transition-colors items-center justify-center gap-3 group" onClick={onClose}>
                  Kom Langs in de Shop
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
