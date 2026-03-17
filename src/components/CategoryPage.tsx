import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { products, Product } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  
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
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
                onClick={setSelectedProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-fg/5 bg-surface">
            <p className="font-display font-bold uppercase tracking-widest text-fg/40">Geen producten gevonden in deze categorie.</p>
          </div>
        )}
      </div>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
