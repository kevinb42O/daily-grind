import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../Seo';
import { skateparkRegions, skateparks, type Skatepark, type SkateparkRegionKey } from '../../data/skateparks';
import { getCanonicalUrl } from '../../lib/skateparks';
import SkateparkCard from './SkateparkCard';
import SkateparkMap from './SkateparkMap';

function getBentoLayout(index: number) {
  void index;
  return {
    wrapperClass: 'h-full sm:col-span-2 xl:col-span-3',
    compactSize: 'wide' as const,
  };
}

function compareSkateparks(a: Skatepark, b: Skatepark) {
  const pinnedOrder = ['koning-albertpark-kortrijk', 'blankenberge', 'rotonde-wenduine'];
  const pinnedIndexA = pinnedOrder.indexOf(a.id);
  const pinnedIndexB = pinnedOrder.indexOf(b.id);

  if (pinnedIndexA !== -1 || pinnedIndexB !== -1) {
    if (pinnedIndexA === -1) {
      return 1;
    }

    if (pinnedIndexB === -1) {
      return -1;
    }

    return pinnedIndexA - pinnedIndexB;
  }

  if (a.id === 'de-kazerne-anzegem') {
    return 1;
  }

  if (b.id === 'de-kazerne-anzegem') {
    return -1;
  }

  return a.city.localeCompare(b.city, 'nl') || a.name.localeCompare(b.name, 'nl');
}

