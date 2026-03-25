import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { products, Product } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import SortDropdown, { SortOption } from './SortDropdown';
import FilterSidebar from './FilterSidebar';

export default function CategoryPage() {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [sort, setSort] = React.useState<SortOption>('default');
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const priceLimit = React.useMemo(() => {
    return Math.max(...products.map(p => {
      return parseFloat(p.price.replace('€', '').replace('.', '').replace(',', '.')) || 0;
    }), 200);
  }, []);

  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, priceLimit]);

  const [visibleCount, setVisibleCount] = React.useState(12);

  React.useEffect(() => {
    const brandFromQuery = new URLSearchParams(location.search).get('brand');
    setSelectedBrand(brandFromQuery ? brandFromQuery.toUpperCase() : null);
  }, [location.search]);

  React.useEffect(() => {
    setVisibleCount(12);
  }, [category, subcategory, selectedBrand, priceRange, sort]);

  const filteredProducts = React.useMemo(() => {
    // ... filtering logic ...
    let result = products.filter(p => {
      const matchCategory = p.category?.toLowerCase() === category?.toLowerCase();
      const matchSubcategory = !subcategory || 
        p.subcategory?.toLowerCase() === subcategory?.toLowerCase() ||
        p.subcategory?.toLowerCase().replace(/ /g, '-') === subcategory?.toLowerCase();
      
      const parsePrice = (priceStr: string) => {
        return parseFloat(priceStr.replace('€', '').replace('.', '').replace(',', '.')) || 0;
      };
      
      const currentPrice = parsePrice(p.price);
      const matchPrice = currentPrice >= priceRange[0] && currentPrice <= priceRange[1];
      
      const brand = p.name.split(' ')[0].toUpperCase();
      const matchBrand = !selectedBrand || brand === selectedBrand;

      return matchCategory && matchSubcategory && matchPrice && matchBrand;
    });

    const parsePrice = (priceStr: string) => {
      return parseFloat(priceStr.replace('€', '').replace('.', '').replace(',', '.')) || 0;
    };

    switch (sort) {
      case 'price-low':
        return [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case 'price-high':
        return [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      case 'name-asc':
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...result].sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return [...result].sort((a, b) => b.id - a.id);
      default:
        return result;
    }
  }, [category, subcategory, sort, selectedBrand, priceRange]);

  const handleCategoryChange = (cat: string, sub?: string) => {
    if (sub) {
      navigate(`/category/${cat.toLowerCase()}/${sub.toLowerCase().replace(/ /g, '-')}`);
    } else {
      navigate(`/category/${cat.toLowerCase()}`);
    }
    // Also reset sub-filters when category changes significantly
    setSelectedBrand(null);
    setPriceRange([0, priceLimit]);
    setShowMobileFilters(false);
  };


  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-bold uppercase text-xs tracking-widest hover:text-accent transition-colors mb-12">
          <ArrowLeft size={16} /> Terug naar Home
        </Link>

        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">{subcategory || category}</h1>
            <p className="text-accent font-display font-bold uppercase tracking-widest text-sm">
              Ontdek onze collectie {subcategory?.toLowerCase() || category?.toLowerCase()}
            </p>
          </div>
          <div className="pb-2">
            <SortDropdown currentSort={sort} onSortChange={setSort} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar 
              products={products}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              currentCategory={category || ''}
              currentSubcategory={subcategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <div className="flex-1">
            <div className="lg:hidden mb-8">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-center gap-2 font-display font-black uppercase tracking-widest text-xs border border-white/10 py-4 hover:bg-accent hover:text-bg transition-colors"
              >
                <SlidersHorizontal size={16} /> {showMobileFilters ? 'Sluit Filters' : 'Filters'}
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {filteredProducts.slice(0, visibleCount).map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index} 
                      onClick={setSelectedProduct} 
                    />
                  ))}
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="inline-flex items-center justify-center gap-4 px-10 py-4 bg-fg text-bg font-display font-black uppercase tracking-[0.3em] text-xs hover:bg-accent hover:text-white transition-all duration-300 brutal-border cursor-pointer group"
                    >
                      MEER LADEN
                      <div className="w-8 h-[2px] bg-bg group-hover:bg-white group-hover:w-12 transition-all" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center border border-fg/5 bg-surface">
                <p className="font-display font-bold uppercase tracking-widest text-fg/40 mb-4">Geen producten gevonden met deze filters.</p>
                <button
                  onClick={() => {
                    setSelectedBrand(null);
                    setPriceRange([0, priceLimit]);
                  }}
                  className="text-accent hover:text-white transition-colors uppercase tracking-widest font-black text-xs underline decoration-2 underline-offset-4"
                >
                  Alle filters wissen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
