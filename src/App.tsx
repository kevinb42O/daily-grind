import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Contact from './components/Contact';
import ProductGrid from './components/ProductGrid';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowUpRight, ExternalLink } from 'lucide-react';

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import CategoryPage from './components/CategoryPage';
import AboutPage from './components/AboutPage';
import BackToTop from './components/BackToTop';
import LegalModal from './components/LegalModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  const teamSectionRef = React.useRef<HTMLElement | null>(null);
  const { scrollYProgress: teamScrollProgress } = useScroll({
    target: teamSectionRef,
    offset: ['start end', 'end start']
  });
  const teamBackgroundY = useTransform(teamScrollProgress, [0, 1], [-80, 80]);

  return (
    <>
      <Hero />
      
      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
          DAILY GRIND BLANKENBERGE — SKATEBOARDS — STREETWEAR — SNEAKERS — HARDWARE — COMMUNITY — DAILY GRIND BLANKENBERGE — SKATEBOARDS — STREETWEAR — SNEAKERS — HARDWARE — COMMUNITY —
        </div>
      </div>

      <ProductGrid />

      <section
        id="team"
        ref={teamSectionRef}
        className="relative py-24 overflow-hidden bg-cover bg-center"
      >
        <motion.div
          className="absolute inset-x-0 -top-20 -bottom-20 bg-cover bg-[center_top]"
          style={{
            y: teamBackgroundY,
            backgroundImage: 'url("/images/site/promo-1.jpg")'
          }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-black mb-8 text-white">Team</h2>
            <p className="text-xl font-display uppercase tracking-widest mb-8 text-accent font-bold">Check our riders</p>
            <p className="text-lg text-white/85 leading-relaxed mb-8">
              Het Daily Grind team vormt de core van het skateboarden in Blankenberge. Van local legends tot opkomend talent, wij ondersteunen iedereen die de grind ademt en beleeft.
            </p>

          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="/images/site/cta.jpg" 
              alt="Shop Interior" 
              className="w-full aspect-[4/5] object-cover brutal-border"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-fg text-bg p-6 hidden lg:flex items-center justify-center text-center font-display font-black leading-tight uppercase">
              Authentic Skate Culture Since 2015
            </div>
          </div>
          <div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-fg">The Grind is Real</h2>
            <div className="space-y-6 text-lg text-fg/70 leading-relaxed">
              <p>
                Gelegen in het hart van Blankenberge, is Daily Grind meer dan alleen een skateshop. Het is een ontmoetingsplaats voor de lokale community, een plek waar passie voor het board samenkomt met high-end streetstyle.
              </p>
              <p>
                We selecteren elk merk en product met de hand, zodat alleen de hoogste kwaliteit hardware en kledij in onze rekken belandt. Van de nieuwste Adidas drops tot core skate merken zoals Polar en Magenta, wij hebben alles wat je nodig hebt.
              </p>
              <Link to="/about" className="group flex items-center gap-4 font-display font-bold uppercase tracking-widest mt-8">
                <span className="group-hover:text-accent transition-colors text-fg">Lees ons volledige verhaal</span>
                <div className="w-12 h-[2px] bg-fg group-hover:bg-accent group-hover:w-16 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Brands />
      
      <Contact />
    </>
  );
}