export default function SkateparkDirectoryPage() {
  const [selectedRegion, setSelectedRegion] = React.useState<SkateparkRegionKey | 'all'>('all');
  const [selectedPark, setSelectedPark] = React.useState<Skatepark | null>(null);

  const regionOptions = React.useMemo(() => {
    const counts = skateparks.reduce<Record<SkateparkRegionKey, number>>((acc, park) => {
      acc[park.regionKey] = (acc[park.regionKey] ?? 0) + 1;
      return acc;
    }, {} as Record<SkateparkRegionKey, number>);
    const regionLabels: Record<SkateparkRegionKey, string> = {
      'brugge-noordwest': 'Regio Brugge',
      'midden-west-vlaanderen': 'Regio Roeselare',
      'zuid-west-vlaanderen': 'Regio Kortrijk',
      'kust-westhoek': 'Kust & Westhoek',
    };

    return skateparkRegions.map((region) => ({
      key: region.key,
      label: regionLabels[region.key],
      count: counts[region.key] ?? 0,
    }));
  }, []);

  const filteredParks = React.useMemo(() => {
    const result =
      selectedRegion === 'all'
        ? skateparks
        : skateparks.filter((park) => park.regionKey === selectedRegion);

    return [...result].sort(compareSkateparks);
  }, [selectedRegion]);

  React.useEffect(() => {
    if (!filteredParks.length) {
      setSelectedPark(null);
      return;
    }

    if (!selectedPark || !filteredParks.some((park) => park.id === selectedPark.id)) {
      setSelectedPark(filteredParks[0]);
    }
  }, [filteredParks, selectedPark]);

  const listJsonLd = React.useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Alle skateparks in West-Vlaanderen',
      description: 'Complete gids met skateparks in West-Vlaanderen, inclusief kaart, adressen, coördinaten en detailinfo per spot.',
      url: getCanonicalUrl('/skateparks-west-vlaanderen'),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: skateparks.length,
        itemListElement: skateparks.map((park, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: getCanonicalUrl(`/skateparks-west-vlaanderen/${park.slug}`),
          name: park.name,
        })),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: getCanonicalUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Skateparks West-Vlaanderen',
            item: getCanonicalUrl('/skateparks-west-vlaanderen'),
          },
        ],
      },
    }),
    [],
  );

  return (
    <>
      <Seo
        title="Alle Skateparks in West-Vlaanderen | Daily Grind Blankenberge"
        description="Ontdek alle skateparks in West-Vlaanderen op één kaart. Met adressen, coördinaten en een detailpagina per spot."
        path="/skateparks-west-vlaanderen"
        image="/OG_image.png"
        jsonLd={listJsonLd}
      />

      <div className="bg-bg">
        <section className="relative overflow-hidden bg-black pt-32 text-white">
          <div className="absolute inset-0">
            <img
              src="/images/site/skateparkguide.jpg"
              alt="Skateparks West-Vlaanderen"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.32)_100%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-24">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/72 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} />
              Terug naar Home
            </Link>

            <div className="max-w-4xl">
              <p className="mb-4 inline-flex border border-white/14 bg-black/55 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.26em] text-white shadow-[0_16px_36px_rgba(0,0,0,0.22)] backdrop-blur-md">
                Skateparks West-Vlaanderen
              </p>
              <h1 className="text-5xl font-black leading-[0.92] text-white md:text-7xl xl:text-8xl">
                Vind jouw volgende skate spot in West-Vlaanderen.
              </h1>
              <p className="mt-6 max-w-3xl text-sm font-medium leading-relaxed text-white/82 md:text-base">
                Van bowls en street plazas tot compacte locals: verken alle skateparks per gemeente met kaart, beelden en praktische info per locatie.
              </p>
            </div>

            <div className="mt-14 flex w-full justify-center md:mt-18">
              <div className="flex max-w-6xl flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRegion('all')}
                  className={`inline-flex items-center gap-2.5 border px-3 py-2 transition-all duration-300 ${
                    selectedRegion === 'all'
                      ? 'border-accent bg-white text-fg shadow-[0_18px_36px_rgba(196,43,43,0.16)]'
                      : 'border-white/24 bg-black/46 text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm hover:border-white/40 hover:bg-black/58'
                  }`}
                  aria-pressed={selectedRegion === 'all'}
                >
                  <span className={`font-display text-[9px] font-bold uppercase tracking-[0.22em] ${selectedRegion === 'all' ? 'text-fg/58' : 'text-white/88'}`}>
                    Alle spots
                  </span>
                  <span className={`inline-flex h-7 min-w-7 items-center justify-center px-2 text-[10px] font-bold ${selectedRegion === 'all' ? 'bg-accent text-white' : 'bg-white/12 text-white/82'}`}>
                    {skateparks.length}
                  </span>
                </button>

                {regionOptions.map((region) => {
                  const active = selectedRegion === region.key;

                  return (
                    <button
                      key={region.key}
                      type="button"
                      onClick={() => setSelectedRegion(region.key)}
                      className={`inline-flex items-center gap-2.5 border px-3 py-2 transition-all duration-300 ${
                        active
                          ? 'border-accent bg-white text-fg shadow-[0_18px_36px_rgba(196,43,43,0.16)]'
                          : 'border-white/24 bg-black/46 text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm hover:border-white/40 hover:bg-black/58'
                      }`}
                      aria-pressed={active}
                    >
                      <span className={`font-display text-[9px] font-bold uppercase tracking-[0.22em] ${active ? 'text-fg/58' : 'text-white/88'}`}>
                        {region.label}
                      </span>
                      <span className={`inline-flex h-7 min-w-7 items-center justify-center px-2 text-[10px] font-bold ${active ? 'bg-accent text-white' : 'bg-white/12 text-white/82'}`}>
                        {region.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 md:py-10">
          <div className="space-y-8">
            <SkateparkMap parks={filteredParks} selectedPark={selectedPark} onSelectPark={setSelectedPark} />

            {!filteredParks.length ? (
              <div className="brutal-border bg-surface px-8 py-16 text-center">
                <h2 className="text-3xl font-black uppercase">Geen spots gevonden.</h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-6">
                {filteredParks.map((park, index) => {
                  const layout = getBentoLayout(index);

                  return (
                    <div key={park.id} className={layout.wrapperClass}>
                      <SkateparkCard
                        park={park}
                        index={index}
                        onSelect={setSelectedPark}
                        active={selectedPark?.id === park.id}
                        variant="compact"
                        compactSize={layout.compactSize}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
