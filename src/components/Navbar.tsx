import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const closeMenu = React.useCallback(() => setIsOpen(false), []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Contact', to: '/#location' },
    { label: 'Skateparks', to: '/skateparks-west-vlaanderen' },
    { label: 'About', to: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[1100] bg-[#111111] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img 
            src="/images/site/logo_daily_hero2.png" 
            alt="Daily Grind Logo" 
            className="h-10 w-auto brightness-0 invert"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          {navLinks.map((item) => (
            <div key={item.label} className="relative group">
              <Link to={item.to} className="hover:text-accent transition-colors block py-2">
                {item.label}
                <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          ))}

          <Link
            to="/#products"
            className="ml-2 border border-accent/70 bg-accent px-4 py-2 text-[9px] text-white hover:bg-transparent hover:text-accent transition-colors"
          >
            Shop
          </Link>
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
          <button
            className="text-white md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Sluit menu' : 'Open menu'}
          >
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
          <div className="flex flex-col gap-3 text-2xl">
            {navLinks.map((item) => (
              <Link key={item.label} to={item.to} onClick={closeMenu} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            ))}

            <Link
              to="/#products"
              onClick={closeMenu}
              className="mt-2 inline-flex w-full items-center justify-center border border-accent bg-accent px-5 py-4 text-lg text-white hover:bg-transparent hover:text-accent transition-colors"
            >
              Shop
            </Link>
          </div>
          
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
