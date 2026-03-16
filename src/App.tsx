import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Contact from './components/Contact';
import ProductGrid from './components/ProductGrid';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import CategoryPage from './components/CategoryPage';
import AboutPage from './components/AboutPage';
import BackToTop from './components/BackToTop';

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
          className="absolute inset-x-0 -top-20 -bottom-20 bg-cover bg-center"
          style={{
            y: teamBackgroundY,
            backgroundImage: 'url("/images/site/promo-1.jpg")'
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-black mb-8 text-white">Team</h2>
            <p className="text-xl font-display uppercase tracking-widest mb-8 text-accent font-bold">Check our riders</p>
            <p className="text-lg text-white/85 leading-relaxed mb-8">
              The Daily Grind team represents the core of Blankenberge skateboarding. From local legends to rising talent, we support those who live and breathe the grind.
            </p>
            <button className="bg-white text-black px-8 py-4 font-display font-bold uppercase tracking-widest hover:bg-accent hover:text-fg transition-colors">
              Meet the Crew
            </button>
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
              Authentic Skate Culture Since 2004
            </div>
          </div>
          <div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-fg">The Grind is Real</h2>
            <div className="space-y-6 text-lg text-fg/70 leading-relaxed">
              <p>
                Located in the heart of Blankenberge, Daily Grind is more than just a skateshop. It's a hub for the local community, a place where passion for the board meets high-end street style.
              </p>
              <p>
                We hand-pick every brand and product, ensuring only the highest quality hardware and apparel hit our shelves. From the latest Nike SB drops to core skate brands like Polar and Magenta, we've got you covered.
              </p>
              <Link to="/about" className="group flex items-center gap-4 font-display font-bold uppercase tracking-widest mt-8">
                <span className="group-hover:text-accent transition-colors text-fg">Read our full story</span>
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
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <footer className="bg-fg text-bg pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
              <div className="lg:col-span-2">
                <Link to="/" className="mb-4 block -ml-4">
                  <img 
                    src="/images/site/dailygrindlogo.png" 
                    alt="Daily Grind Logo" 
                    className="w-64 md:w-80 h-auto invert"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <p className="text-bg/60 text-lg max-w-md mb-8">
                  Daily Grind Skateshop is sinds 2004 een core skateshop in de Kerkstraat van Blankenberge, gebouwd op passie voor authentic skate culture door Dré en Ira.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/dailygrindskateshop/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-bg/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                    <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=100052786183670&locale=nl_NL#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-bg/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                    <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.youtube.com/@dailygrindskateshop2446" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-bg/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                    <Youtube size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-accent">Shop</h4>
                <ul className="space-y-4 font-display text-sm uppercase tracking-widest font-bold">
                  <li><Link to="/category/skateboards" className="hover:text-accent transition-colors flex items-center gap-2 group">Skateboards <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/category/kledij" className="hover:text-accent transition-colors flex items-center gap-2 group">Kledij <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/category/schoenen" className="hover:text-accent transition-colors flex items-center gap-2 group">Schoenen <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                  <li><Link to="/category/accessoires" className="hover:text-accent transition-colors flex items-center gap-2 group">Accessoires <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-8 text-accent">Contact & Info</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <MapPin size={16} className="text-accent shrink-0" />
                    <span className="text-bg/60">Kerkstraat 61, Blankenberge</span>
                  </li>
                  <li className="flex gap-3">
                    <Phone size={16} className="text-accent shrink-0" />
                    <span className="text-bg/60">+32 50 42 31 11</span>
                  </li>
                  <li className="flex gap-3">
                    <Mail size={16} className="text-accent shrink-0" />
                    <span className="text-bg/60">info@dailygrind.be</span>
                  </li>
                  <li className="pt-4 border-t border-bg/10">
                    <p className="font-display font-bold uppercase tracking-widest text-[10px] mb-2 text-accent">Openingsuren</p>
                    <p className="text-bg/60 text-xs">Ma - Za: 10:00 - 18:00</p>
                    <p className="text-bg/60 text-xs">Zondag: 11:00 - 17:00</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-bg/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-bg/30">
                © 2026 Daily Grind Blankenberge. All Rights Reserved.
              </div>
              <div className="flex gap-8 font-display text-[10px] font-bold uppercase tracking-widest text-bg/40">
                <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </footer>
        <BackToTop />
      </div>
    </Router>
  );
}
