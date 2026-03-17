import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'tos' | 'privacy' | null;
  onClose: () => void;
}

export default function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  const content = {
    tos: {
      title: "Terms of Service",
      sections: [
        {
          heading: "1. Acceptatie van Voorwaarden",
          text: "Door de website van Daily Grind Blankenberge te bezoeken, gaat u akkoord met deze algemene voorwaarden en alle toepasselijke wet- en regelgeving."
        },
        {
          heading: "2. Gebruik van de Site",
          text: "De inhoud van deze site is bedoeld voor persoonlijk, niet-commercieel gebruik. Het kopiëren of herdistribueren van materiaal is verboden zonder uitdrukkelijke schriftelijke toestemming."
        },
        {
          heading: "3. Productinformatie",
          text: "We streven naar nauwkeurige productbeschrijvingen en prijzen, maar kunnen eventuele fouten of weglatingen niet volledig uitsluiten."
        },
        {
          heading: "4. Retourbeleid",
          text: "Raadpleeg onze winkel in Blankenberge voor specifieke details over retouren en ruilen van hardware en kledij."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          heading: "1. Gegevensverzameling",
          text: "Wij verzamelen alleen de hoognodige informatie die u ons verstrekt bij het bezoeken van onze shop of het contacteren via onze kanalen."
        },
        {
          heading: "2. Gebruik van Informatie",
          text: "Uw gegevens worden enkel gebruikt om onze service te verbeteren en u te informeren over drops, events en updates van Daily Grind."
        },
        {
          heading: "3. Cookies",
          text: "Deze website maakt gebruik van functionele cookies om uw surfervaring te optimaliseren."
        },
        {
          heading: "4. Uw Rechten",
          text: "U heeft te allen tijde het recht om uw persoonlijke gegevens in te zien, te corrigeren of te laten verwijderen."
        }
      ]
    }
  };

  const activeContent = type ? content[type] : null;

  return (
    <AnimatePresence>
      {isOpen && activeContent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-bg brutal-border overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 md:p-10 border-b border-fg/10 flex justify-between items-center bg-surface">
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                {activeContent.title}
              </h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-fg text-bg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {activeContent.sections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-display font-bold uppercase tracking-widest text-accent mb-3 text-sm">
                      {section.heading}
                    </h4>
                    <p className="text-fg/80 leading-relaxed font-medium">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-fg/10 text-[10px] uppercase tracking-widest text-fg/40 font-bold">
                Laatst bijgewerkt: Maart 2026 — Daily Grind Blankenberge
              </div>
            </div>

            <div className="p-6 bg-surface border-t border-fg/10 flex justify-end">
              <button 
                onClick={onClose}
                className="bg-fg text-bg px-8 py-3 font-display font-bold uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Sluiten
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
