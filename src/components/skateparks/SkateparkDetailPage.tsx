import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  ArrowLeft,
  ArrowUpRight,
  Copy,
  MapPin,
  Navigation,
  Star,
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

const SESSION_SCORE_BY_PARK_ID: Record<string, number> = {
  'entrepot-brugge': 5,
  'daverlo-brugge': 3,
  'beastwood-brugge': 2,
  blankenberge: 5,
  'rotonde-wenduine': 4,
  'groene-meersen-zedelgem': 3,
  'bosserij-veldegem': 2,
  jabbeke: 3,
  'de-valkaart-oostkamp': 3,
  'ridefort-ruddervoorde': 3,
  'hertsberge-oostkamp': 2,
  'den-akker-beernem': 4,
  'trax-roeselare': 5,
  'kerelsplein-roeselare': 2,
  'izzepark-izegem': 4,
  ingelmunster: 3,
  waregem: 4,
  'watewy-tielt': 3,
  lichtervelde: 2,
  'rampaffairz-wevelgem': 5,
  'luxaplast-marke': 5,
  'koning-albertpark-kortrijk': 5,
  'jansan-kuurne': 4,
  'de-kazerne-anzegem': 4,
  'de-veiling-oostende': 5,
  'velodroom-oostende': 4,
  koksijde: 4,
  nieuwpoort: 4,
  'de-pluimen-diksmuide': 3,
  ieper: 4,
  poperinge: 3,
};

const SESSION_SCORE_LABEL_BY_VALUE: Record<number, string> = {
  1: 'Basic spot',
  2: 'Lokale sessie',
  3: 'Gemiddeld',
  4: 'Sterke spot',
  5: 'Top spot',
};

