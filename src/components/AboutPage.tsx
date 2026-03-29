import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from './Seo';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="Over Daily Grind Blankenberge | Core Skateshop sinds 2015"
        description="Ontdek het verhaal achter Daily Grind Blankenberge. Een core skateshop sinds 2015, gebouwd op authentic skate culture, community en lokale scene support."
        path="/about"
        image="/OG_image.png"
      />

      <div className="pt-32 pb-24 min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-bold uppercase text-xs tracking-widest hover:text-accent transition-colors mb-12">
          <ArrowLeft size={16} /> Terug naar Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8">The Grind Is Real.</h1>
            <div className="space-y-6 text-lg text-fg/70 leading-relaxed">
              <p className="text-xl text-fg font-medium">
                Daily Grind Skateshop is al sinds begin 2015 een onmisbaar baken in de Langestraat van Blankenberge. Wat begon als een pure passie voor skateboarden, is onder leiding van Dré en Ira uitgegroeid tot een van de meest gerespecteerde core skateshops aan de Belgische kust.
              </p>
              <p>
                Bij Daily Grind draait alles om authenticiteit. De eigenaren brengen hun liefde voor de straatcultuur samen in de shop. Dit zie je terug in de zorgvuldig samengestelde collectie hardware, footwear en apparel.
              </p>
              <p>
                Of je nu op zoek bent naar de nieuwste Helas drops, core brands zoals Polar Skate Co., Magenta of Huf, of gewoon een praatje wilt maken over de lokale scene: de deur staat altijd open. We zijn meer dan een winkel; we zijn een community hub waar de passie voor het board centraal staat. No bullshit, just skateboarding.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img 
              src="/images/site/promo-2.jpg" 
              alt="Shop Interior" 
              className="w-full aspect-[4/5] object-cover border-4 border-fg shadow-[16px_16px_0px_0px_rgba(20,20,20,1)]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -left-8 bg-accent text-bg p-8 font-display font-black uppercase text-2xl leading-tight max-w-[240px]">
              Support Your Local Since 2015.
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 bg-surface border border-fg/5">
            <MapPin className="text-accent mb-6" size={32} />
            <h3 className="font-display font-black uppercase text-xl mb-4">Locatie</h3>
            <p className="text-fg/60">Langestraat 1,<br />8370 Blankenberge</p>
          </div>
          <div className="p-8 bg-surface border border-fg/5">
            <Clock className="text-accent mb-6" size={32} />
            <h3 className="font-display font-black uppercase text-xl mb-4">Openingsuren</h3>
            <div className="text-fg/60 space-y-1">
              <p>Ma, Wo - Za: 10:00 - 18:00</p>
              <p className="font-bold text-accent">Dinsdag: Gesloten</p>
              <p>Zondag: 12:00 - 18:00</p>
              <p className="mt-4 text-xs italic opacity-70 border-t border-fg/10 pt-2">
                Feest- en schoolvakanties elke dag open van 10-18u (zondag 12-18u)
              </p>
            </div>
          </div>
          <div className="p-8 bg-surface border border-fg/5">
            <Mail className="text-accent mb-6" size={32} />
            <h3 className="font-display font-black uppercase text-xl mb-4">Contact</h3>
            <p className="text-fg/60">info@dailygrind.be<br />050/73 15 66</p>
          </div>
        </div>

        <div className="border-t border-fg/10 pt-24 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12">Kom langs in de shop.</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Langestraat+1+Blankenberge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-fg text-bg px-10 py-5 font-display font-bold uppercase tracking-widest hover:bg-accent transition-all"
            >
              Routebeschrijving
            </a>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
