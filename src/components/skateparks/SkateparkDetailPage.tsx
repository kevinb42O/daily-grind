import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  MapPin,
  Navigation,
  Warehouse,
  CloudRain,
  Ticket,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../Seo';
import NotFoundPage from '../NotFoundPage';
import { skateparksBySlug } from '../../data/skateparks';
import { createMapsLink, formatCoordinatePair, getCanonicalUrl, getNearbySkateparks } from '../../lib/skateparks';
import SkateparkImage from './SkateparkImage';
import SkateparkMap from './SkateparkMap';
import SkateparkCard from './SkateparkCard';

export default function SkateparkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const park = slug ? skateparksBySlug.get(slug) : undefined;
  const [copyState, setCopyState] = React.useState<'idle' | 'copied'>('idle');

  const copyCoordinates = async () => {
    if (!park) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`${park.coordinates.lat}, ${park.coordinates.lng}`);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('idle');
    }
  };

  if (!park) {
    return <NotFoundPage />;
  }

  const nearbyParks = getNearbySkateparks(park, 3);
  const seoTitle = `${park.name} in ${park.city} | Skatepark West-Vlaanderen | Daily Grind`;
  const seoDescription = `${park.name} in ${park.city}: adres, coördinaten, type park, features en praktische info. Ontdek deze skate spot in West-Vlaanderen via Daily Grind.`;

  const locationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: park.name,
    description: park.longDescription,
    image: getCanonicalUrl(park.heroImage),
    url: getCanonicalUrl(`/skateparks-west-vlaanderen/${park.slug}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: park.address,
      postalCode: park.postalCode,
      addressLocality: park.city,
      addressRegion: 'West-Vlaanderen',
      addressCountry: 'BE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: park.coordinates.lat,
      longitude: park.coordinates.lng,
    },
    amenityFeature: park.features.map((feature) => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
      value: true,
    })),
    isAccessibleForFree: park.priceType === 'Gratis',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: getCanonicalUrl('/') },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Skateparks West-Vlaanderen',
        item: getCanonicalUrl('/skateparks-west-vlaanderen'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: park.name,
        item: getCanonicalUrl(`/skateparks-west-vlaanderen/${park.slug}`),
      },
    ],
  };

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} path={`/skateparks-west-vlaanderen/${park.slug}`} image={park.heroImage} jsonLd={[locationJsonLd, breadcrumbJsonLd]} />

      <div className="bg-bg">
        <section className="relative overflow-hidden bg-black pt-28 text-white">
          <div className="absolute inset-0">
            <SkateparkImage
              park={park}
              alt={`${park.name} in ${park.city}`}
              className="h-full w-full object-cover opacity-45"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.40)_0%,rgba(0,0,0,0.78)_65%,rgba(0,0,0,0.92)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-20">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
              <Link to="/skateparks-west-vlaanderen" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <ArrowLeft size={14} />
                Alle spots
              </Link>
              <span>/</span>
              <span>{park.regionLabel}</span>
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-accent px-3 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {park.sessionType}
                  </span>
                  <span className="border border-white/15 bg-white/8 px-3 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {park.surface}
                  </span>
                  {park.isRainProof && (
                    <span className="border border-white/15 bg-white/8 px-3 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                      Regenproof
                    </span>
                  )}
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.92] text-white md:text-7xl xl:text-8xl">{park.name}</h1>
                <p className="mt-5 text-lg leading-relaxed text-white/76">{park.longDescription}</p>
              </div>

              <div className="space-y-4">
                <a
                  href={createMapsLink(park)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block brutal-border bg-white/8 p-5 backdrop-blur-sm transition-colors hover:text-accent"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Locatie</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-2xl font-black uppercase">
                    {park.city}
                    <ArrowUpRight size={16} />
                  </p>
                  <p className="mt-2 text-white/72">{park.address}</p>
                </a>
                <div className="brutal-border bg-white/8 p-5 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Coördinaten</p>
                  <a
                    href={createMapsLink(park)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-xl font-black uppercase transition-colors hover:text-accent"
                  >
                    {formatCoordinatePair(park)}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-10">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <InfoTile icon={<MapPin size={18} className="text-accent" />} label="Adres" value={park.address} />
                <InfoTile icon={<Navigation size={18} className="text-accent" />} label="Skill level" value={park.skillLevel} />
                <InfoTile
                  icon={park.sessionType === 'indoor' ? <Warehouse size={18} className="text-accent" /> : <CloudRain size={18} className="text-accent" />}
                  label={park.sessionType === 'indoor' ? 'Parktype' : 'Weer'}
                  value={park.sessionType === 'indoor' ? 'Indoor sessies' : park.isRainProof ? 'Regenproof / deels overdekt' : 'Outdoor spot'}
                />
                <InfoTile icon={<Ticket size={18} className="text-accent" />} label="Toegang" value={park.priceType} />
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="brutal-border bg-surface p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Spot details</p>
                  <h2 className="mt-3 text-4xl font-black uppercase">Wat je hier vindt</h2>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {park.features.map((feature) => (
                      <span key={feature} className="border border-fg/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-fg/70">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-fg/72">{park.shortDescription}</p>
                  {park.statusNote && (
                    <div className="mt-6 border-l-4 border-accent pl-4 text-sm leading-relaxed text-fg/68">{park.statusNote}</div>
                  )}
                  {park.openingHoursNote && (
                    <div className="mt-4 border-l-4 border-fg/15 pl-4 text-sm leading-relaxed text-fg/68">{park.openingHoursNote}</div>
                  )}
                </div>

                <div className="brutal-border bg-white p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Praktisch</p>
                  <h2 className="mt-3 text-4xl font-black uppercase">Snelle acties</h2>
                  <div className="mt-6 space-y-4">
                    <a
                      href={createMapsLink(park)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border border-fg/10 bg-surface px-5 py-4 font-display text-[10px] font-black uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      Open route in Google Maps
                      <ArrowUpRight size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={copyCoordinates}
                      className="flex w-full items-center justify-between border border-fg/10 bg-surface px-5 py-4 text-left font-display text-[10px] font-black uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      {copyState === 'copied' ? 'Coördinaten gekopieerd' : 'Kopieer coördinaten'}
                      <Copy size={16} />
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(park.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border border-fg/10 bg-surface px-5 py-4 font-display text-[10px] font-black uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      Zoek dit adres op de kaart
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {park.gallery.slice(0, 3).map((image, index) => (
                  <motion.div
                    key={`${park.id}-gallery-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="overflow-hidden brutal-border bg-surface"
                  >
                    <SkateparkImage
                      park={{ ...park, heroImage: image }}
                      alt={`${park.name} galerij beeld ${index + 1}`}
                      fallbackIndex={index}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <div>
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Nabijgelegen spots</p>
                  <h2 className="mt-3 text-4xl font-black uppercase">Meer spots in de buurt</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {nearbyParks.map((nearbyPark, index) => (
                    <SkateparkCard key={nearbyPark.id} park={nearbyPark} index={index} variant="compact" />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
              <SkateparkMap parks={[park]} selectedPark={park} heightClassName="h-[380px]" />

              <div className="brutal-border bg-fg p-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Regio</p>
                <h3 className="mt-3 text-3xl font-black uppercase">{park.regionLabel}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/72">
                  Deze spot maakt deel uit van onze volledige kaart met alle skateparks in West-Vlaanderen. Gebruik de directory om spots te vergelijken en je route slim op te bouwen.
                </p>
                <Link
                  to="/skateparks-west-vlaanderen"
                  className="mt-6 inline-flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-[0.22em] text-white transition-colors hover:text-accent"
                >
                  Naar volledige skate map
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="brutal-border bg-white p-5">
      <div className="flex items-center gap-3">{icon}<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg/45">{label}</span></div>
      <p className="mt-4 text-lg font-bold leading-snug text-fg">{value}</p>
    </div>
  );
}