export default function SkateparkDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const park = slug ? skateparksBySlug.get(slug) : undefined;
  const [copyState, setCopyState] = React.useState<'idle' | 'copied'>('idle');
  const [detailBackdropIndex, setDetailBackdropIndex] = React.useState(0);
  const [activeGalleryImage, setActiveGalleryImage] = React.useState<{ src: string; alt: string } | null>(null);

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

  const detailBackdropImages = React.useMemo(() => {
    const unique = Array.from(new Set([park.heroImage, ...park.gallery].filter(Boolean)));
    return unique.slice(0, 3);
  }, [park.heroImage, park.gallery]);

  React.useEffect(() => {
    setDetailBackdropIndex(0);
  }, [park.id]);

  React.useEffect(() => {
    if (detailBackdropImages.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setDetailBackdropIndex((prev) => (prev + 1) % detailBackdropImages.length);
    }, 9000);

    return () => window.clearInterval(timer);
  }, [detailBackdropImages]);

  React.useEffect(() => {
    if (!activeGalleryImage) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveGalleryImage(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeGalleryImage]);

  const nearbyParks = getNearbySkateparks(park, 3);
  const spotlightFeatures = park.features.slice(0, 2);
  const sessionScore = SESSION_SCORE_BY_PARK_ID[park.id] ?? 3;
  const sessionScoreLabel = SESSION_SCORE_LABEL_BY_VALUE[sessionScore] ?? 'Gemiddeld';
  const profileIntroBase = park.shortDescription.endsWith('.') ? park.shortDescription : `${park.shortDescription}.`;
  const profileIntro = profileIntroBase.length > 82 ? `${profileIntroBase.slice(0, 79)}...` : profileIntroBase;
  const accessValue = park.accessInfo ?? park.priceType;
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
      <Seo title={seoTitle} description={seoDescription} path={`/skateparks-west-vlaanderen/${park.slug}`} image="/OG_image.png" jsonLd={[locationJsonLd, breadcrumbJsonLd]} />

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
                <InfoTile icon={<Ticket size={18} className="text-accent" />} label="Toegang" value={accessValue} />
              </div>

              <div className="relative min-h-[460px] overflow-hidden brutal-border md:min-h-[560px] xl:min-h-[640px]">
                <div className="absolute inset-0">
                  <motion.div
                    className="absolute inset-0 z-0 flex"
                    animate={{ x: `-${detailBackdropIndex * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                  >
                    {detailBackdropImages.map((image, index) => (
                      <div key={`${park.id}-detail-bg-${index}`} className="relative min-w-full h-full overflow-hidden">
                        <SkateparkImage
                          park={{ ...park, heroImage: image }}
                          alt={`${park.name} achtergrond ${index + 1}`}
                          fallbackIndex={index}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </motion.div>
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(8,10,14,0.12)_0%,rgba(8,10,14,0.26)_48%,rgba(8,10,14,0.56)_100%)]" />
                </div>

                <div className="absolute inset-x-3 bottom-3 z-20 md:inset-x-6 md:bottom-6">
                  <div className="h-[30%] max-h-[33%] min-h-[130px] w-full overflow-hidden rounded-2xl border border-white/22 bg-[linear-gradient(115deg,rgba(8,10,14,0.9)_0%,rgba(18,22,30,0.82)_55%,rgba(13,17,24,0.9)_100%)] px-3 py-3 shadow-[0_20px_54px_rgba(0,0,0,0.38)] backdrop-blur-md md:min-h-[150px] md:px-5 md:py-4">
                    <div className="grid h-full gap-3 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-5">
                      <div>
                        <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                          <MapPin size={11} />
                          Spot profiel
                        </p>

                        <h2 className="mt-2 text-2xl font-black uppercase leading-[0.92] text-white md:text-4xl">
                          {park.city}: jouw volgende sessie?
                        </h2>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {spotlightFeatures.map((feature) => (
                            <span key={feature} className="rounded-md border border-white/16 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-fg/80">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm leading-snug text-white/88 md:text-lg">
                          <strong className="text-white">{park.name}</strong>: {profileIntro}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1 text-amber-400">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={`${park.id}-score-star-${index}`}
                                  size={14}
                                  className={index < sessionScore ? 'fill-amber-400 text-amber-400' : 'text-white/28'}
                                />
                              ))}
                            </div>
                            <p className="mt-1 font-display text-[9px] font-bold uppercase tracking-[0.12em] text-white/58">
                              Sessie score: {sessionScore}/5 - {sessionScoreLabel}
                            </p>
                          </div>

                          <a
                            href={createMapsLink(park)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent px-4 py-2.5 font-display text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_12px_26px_rgba(196,43,43,0.34)] transition-all hover:translate-y-[-1px] hover:brightness-105"
                          >
                            Plan jouw sessie
                            <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {detailBackdropImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 z-30 flex gap-2">
                    {detailBackdropImages.map((_, index) => (
                      <button
                        key={`${park.id}-detail-dot-${index}`}
                        type="button"
                        aria-label={`Toon achtergrond ${index + 1}`}
                        onClick={() => setDetailBackdropIndex(index)}
                        className={`h-1.5 w-8 transition-colors ${index === detailBackdropIndex ? 'bg-accent' : 'bg-fg/25'}`}
                      />
                    ))}
                  </div>
                )}
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
                    <button
                      type="button"
                      onClick={() => setActiveGalleryImage({ src: image, alt: `${park.name} galerij beeld ${index + 1}` })}
                      className="group relative block w-full text-left"
                      aria-label={`Open ${park.name} galerij beeld ${index + 1} in groot formaat`}
                    >
                      <SkateparkImage
                        park={{ ...park, heroImage: image }}
                        alt={`${park.name} galerij beeld ${index + 1}`}
                        fallbackIndex={index}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/14" />
                    </button>
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
            </aside>
          </div>
        </section>

        {activeGalleryImage && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/86 p-4 backdrop-blur-md md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Vergrote skatepark foto"
            onClick={() => setActiveGalleryImage(null)}
          >
            <button
              type="button"
              onClick={() => setActiveGalleryImage(null)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/28 bg-black/48 text-white transition-colors hover:border-white/50 hover:bg-black/70 md:right-6 md:top-6"
              aria-label="Sluit foto"
            >
              <X size={18} />
            </button>

            <div
              className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl border border-white/18 bg-black/55 shadow-[0_34px_90px_rgba(0,0,0,0.62)]"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeGalleryImage.src}
                alt={activeGalleryImage.alt}
                className="h-full max-h-[84vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />

              <div className="flex justify-end border-t border-white/16 bg-black/44 px-3 py-3 md:px-4">
                <button
                  type="button"
                  onClick={() => setActiveGalleryImage(null)}
                  className="inline-flex items-center gap-2 rounded-md border border-white/24 bg-white/8 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-white/46 hover:bg-white/14"
                >
                  Sluiten
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="brutal-border bg-white p-5">
      <div className="flex items-center gap-3">{icon}<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg/45">{label}</span></div>
      <p className="mt-4 whitespace-pre-line text-lg font-bold leading-snug text-fg">{value}</p>
    </div>
  );
}
