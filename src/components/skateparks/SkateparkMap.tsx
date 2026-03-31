import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import type { Skatepark } from '../../data/skateparks';
import { createMapsLink } from '../../lib/skateparks';

type SkateparkMapProps = {
  parks: Skatepark[];
  selectedPark?: Skatepark | null;
  onSelectPark?: (park: Skatepark) => void;
  className?: string;
  heightClassName?: string;
};

function FitToParks({ parks }: { parks: Skatepark[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (!parks.length) {
      return;
    }

    const bounds = L.latLngBounds(parks.map((park) => [park.coordinates.lat, park.coordinates.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [72, 72], maxZoom: parks.length === 1 ? 12 : 9.75 });
  }, [map, parks]);

  return null;
}

function createMarkerIcon(active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="${active ? 'skatepark-marker skatepark-marker-active' : 'skatepark-marker'}"><span></span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export default function SkateparkMap({
  parks,
  selectedPark,
  onSelectPark,
  className,
  heightClassName = 'h-[520px]',
}: SkateparkMapProps) {
  const defaultCenter: [number, number] = [51.1, 3.05];

  return (
    <div className={`relative overflow-hidden brutal-border bg-[#06090b] ${heightClassName} ${className ?? ''}`}>
      <div className="pointer-events-none absolute inset-0 z-[350] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(2,4,6,0.04)_0%,rgba(2,4,6,0.24)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[360] opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute inset-x-0 top-0 z-[500] flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-b from-black/92 via-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-2 border border-white/12 bg-black/55 px-3 py-2 font-display font-bold uppercase tracking-[0.25em] text-[9px] text-white/86 backdrop-blur-sm">
          West Flanders Spot Map
        </div>
        <div className="pointer-events-auto hidden md:inline-flex items-center gap-2 border border-white/12 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/64 backdrop-blur-sm">
          {parks.length} pin{parks.length === 1 ? '' : 's'} actief
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] hidden md:flex items-center gap-2 border border-white/12 bg-black/55 px-3 py-2 text-[9px] font-display font-bold uppercase tracking-[0.24em] text-white/62 backdrop-blur-sm">
        Klik een pin voor detail
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={9}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        zoomControl={false}
        dragging={false}
        className="skatepark-map-canvas h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitToParks parks={parks} />

        {parks.map((park) => {
          const isActive = selectedPark?.id === park.id;
          return (
            <Marker
              key={park.id}
              position={[park.coordinates.lat, park.coordinates.lng]}
              icon={createMarkerIcon(isActive)}
              eventHandlers={{
                click: () => onSelectPark?.(park),
              }}
            >
              <Popup className="skatepark-popup">
                <div className="min-w-[220px] space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C42B2B]">{park.city}</p>
                    <h3 className="mt-1 text-base font-black uppercase text-white">{park.name}</h3>
                    <p className="mt-1 text-sm text-white/62">{park.address}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-white/72">{park.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
                    <span className="border border-white/10 bg-white/6 px-2 py-1 text-white/70">{park.sessionType}</span>
                    <span className="border border-white/10 bg-white/6 px-2 py-1 text-white/70">{park.surface}</span>
                    {park.isRainProof && <span className="border border-white/10 bg-white/6 px-2 py-1 text-white/70">Rainproof</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]">
                    <Link to={`/skateparks-west-vlaanderen/${park.slug}`} className="popup-link-detail">
                      Open detail
                    </Link>
                    <a href={createMapsLink(park)} target="_blank" rel="noopener noreferrer" className="popup-link-route">
                      Route
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
