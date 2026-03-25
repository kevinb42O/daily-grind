import React from 'react';
import { ArrowRight } from 'lucide-react';
import { products, Product } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import SortDropdown, { SortOption } from './SortDropdown';

export default function ProductGrid() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [sort, setSort] = React.useState<SortOption>('default');

  const sortedProducts = React.useMemo(() => {
    let result = [...products];

    const parsePrice = (priceStr: string) => {
      return parseFloat(priceStr.replace('€', '').replace('.', '').replace(',', '.')) || 0;
    };

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
    }
    return result;
  }, [sort]);

  return (
    <section id="products" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Drop of the Month</h2>
            <p className="text-accent font-display font-bold uppercase tracking-widest text-sm mt-2">Latest Arrivals</p>
          </div>
          <div className="flex items-center gap-8">
            <SortDropdown currentSort={sort} onSortChange={setSort} />
            <a href="/category/skateboards" className="font-display font-bold uppercase text-[10px] tracking-widest border-b-2 border-black pb-1 flex items-center gap-2 hover:gap-3 transition-all duration-300">
              Shop Alles <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {sortedProducts.slice(0, 6).map((product, index) => (
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
