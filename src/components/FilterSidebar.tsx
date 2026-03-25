import React from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Product } from '../data/products';

interface FilterSidebarProps {
  products: Product[];
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  currentCategory: string;
  currentSubcategory?: string;
  onCategoryChange: (cat: string, sub?: string) => void;
}

export default function FilterSidebar({
  products,
  selectedBrand,
  onBrandChange,
  priceRange,
  onPriceChange,
  currentCategory,
  currentSubcategory,
  onCategoryChange
}: FilterSidebarProps) {
  const [expanded, setExpanded] = React.useState({
    categories: true,
    brands: true,
    price: true
  });

  const brands = React.useMemo(() => {
    const scopedProducts = products.filter((p) => {
      const matchCategory = p.category?.toLowerCase() === currentCategory.toLowerCase();
      const matchSubcategory =
        !currentSubcategory ||
        p.subcategory?.toLowerCase() === currentSubcategory.toLowerCase() ||
        p.subcategory?.toLowerCase().replace(/ /g, '-') === currentSubcategory.toLowerCase();

      return matchCategory && matchSubcategory;
    });

    const set = new Set<string>();
    scopedProducts.forEach((p) => {
      const brand = p.name.split(' ')[0].toUpperCase();
      if (brand) set.add(brand);
    });

    return Array.from(set).sort();
  }, [products, currentCategory, currentSubcategory]);

  const categories = React.useMemo(() => {
    const rootCats = ['Skateboards', 'Kledij', 'Schoenen', 'Accessoires'];
    return rootCats.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length,
      subcategories: Array.from(new Set(products.filter(p => p.category === cat).map(p => p.subcategory).filter(Boolean)))
    }));
  }, [products]);

  const maxPrice = React.useMemo(() => {
    return Math.max(...products.map(p => {
      return parseFloat(p.price.replace('€', '').replace('.', '').replace(',', '.')) || 0;
    }), 200);
  }, [products]);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-12">
      {/* Categories */}
      <div className="border-b border-white/10 pb-8">
        <button 
          onClick={() => setExpanded(prev => ({ ...prev, categories: !prev.categories }))}
          className="w-full flex justify-between items-center mb-6"
        >
          <h3 className="font-display font-black uppercase tracking-tighter text-xl">Categorieën</h3>
          {expanded.categories ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expanded.categories && (
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.name} className="space-y-2">
                <button
                  onClick={() => onCategoryChange(cat.name)}
                  className={`w-full flex justify-between items-center text-sm font-display font-bold uppercase tracking-widest transition-colors ${
                    currentCategory.toLowerCase() === cat.name.toLowerCase() && !currentSubcategory ? 'text-accent' : 'text-fg/60 hover:text-fg'
                  }`}
                >
                  <span>{cat.name} <span className="text-[10px] opacity-40 ml-1">({cat.count})</span></span>
                </button>
                
                {cat.subcategories.length > 0 && currentCategory.toLowerCase() === cat.name.toLowerCase() && (
                  <div className="pl-4 space-y-2 border-l border-white/10">
                    {cat.subcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => onCategoryChange(cat.name, sub)}
                        className={`block text-xs font-display font-bold uppercase tracking-widest transition-colors ${
                          (currentSubcategory?.toLowerCase() === sub.toLowerCase() || 
                           currentSubcategory?.toLowerCase() === sub.toLowerCase().replace(/ /g, '-')) 
                          ? 'text-accent' : 'text-fg/40 hover:text-fg'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="border-b border-white/10 pb-8">
        <button 
          onClick={() => setExpanded(prev => ({ ...prev, brands: !prev.brands }))}
          className="w-full flex justify-between items-center mb-6"
        >
          <h3 className="font-display font-black uppercase tracking-tighter text-xl">Merken</h3>
          {expanded.brands ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expanded.brands && (
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <button
              onClick={() => onBrandChange(null)}
              className={`flex items-center gap-3 text-sm font-display font-bold uppercase tracking-widest transition-colors ${
                !selectedBrand ? 'text-accent' : 'text-fg/60 hover:text-fg'
              }`}
            >
              <div className={`w-4 h-4 border-2 flex items-center justify-center ${!selectedBrand ? 'border-accent bg-accent' : 'border-white/20'}`}>
                {!selectedBrand && <div className="w-2 h-2 bg-bg" />}
              </div>
              Alle merken
            </button>
            
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => onBrandChange(brand)}
                className={`flex items-center gap-3 text-sm font-display font-bold uppercase tracking-widest transition-colors ${
                  selectedBrand === brand ? 'text-accent' : 'text-fg/60 hover:text-fg'
                }`}
              >
                <div className={`w-4 h-4 border-2 flex items-center justify-center ${selectedBrand === brand ? 'border-accent bg-accent' : 'border-white/20'}`}>
                  {selectedBrand === brand && <div className="w-2 h-2 bg-bg" />}
                </div>
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <button 
          onClick={() => setExpanded(prev => ({ ...prev, price: !prev.price }))}
          className="w-full flex justify-between items-center mb-6"
        >
          <h3 className="font-display font-black uppercase tracking-tighter text-xl">Prijs</h3>
          {expanded.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expanded.price && (
          <div className="px-2 pt-4">
            <div className="relative h-2 w-full bg-white/10 rounded-full mb-8">
              {/* Active Track Highlight */}
              <div 
                className="absolute h-full bg-accent rounded-full"
                style={{ 
                  left: `${(priceRange[0] / maxPrice) * 100}%`, 
                  right: `${100 - (priceRange[1] / maxPrice) * 100}%` 
                }}
              />
              
              {/* Range Inputs */}
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(parseInt(e.target.value), priceRange[1] - 10);
                  onPriceChange([val, priceRange[1]]);
                }}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(parseInt(e.target.value), priceRange[0] + 10);
                  onPriceChange([priceRange[0], val]);
                }}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
            <div className="flex justify-between font-display font-black text-xs uppercase tracking-[0.2em] pt-2">
              <span className={priceRange[0] > 0 ? 'text-accent' : 'text-fg/40'}>€{priceRange[0]}</span>
              <span className="text-accent">€{priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Reset Filters */}
      {(selectedBrand || priceRange[1] < maxPrice) && (
        <button
          onClick={() => {
            onBrandChange(null);
            onPriceChange([0, maxPrice]);
          }}
          className="flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-[0.2em] text-accent hover:text-white transition-colors pt-4"
        >
          <X size={14} /> Reset Filters
        </button>
      )}
    </aside>
  );
}
