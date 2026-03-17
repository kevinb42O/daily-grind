import React from 'react';
import { ArrowRight } from 'lucide-react';
import { products, Product } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  return (
    <section id="products" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">In de shop</h2>
            <p className="text-accent font-display font-bold uppercase tracking-widest text-sm mt-2">Latest Arrivals</p>
          </div>
          <button className="hidden md:flex items-center gap-2 font-display font-bold uppercase text-xs tracking-widest hover:text-accent transition-colors">
            Kom Langs <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.slice(0, 6).map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              onClick={setSelectedProduct} 
            />
          ))}
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
