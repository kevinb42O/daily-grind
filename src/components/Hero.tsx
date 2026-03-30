import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin } from 'lucide-react';

const BRUSSELS_TZ = 'Europe/Brussels';

type ShopStatus = {
  isOpen: boolean;
  label: string;
  detail: string;
};

const dayNameShortNl: Record<number, string> = {
  0: 'zo',
  1: 'ma',
  2: 'di',
  3: 'wo',
  4: 'do',
  5: 'vr',
  6: 'za'
};

const HERO_INFO_LAYOUT: 'pill' | 'corners' = 'corners';

function getBrusselsWeekdayAndMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BRUSSELS_TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const weekdayPart = parts.find((part) => part.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  return {
    weekday: weekdayMap[weekdayPart] ?? 1,
    minutes: hour * 60 + minute
  };
}

function getShopStatus(date: Date): ShopStatus {
  const { weekday, minutes } = getBrusselsWeekdayAndMinutes(date);

  const schedule: Record<number, { open: number; close: number } | null> = {
    0: { open: 12 * 60, close: 18 * 60 },
    1: { open: 10 * 60, close: 18 * 60 },
    2: null,
    3: { open: 10 * 60, close: 18 * 60 },
    4: { open: 10 * 60, close: 18 * 60 },
    5: { open: 10 * 60, close: 18 * 60 },
    6: { open: 10 * 60, close: 18 * 60 }
  };

  const today = schedule[weekday];

  if (today && minutes >= today.open && minutes < today.close) {
    return {
      isOpen: true,
      label: 'Nu Open',
      detail: `Sluit ${String(Math.floor(today.close / 60)).padStart(2, '0')}:00`
    };
  }

  if (today && minutes < today.open) {
    return {
      isOpen: false,
      label: 'Nu Gesloten',
      detail: `Opent vandaag ${String(Math.floor(today.open / 60)).padStart(2, '0')}:00`
    };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextWeekday = (weekday + offset) % 7;
    const next = schedule[nextWeekday];
    if (next) {
      return {
        isOpen: false,
        label: 'Nu Gesloten',
        detail: `Opent ${dayNameShortNl[nextWeekday]} ${String(Math.floor(next.open / 60)).padStart(2, '0')}:00`
      };
    }
  }

  return {
    isOpen: false,
    label: 'Nu Gesloten',
    detail: 'Openingsuren binnenkort beschikbaar'
  };
}

const banners = [
  {
    id: 1,
    image: "/images/hero/hero-banner-1.jpg",
    srcSet: "/images/hero/hero-banner-1-960.jpg 960w, /images/hero/hero-banner-1-1600.jpg 1600w, /images/hero/hero-banner-1.jpg 3828w",
  },
  {
    id: 2,
    image: "/images/hero/hero-banner-2.jpg",
    srcSet: "/images/hero/hero-banner-2-960.jpg 960w, /images/hero/hero-banner-2-1600.jpg 1600w, /images/hero/hero-banner-2.jpg 2704w",
  },
  {
    id: 3,
    image: "/images/hero/hero-banner-3.jpg",
    srcSet: "/images/hero/hero-banner-3-960.jpg 960w, /images/hero/hero-banner-3-1600.jpg 1600w, /images/hero/hero-banner-3.jpg 3990w",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]); // Adjusted for individual image shifts

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const shopStatus = React.useMemo(() => getShopStatus(now), [now]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-surface">
      {/* Background Carousel */}
      <motion.div 
        className="absolute inset-0 z-0 flex" 
        animate={{ x: `-${current * 100}%` }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative overflow-hidden">
            <motion.img 
              src={banner.image} 
              srcSet={banner.srcSet}
              sizes="100vw"
              alt="Daily Grind Hero" 
              loading={banner.id === 1 ? 'eager' : 'lazy'}
              fetchPriority={banner.id === 1 ? 'high' : 'auto'}
              decoding="async"
              className="w-full h-[120%] object-cover absolute top-0 left-0"
              style={{ 
                top: '-10%',
                y: y1 
              }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </div>
        ))}
      </motion.div>

      <div className="relative z-10 text-center px-6 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="griptape-overlay inline-block">
            <img 
              src="/images/site/logo_daily_hero2.png" 
              alt="Daily Grind Skateshop" 
              className="w-[68vw] max-w-[760px] mb-4"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' }}
            />
          </div>

          {HERO_INFO_LAYOUT === 'pill' && (
            <a
              href="https://maps.google.com/?q=Langestraat+1,+Blankenberge"
              target="_blank"
              rel="noopener noreferrer"
              aria-live="polite"
              className="mt-2 mx-auto inline-flex max-w-[92vw] sm:max-w-none items-center justify-center gap-2 sm:gap-3 rounded-full border border-white/25 bg-black/30 px-5 sm:px-7 py-3 text-white font-display font-bold uppercase tracking-widest text-xs md:text-sm hover:border-white/45 transition-colors"
            >
              <MapPin size={14} />
              <span>Langestraat 1, Blankenberge</span>
              <span className="text-white/60">|</span>
              <span className={`h-2.5 w-2.5 rounded-full ${shopStatus.isOpen ? 'bg-emerald-300' : 'bg-rose-300'}`} />
              <span className={shopStatus.isOpen ? 'text-emerald-100' : 'text-rose-100'}>{shopStatus.label}</span>
              <span className="normal-case tracking-normal text-[11px] md:text-xs text-white/90">({shopStatus.detail})</span>
            </a>
          )}

          {HERO_INFO_LAYOUT === 'corners' && (
            <a
              href="https://maps.google.com/?q=Langestraat+1,+Blankenberge"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 mx-auto inline-flex items-center gap-2.5 border border-white/25 bg-black/30 px-5 py-3 text-white font-display font-bold uppercase tracking-widest text-xs md:text-sm hover:border-white/45 transition-colors"
            >
              <MapPin size={14} />
              <span>Langestraat 1, Blankenberge</span>
            </a>
          )}
        </div>
      </div>

      {HERO_INFO_LAYOUT === 'corners' && (
        <>
          <div
            aria-live="polite"
            className={`absolute z-30 bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 inline-flex items-center gap-2 border px-4 py-2 font-display font-bold uppercase tracking-widest text-[10px] md:text-xs ${shopStatus.isOpen ? 'border-emerald-400/70 bg-black/30 text-emerald-100' : 'border-rose-400/70 bg-black/30 text-rose-100'}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${shopStatus.isOpen ? 'bg-emerald-300' : 'bg-rose-300'}`} />
            <span>{shopStatus.label}</span>
            <span className="text-white/60">|</span>
            <span className="normal-case tracking-normal text-[11px] md:text-xs text-white/90">{shopStatus.detail}</span>
          </div>
        </>
      )}

      {/* Slide Indicators */}
      <div className={`absolute left-1/2 -translate-x-1/2 gap-4 z-20 ${HERO_INFO_LAYOUT === 'corners' ? 'bottom-4 hidden md:flex' : 'bottom-10 flex'}`}>
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-12 h-1 transition-all ${i === current ? 'bg-accent' : 'bg-fg/20'}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className={`absolute bottom-10 left-10 hidden lg:block z-20 ${HERO_INFO_LAYOUT === 'corners' ? 'md:hidden' : ''}`}>
        <div className="flex flex-col gap-2">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="text-[10px] uppercase tracking-widest text-white/50">Est. 2015</span>
        </div>
      </div>
    </section>
  );
}
