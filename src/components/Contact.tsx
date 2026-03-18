import React from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Contact() {
  return (
    <section id="location" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-6xl md:text-8xl font-black mb-12 text-fg">Find Us</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="text-accent shrink-0 pt-1">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl uppercase mb-2 text-fg">Address</h3>
                  <p className="text-fg/60">Langestraat 1<br />8370 Blankenberge, Belgium</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-accent shrink-0 pt-1">
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl uppercase mb-2 text-fg">Opening Hours</h3>
                  <ul className="text-fg/60 space-y-1 text-sm">
                    <li className="flex justify-between w-56 font-bold text-accent"><span>Tuesday</span> <span>Closed</span></li>
                    <li className="flex justify-between w-56"><span>Mon, Wed - Sat</span> <span>10:00 - 18:00</span></li>
                    <li className="flex justify-between w-56"><span>Sunday</span> <span>12:00 - 18:00</span></li>
                    <li className="pt-2 text-[10px] uppercase tracking-wider opacity-60 border-t border-fg/5 mt-2">
                      Holidays: open every day 10-18u (Sun 12-18u)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-accent shrink-0 pt-1">
                  <Phone size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl uppercase mb-2 text-fg">Contact</h3>
                  <p className="text-fg/60">050/73 15 66</p>
                  <p className="text-fg/60">info@dailygrind.be</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-6">
              <a 
                href="https://www.instagram.com/dailygrindskateshop/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-all group"
              >
                <Instagram size={24} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=100052786183670&locale=nl_NL#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-all group"
              >
                <Facebook size={24} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.youtube.com/@dailygrindskateshop2446" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-fg hover:text-accent transition-all group"
              >
                <Youtube size={24} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div className="h-[400px] lg:h-auto bg-bg border border-fg/5 relative overflow-hidden shadow-2xl shadow-fg/5">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500.672803875323!2d3.128741377054361!3d51.31713602464731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c350b919999999%3A0x9999999999999999!2sLangestraat%201%2C%208370%20Blankenberge!5e0!3m2!1sen!2sbe!4v1710460000000!5m2!1sen!2sbe" 
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Daily Grind Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
