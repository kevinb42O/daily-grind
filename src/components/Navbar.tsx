import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram, Facebook } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-fg/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img 
            src="/images/site/daily_grind_clean.png" 
            alt="Daily Grind Logo" 
            className="h-10 w-auto invert"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-display text-xs font-bold uppercase tracking-widest text-fg/60">
          <Link to="/category/skateboards" className="hover:text-accent transition-colors">Skateboards</Link>
          <Link to="/category/kledij" className="hover:text-accent transition-colors">Kledij</Link>
          <Link to="/category/schoenen" className="hover:text-accent transition-colors">Schoenen</Link>
          <Link to="/category/accessoires" className="hover:text-accent transition-colors">Accessoires</Link>
          <Link to="/about" className="hover:text-accent transition-colors">About</Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-fg" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-bg border-b border-fg/10 p-6 flex flex-col gap-6 font-display text-xl font-bold uppercase text-fg"
        >
          <Link to="/category/skateboards" onClick={() => setIsOpen(false)}>Skateboards</Link>
          <Link to="/category/kledij" onClick={() => setIsOpen(false)}>Kledij</Link>
          <Link to="/category/schoenen" onClick={() => setIsOpen(false)}>Schoenen</Link>
          <Link to="/category/accessoires" onClick={() => setIsOpen(false)}>Accessoires</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          <a href="#location" onClick={() => setIsOpen(false)}>Location</a>
        </motion.div>
      )}
    </nav>
  );
}
