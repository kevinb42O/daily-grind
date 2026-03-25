import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Youtube, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111111] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img 
            src="/images/site/logo_daily_hero2.png" 
            alt="Daily Grind Logo" 
            className="h-10 w-auto brightness-0 invert"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          <div className="relative group">
            <Link to="/category/skateboards" className="hover:text-accent transition-colors block py-2">
              Skateboards
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <div className="absolute top-full left-0 mt-0 w-48 bg-[#111111] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <Link to="/category/skateboards/decks" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Decks</Link>
              <Link to="/category/skateboards/bolts" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Bolts</Link>
              <Link to="/category/skateboards/trucks" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Trucks</Link>
              <Link to="/category/skateboards/wheels" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Wheels</Link>
              <Link to="/category/skateboards/bearings" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Bearings</Link>
              <Link to="/category/skateboards/griptape" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Griptape</Link>
              <Link to="/category/skateboards/completes" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Completes</Link>
            </div>
          </div>
          
          <div className="relative group">
            <Link to="/category/kledij" className="hover:text-accent transition-colors block py-2">
              Kledij
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <div className="absolute top-full left-0 mt-0 w-48 bg-[#111111] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <Link to="/category/kledij/longsleeve-t-shirts" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Longsleeve T-shirts</Link>
              <Link to="/category/kledij/hoodies" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Hoodies</Link>
              <Link to="/category/kledij/crewneck" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Crewneck</Link>
              <Link to="/category/kledij/broeken" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Broeken</Link>
              <Link to="/category/kledij/t-shirts" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">T-shirts</Link>
            </div>
          </div>
          
          <div className="relative group">
            <Link to="/category/schoenen" className="hover:text-accent transition-colors block py-2">
              Schoenen
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <div className="absolute top-full left-0 mt-0 w-48 bg-[#111111] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <Link to="/category/schoenen/skate-sneakers" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Skate Sneakers</Link>
            </div>
          </div>
          
          <div className="relative group">
            <Link to="/category/accessoires" className="hover:text-accent transition-colors block py-2">
              Accessoires
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <div className="absolute top-full left-0 mt-0 w-48 bg-[#111111] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <Link to="/category/accessoires/sokken" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Sokken</Link>
              <Link to="/category/accessoires/boxershorts" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Boxershorts</Link>
              <Link to="/category/accessoires/caps-beanies" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Caps & Beanies</Link>
              <Link to="/category/accessoires/belts" className="block px-4 py-3 hover:bg-white/5 hover:text-accent transition-colors">Belts</Link>
            </div>
          </div>
          
          <div className="relative group">
            <Link to="/about" className="hover:text-accent transition-colors block py-2">
              About
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle & Socials (Desktop) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-white/40">
            <motion.a 
              href="https://www.instagram.com/dailygrindskateshop/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#E4405F] transition-colors"
              whileHover={{ scale: 1.2, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram size={16} />
            </motion.a>
            <motion.a 
              href="https://www.facebook.com/profile.php?id=100052786183670&locale=nl_NL" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#1877F2] transition-colors"
              whileHover={{ scale: 1.2, rotate: -12 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook size={16} />
            </motion.a>
            <motion.a 
              href="https://www.youtube.com/@dailygrindskateshop2446" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#FF0000] transition-colors"
              whileHover={{ scale: 1.2, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
            >
              <Youtube size={16} />
            </motion.a>
          </div>
          <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-[#111111] border-t border-white/5 p-8 flex flex-col gap-6 font-display text-2xl font-bold uppercase text-white"
        >
          {/* Mobile Categories Accordion */}
          <div className="flex flex-col gap-4">
            {/* Skateboards */}
            <div>
              <button 
                onClick={() => toggleCategory('skateboards')}
                className="w-full text-left hover:text-accent transition-colors flex justify-between items-center"
              >
                <span>Skateboards</span>
                <ChevronDown size={24} className={`transition-transform duration-300 ${expandedCategory === 'skateboards' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'skateboards' && (
                <div className="flex flex-col gap-4 pl-4 pt-4 text-lg font-normal">
                  <Link to="/category/skateboards" onClick={() => setIsOpen(false)} className="hover:text-accent font-bold">Alle Skateboards</Link>
                  <Link to="/category/skateboards/decks" onClick={() => setIsOpen(false)} className="hover:text-accent">Decks</Link>
                  <Link to="/category/skateboards/bolts" onClick={() => setIsOpen(false)} className="hover:text-accent">Bolts</Link>
                  <Link to="/category/skateboards/trucks" onClick={() => setIsOpen(false)} className="hover:text-accent">Trucks</Link>
                  <Link to="/category/skateboards/wheels" onClick={() => setIsOpen(false)} className="hover:text-accent">Wheels</Link>
                  <Link to="/category/skateboards/bearings" onClick={() => setIsOpen(false)} className="hover:text-accent">Bearings</Link>
                  <Link to="/category/skateboards/griptape" onClick={() => setIsOpen(false)} className="hover:text-accent">Griptape</Link>
                  <Link to="/category/skateboards/completes" onClick={() => setIsOpen(false)} className="hover:text-accent">Completes</Link>
                </div>
              )}
            </div>

            {/* Kledij */}
            <div>
              <button 
                onClick={() => toggleCategory('kledij')}
                className="w-full text-left hover:text-accent transition-colors flex justify-between items-center"
              >
                <span>Kledij</span>
                <ChevronDown size={24} className={`transition-transform duration-300 ${expandedCategory === 'kledij' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'kledij' && (
                <div className="flex flex-col gap-4 pl-4 pt-4 text-lg font-normal">
                  <Link to="/category/kledij" onClick={() => setIsOpen(false)} className="hover:text-accent font-bold">Alle Kledij</Link>
                  <Link to="/category/kledij/longsleeve-t-shirts" onClick={() => setIsOpen(false)} className="hover:text-accent">Longsleeve T-shirts</Link>
                  <Link to="/category/kledij/hoodies" onClick={() => setIsOpen(false)} className="hover:text-accent">Hoodies</Link>
                  <Link to="/category/kledij/crewneck" onClick={() => setIsOpen(false)} className="hover:text-accent">Crewneck</Link>
                  <Link to="/category/kledij/broeken" onClick={() => setIsOpen(false)} className="hover:text-accent">Broeken</Link>
                  <Link to="/category/kledij/t-shirts" onClick={() => setIsOpen(false)} className="hover:text-accent">T-shirts</Link>
                </div>
              )}
            </div>

            {/* Schoenen */}
            <Link to="/category/schoenen" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">Schoenen</Link>

            {/* Accessoires */}
            <div>
              <button 
                onClick={() => toggleCategory('accessoires')}
                className="w-full text-left hover:text-accent transition-colors flex justify-between items-center"
              >
                <span>Accessoires</span>
                <ChevronDown size={24} className={`transition-transform duration-300 ${expandedCategory === 'accessoires' ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === 'accessoires' && (
                <div className="flex flex-col gap-4 pl-4 pt-4 text-lg font-normal">
                  <Link to="/category/accessoires" onClick={() => setIsOpen(false)} className="hover:text-accent font-bold">Alle Accessoires</Link>
                  <Link to="/category/accessoires/sokken" onClick={() => setIsOpen(false)} className="hover:text-accent">Sokken</Link>
                  <Link to="/category/accessoires/boxershorts" onClick={() => setIsOpen(false)} className="hover:text-accent">Boxershorts</Link>
                  <Link to="/category/accessoires/caps-beanies" onClick={() => setIsOpen(false)} className="hover:text-accent">Caps & Beanies</Link>
                  <Link to="/category/accessoires/belts" onClick={() => setIsOpen(false)} className="hover:text-accent">Belts</Link>
                </div>
              )}
            </div>
          </div>

          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">About</Link>
          
          <div className="flex gap-6 pt-4 border-t border-white/10">
            <motion.a 
              href="https://www.instagram.com/dailygrindskateshop/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#E4405F] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Instagram size={24} />
            </motion.a>
            <motion.a 
              href="https://www.facebook.com/profile.php?id=100052786183670&locale=nl_NL" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#1877F2] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Facebook size={24} />
            </motion.a>
            <motion.a 
              href="https://www.youtube.com/@dailygrindskateshop2446" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#FF0000] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Youtube size={24} />
            </motion.a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
