import React from 'react';
import { ChevronDown } from 'lucide-react';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | 'newest';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Standaard' },
  { value: 'newest', label: 'Nieuwste' },
  { value: 'price-low', label: 'Prijs: Laag - Hoog' },
  { value: 'price-high', label: 'Prijs: Hoog - Laag' },
  { value: 'name-asc', label: 'Naam: A - Z' },
  { value: 'name-desc', label: 'Naam: Z - A' },
];

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentLabel = options.find(o => o.value === currentSort)?.label || 'Sorteren op';

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 font-display font-bold uppercase text-[10px] tracking-widest text-fg/60 hover:text-fg transition-colors"
        >
          Sorteren op: <span className="text-fg">{currentLabel}</span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 md:right-0 md:left-auto mt-4 w-56 bg-[#111111] border border-white/10 z-50 overflow-hidden brutal-border">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 font-display font-bold uppercase text-[10px] tracking-widest transition-colors ${
                    currentSort === option.value 
                      ? 'bg-accent text-bg' 
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
