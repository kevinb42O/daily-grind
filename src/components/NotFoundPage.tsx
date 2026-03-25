import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Skull } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden griptape-overlay">
      {/* Background Decorative Element */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[20vw] font-black font-display leading-none">404</span>
      </motion.div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-accent text-white mb-8 brutal-border rotate-3 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]"
        >
            <Skull size={40} />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black mb-4 tracking-tighter"
        >
          BAILED!
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl font-display font-bold uppercase tracking-widest text-fg/70 mb-12"
        >
            Looks like you took the wrong line.
        </motion.p>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.3 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
            <p className="text-lg text-fg/60 max-w-md leading-relaxed">
                The page you're searching for hit the pavement or never existed. Let's get you back to the session.
            </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 bg-fg text-bg px-8 py-4 font-display font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(196,43,43,0)] hover:shadow-[8px_8px_0px_0px_rgba(196,43,43,1)]"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Floating Elements for extra "skate" vibe */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 opacity-10 hidden lg:block"
      >
          <div className="w-32 h-2 bg-fg brutal-border" />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 opacity-10 hidden lg:block"
      >
          <div className="w-48 h-2 bg-accent brutal-border" />
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