export default function App() {
  const [legalModal, setLegalModal] = React.useState<{ isOpen: boolean; type: 'tos' | 'privacy' | null }>({
    isOpen: false,
    type: null
  });

  const openLegalModal = (type: 'tos' | 'privacy') => {
    setLegalModal({ isOpen: true, type });
  };

  const closeLegalModal = () => {
    setLegalModal({ ...legalModal, isOpen: false });
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Router>
      <ScrollToTop />
      <div className="relative bg-bg text-fg">
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
          style={{ scaleX }}
        />

        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />

            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <footer className="bg-fg text-bg pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
              <div className="lg:col-span-2">
                <Link to="/" className="mb-4 block -ml-4">
                  <img 
                    src="/images/site/logo_daily_hero2.png" 
                    alt="Daily Grind Logo" 
                    className="w-64 md:w-80 h-auto"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <p className="text-bg/85 text-lg max-w-md mb-8">
                  Daily Grind Skateshop is sinds begin 2015 een core skateshop in de Langestraat van Blankenberge, gebouwd op passie voor authentic skate culture door Dré en Ira.
                </p>
                <div className="flex gap-6">
                  <motion.a 
                    href="https://www.instagram.com/dailygrindskateshop/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-bg/60 hover:text-[#E4405F] transition-all"
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram size={24} />
                  </motion.a>
                  <motion.a 
                    href="https://www.facebook.com/profile.php?id=100052786183670&locale=nl_NL#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-bg/60 hover:text-[#1877F2] transition-all"
                    whileHover={{ scale: 1.2, rotate: -12 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook size={24} />
                  </motion.a>
                  <motion.a 
                    href="https://www.youtube.com/@dailygrindskateshop2446" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-bg/60 hover:text-[#FF0000] transition-all"
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Youtube size={24} />
                  </motion.a>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-accent">Shop</h4>
                <ul className="space-y-2 font-display text-sm uppercase tracking-widest font-bold">
                  <li><Link to="/category/skateboards" className="hover:text-accent transition-colors flex items-center gap-2 group">Skateboards <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/category/kledij" className="hover:text-accent transition-colors flex items-center gap-2 group">Kledij <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/category/schoenen" className="hover:text-accent transition-colors flex items-center gap-2 group">Schoenen <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/category/accessoires" className="hover:text-accent transition-colors flex items-center gap-2 group">Accessoires <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/about" className="hover:text-accent transition-colors flex items-center gap-2 group">Over Ons <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-accent">Contact & Info</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <MapPin size={16} className="text-accent shrink-0" strokeWidth={2.5} />
                    <span className="text-bg/85">Langestraat 1, Blankenberge</span>
                  </li>
                  <li className="flex gap-3">
                    <Phone size={16} className="text-accent shrink-0" strokeWidth={2.5} />
                    <span className="text-bg/85">050/73 15 66</span>
                  </li>
                  <li className="flex gap-3">
                    <Mail size={16} className="text-accent shrink-0" strokeWidth={2.5} />
                    <span className="text-bg/85">info@dailygrind.be</span>
                  </li>
                  <li className="pt-4 border-t border-bg/10">
                    <p className="font-display font-bold uppercase tracking-widest text-[10px] mb-2 text-accent">Openingsuren</p>
                    <p className="text-bg/85 text-xs">Ma, Wo-Za: 10:00 - 18:00</p>
                    <p className="text-bg/85 text-xs font-bold text-accent">Dinsdag: Gesloten</p>
                    <p className="text-bg/85 text-xs">Zondag: 12:00 - 18:00</p>
                  </li>
                  <li className="pt-4 flex gap-4 font-display text-[10px] font-bold uppercase tracking-widest text-bg/40">
                    <button 
                      onClick={() => openLegalModal('tos')} 
                      className="hover:text-accent transition-colors cursor-pointer"
                    >
                      Terms
                    </button>
                    <button 
                      onClick={() => openLegalModal('privacy')} 
                      className="hover:text-accent transition-colors cursor-pointer"
                    >
                      Privacy
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-bg/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-bg/60">
                © 2026 Daily Grind Blankenberge. All Rights Reserved.
              </div>

              <a 
                href="https://www.webaanzee.be" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 group no-underline"
              >
                <span className="text-[7.5px] uppercase tracking-[0.05em] text-bg/30 pt-0.5">designed by</span>
                <span className="text-[11px] font-display font-bold tracking-tight text-bg/80 group-hover:text-bg transition-colors">
                  Web<span className="text-[#FFB800]">aan</span>Zee.be
                </span>
                <ExternalLink size={9} className="text-bg/30 group-hover:text-bg/50 transition-colors" />
              </a>
            </div>
          </div>
        </footer>
        <BackToTop />
        <LegalModal 
          isOpen={legalModal.isOpen} 
          type={legalModal.type} 
          onClose={closeLegalModal} 
        />
      </div>
    </Router>
  );
}
