import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Contact from './components/Contact';
import ProductGrid from './components/ProductGrid';
import InstagramCarousel from './components/InstagramCarousel';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import LegalModal from './components/LegalModal';
import NotFoundPage from './components/NotFoundPage';
import Seo from './components/Seo';

const CategoryPage = React.lazy(() => import('./components/CategoryPage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const SkateparkDirectoryPage = React.lazy(() => import('./components/skateparks/SkateparkDirectoryPage'));
const SkateparkDetailPage = React.lazy(() => import('./components/skateparks/SkateparkDetailPage'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scrollToAnchor = () => {
        const target = document.getElementById(id);
        if (!target) {
          return;
        }

        const headerOffset = 96;
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      };

      window.requestAnimationFrame(scrollToAnchor);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [hash, pathname]);

  return null;
}

function HomePage() {
  const CLIP_DURATION_MS = 30000;
  const teamSectionRef = React.useRef<HTMLElement | null>(null);
  const { scrollYProgress: teamScrollProgress } = useScroll({
    target: teamSectionRef,
    offset: ['start end', 'end start']
  });
  const teamBackgroundY = useTransform(teamScrollProgress, [0, 1], [-80, 80]);
  const skateVideos = React.useMemo(
    () => [
      { id: 'UPyuc9f4oS0', label: 'Daily Grind On The Road Pier 15', startSeconds: 60 },
      { id: 'gFHPSDK6iKo', label: 'Barca 2k18', startSeconds: 60 },
      { id: 'U3g47trpkyg', label: 'Luxemboerg', startSeconds: 60 },
      { id: '_0h_YTT82BA', label: 'Jona Mix', startSeconds: 60 },
      { id: 'Z68AZH50KUE', label: 'Glenn Van Der Gheylen Street Throw Away Footy 2016', startSeconds: 60 }
    ],
    []
  );
  const [videoIndex, setVideoIndex] = React.useState(0);
  const [isVideoLoading, setIsVideoLoading] = React.useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const hideOverlayTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setIsVideoLoading(true);
    setIsVideoLoaded(false);

    if (hideOverlayTimeoutRef.current) {
      window.clearTimeout(hideOverlayTimeoutRef.current);
      hideOverlayTimeoutRef.current = null;
    }
  }, [videoIndex]);

  React.useEffect(() => {
    return () => {
      if (hideOverlayTimeoutRef.current) {
        window.clearTimeout(hideOverlayTimeoutRef.current);
      }
    };
  }, []);

  const activeVideo = skateVideos[videoIndex];
  const previousVideoIndex = (videoIndex - 1 + skateVideos.length) % skateVideos.length;
  const nextVideoIndex = (videoIndex + 1) % skateVideos.length;
  const previousVideo = skateVideos[previousVideoIndex];
  const nextVideo = skateVideos[nextVideoIndex];

  const goToPreviousVideo = React.useCallback(() => {
    setVideoIndex((prev) => (prev - 1 + skateVideos.length) % skateVideos.length);
  }, [skateVideos.length]);

  const goToNextVideo = React.useCallback(() => {
    setVideoIndex((prev) => (prev + 1) % skateVideos.length);
  }, [skateVideos.length]);

  React.useEffect(() => {
    const autoRotateInterval = window.setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % skateVideos.length);
    }, CLIP_DURATION_MS);

    return () => window.clearInterval(autoRotateInterval);
  }, [CLIP_DURATION_MS, skateVideos.length]);

  const handleVideoLoaded = React.useCallback(() => {
    if (hideOverlayTimeoutRef.current) {
      window.clearTimeout(hideOverlayTimeoutRef.current);
    }

    setIsVideoLoaded(true);

    // Keep the branded overlay visible briefly after playback starts.
    hideOverlayTimeoutRef.current = window.setTimeout(() => {
      setIsVideoLoading(false);
      setIsVideoLoaded(false);
      hideOverlayTimeoutRef.current = null;
    }, 5000);
  }, []);

  return (
    <>
      <Seo
        title="Daily Grind Blankenberge | Core Skateshop & West-Vlaanderen Skatepark Guide"
        description="Daily Grind Blankenberge is een core skateshop aan de Belgische kust met skateboards, streetwear, sneakers en een complete skatepark guide voor West-Vlaanderen."
        path="/"
        image="/OG_image.png"
      />
      <Hero />
      
      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee-content">
          DAILY GRIND BLANKENBERGE — SKATEBOARDS — STREETWEAR — SNEAKERS — HARDWARE — COMMUNITY — DAILY GRIND BLANKENBERGE — SKATEBOARDS — STREETWEAR — SNEAKERS — HARDWARE — COMMUNITY —
        </div>
      </div>

      <section id="tv" className="py-20 md:py-24 bg-surface border-y border-fg/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-end mb-8">
            <div className="lg:col-span-3">
              <p className="text-accent font-display font-bold uppercase tracking-widest text-xs mb-3">Daily Grind TV</p>
              <h2 className="text-4xl md:text-6xl font-black leading-[0.95] text-fg">See The Shop In Motion</h2>
            </div>
            <div className="lg:col-span-2 lg:text-right flex flex-col lg:items-end gap-3">
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] md:text-xs font-display font-bold uppercase tracking-widest border-b-2 border-fg pb-1 hover:text-accent hover:border-accent transition-colors"
              >
                Watch on YouTube
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-5">
            <motion.button
              onClick={goToPreviousVideo}
              aria-label="Play previous video"
              className="group h-14 w-14 md:h-16 md:w-16 brutal-border bg-fg text-bg flex flex-col items-center justify-center gap-0.5 hover:bg-accent transition-all"
              whileHover={{ y: -2, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronLeft size={20} />
              <span className="font-display font-bold uppercase tracking-widest text-[8px] md:text-[9px]">Prev</span>
            </motion.button>

            <div className="relative overflow-hidden brutal-border bg-black shadow-[0_25px_60px_rgba(0,0,0,0.20)]">
              <div className="aspect-video">
                <motion.iframe
                  key={activeVideo.id}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.id}?start=${activeVideo.startSeconds}&autoplay=1&mute=1&rel=0&playsinline=1`}
                  title="Daily Grind Blankenberge skate video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={handleVideoLoaded}
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <AnimatePresence>
                {isVideoLoading && (
                  <motion.div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.04 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background:
                          'radial-gradient(80% 120% at 50% 50%, rgba(196,43,43,0.22) 0%, rgba(0,0,0,0.76) 65%, rgba(0,0,0,0.92) 100%)'
                      }}
                    />

                    <AnimatePresence mode="wait">
                      {!isVideoLoaded ? (
                        <motion.div
                          key={`loading-${activeVideo.id}`}
                          className="relative z-10 flex flex-col items-center"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35 }}
                        >
                          <motion.img
                            src="/images/site/logo_daily_hero2.png"
                            alt="Daily Grind logo"
                            className="w-52 md:w-64"
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.45 }}
                          />
                          <div className="mt-6 flex items-center gap-3">
                            <span className="w-5 h-5 border-2 border-accent border-t-white rounded-full animate-spin" />
                            <span className="font-display font-bold uppercase tracking-widest text-[10px] md:text-xs text-white/80">
                              Loading next clip
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`reveal-${activeVideo.id}`}
                          className="relative z-10 flex flex-col items-center px-4"
                          initial={{ opacity: 0, scale: 0.94, y: 10 }}
                          animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1.04], y: [10, 0, 0, -6] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 4.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <img
                            src="/images/site/logo_daily_hero2.png"
                            alt="Daily Grind logo reveal"
                            className="w-[78vw] max-w-[760px]"
                          />
                          <p className="text-center font-display font-black uppercase tracking-[0.22em] text-xs md:text-sm text-accent mt-5">
                            {activeVideo.label}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={goToNextVideo}
              aria-label="Play next video"
              className="group h-14 w-14 md:h-16 md:w-16 brutal-border bg-fg text-bg flex flex-col items-center justify-center gap-0.5 hover:bg-accent transition-all"
              whileHover={{ y: -2, rotate: 2 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronRight size={20} />
              <span className="font-display font-bold uppercase tracking-widest text-[8px] md:text-[9px]">Next</span>
            </motion.button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display font-bold uppercase tracking-widest text-[10px] md:text-xs text-fg/70">
                Clip {videoIndex + 1} / {skateVideos.length}: {activeVideo.label}
              </p>
              <p className="font-display font-bold uppercase tracking-widest text-[10px] md:text-xs text-accent">
                Auto switch every 30s
              </p>
            </div>

            <div className="h-1.5 bg-fg/10 overflow-hidden brutal-border">
              <motion.div
                key={videoIndex}
                className="h-full bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: CLIP_DURATION_MS / 1000, ease: 'linear' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={goToPreviousVideo}
                className="group relative overflow-hidden brutal-border text-left"
                aria-label={`Play previous clip ${previousVideo.label}`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${previousVideo.id}/hqdefault.jpg`}
                  alt={previousVideo.label}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/28 transition-colors" />
                <div className="absolute inset-y-0 left-0 px-3 flex flex-col justify-center">
                  <p className="font-display font-bold uppercase tracking-[0.2em] text-[9px] text-white/70">Previous</p>
                  <p className="font-display font-black uppercase tracking-widest text-xs text-white mt-1 truncate max-w-[220px]">
                    {previousVideo.label}
                  </p>
                </div>
              </button>

              <button
                onClick={goToNextVideo}
                className="group relative overflow-hidden brutal-border text-left"
                aria-label={`Play next clip ${nextVideo.label}`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${nextVideo.id}/hqdefault.jpg`}
                  alt={nextVideo.label}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/28 transition-colors" />
                <div className="absolute inset-y-0 right-0 px-3 flex flex-col justify-center items-end text-right">
                  <p className="font-display font-bold uppercase tracking-[0.2em] text-[9px] text-white/70">Next</p>
                  <p className="font-display font-black uppercase tracking-widest text-xs text-white mt-1 truncate max-w-[220px]">
                    {nextVideo.label}
                  </p>
                </div>
              </button>
            </div>
              </div>
        </div>
      </section>

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

      <section className="py-24 bg-fg text-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative brutal-border overflow-hidden min-h-[560px] flex items-end">
            <img
              src="/images/site/skateparkguide.jpg"
              alt="West-Vlaanderen skatepark guide"
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.58)_45%,rgba(0,0,0,0.28)_100%)]" />

            <div className="relative z-10 max-w-3xl p-8 md:p-12 lg:p-16">
              <p className="text-accent font-display font-bold uppercase tracking-widest text-xs mb-4">Skatepark Guide</p>
              <h2 className="text-5xl md:text-7xl font-black leading-[0.95] text-white mb-6">Alle Spots In West-Vlaanderen. Op Kaart.</h2>
              <p className="text-lg text-white/78 leading-relaxed max-w-2xl">
                Jouw ultieme gids voor elke skatespot in West-Vlaanderen. Of je nu een local bent die een nieuwe spot zoekt, of een roadtrip langs de kust plant: vind direct de perfecte spot voor je volgende sessie. Minder zoeken, meer riden.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/skateparks-west-vlaanderen"
                  className="inline-flex items-center justify-center gap-3 bg-accent px-8 py-4 font-display font-black uppercase tracking-[0.24em] text-xs hover:bg-white hover:text-fg transition-all"
                >
                  Open de skate map
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  to="/skateparks-west-vlaanderen#brugge-noordwest"
                  className="inline-flex items-center justify-center border border-white/15 px-8 py-4 font-display font-black uppercase tracking-[0.24em] text-xs text-white hover:border-accent hover:text-accent transition-all"
                >
                  Start bij de kust
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InstagramCarousel />

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
          <React.Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-bg px-6">
                <div className="flex items-center gap-3 font-display font-bold uppercase tracking-[0.2em] text-xs text-fg/60">
                  <span className="w-4 h-4 border-2 border-accent border-t-fg rounded-full animate-spin" />
                  Loading session
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/category/:category/:subcategory" element={<CategoryPage />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/skateparks-west-vlaanderen" element={<SkateparkDirectoryPage />} />
              <Route path="/skateparks-west-vlaanderen/:slug" element={<SkateparkDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
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
                  <li><Link to="/skateparks-west-vlaanderen" className="hover:text-accent transition-colors flex items-center gap-2 group">Skateparks <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
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
