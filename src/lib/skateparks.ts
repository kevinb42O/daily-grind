import { dailyGrindShopCoordinates, regionMap, skateparks, type Skatepark, type SkateparkRegionKey } from '../data/skateparks';

export type SkateparkSort =
  | 'featured'
  | 'name-asc'
  | 'city-asc'
  | 'indoor-first'
  | 'distance-shop'
  | 'distance-user';

export function getSiteUrl() {
  return 'https://daily-grind-gray.vercel.app';
}

export function getCanonicalUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function formatCoordinate(value: number, axis: 'lat' | 'lng') {
  const direction = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${Math.abs(value).toFixed(4)}° ${direction}`;
}

export function formatCoordinatePair(park: Pick<Skatepark, 'coordinates'>) {
  return `${formatCoordinate(park.coordinates.lat, 'lat')}, ${formatCoordinate(park.coordinates.lng, 'lng')}`;
}

export function createMapsLink(park: Pick<Skatepark, 'name' | 'address' | 'coordinates'>) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${park.coordinates.lat}, ${park.coordinates.lng}`)}`;
}

export function toKebabCase(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getRegionByKey(regionKey: SkateparkRegionKey) {
  return regionMap.get(regionKey);
}

export function getRegionStats(regionKey: SkateparkRegionKey) {
  const regionParks = skateparks.filter((park) => park.regionKey === regionKey);
  return {
    total: regionParks.length,
    indoor: regionParks.filter((park) => park.sessionType === 'indoor').length,
    rainProof: regionParks.filter((park) => park.isRainProof).length,
  };
}

export function getDistanceInKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthRadius = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function sortSkateparks(parks: Skatepark[], sort: SkateparkSort, userLocation?: { lat: number; lng: number } | null) {
  const result = [...parks];

  switch (sort) {
    case 'name-asc':
      return result.sort((a, b) => a.name.localeCompare(b.name, 'nl'));
    case 'city-asc':
      return result.sort((a, b) => a.city.localeCompare(b.city, 'nl') || a.name.localeCompare(b.name, 'nl'));
    case 'indoor-first':
      return result.sort((a, b) => Number(b.sessionType === 'indoor') - Number(a.sessionType === 'indoor') || a.name.localeCompare(b.name, 'nl'));
    case 'distance-shop':
      return result.sort(
        (a, b) =>
          getDistanceInKm(dailyGrindShopCoordinates, a.coordinates) -
          getDistanceInKm(dailyGrindShopCoordinates, b.coordinates),
      );
    case 'distance-user':
      if (!userLocation) {
        return sortSkateparks(result, 'distance-shop');
      }
      return result.sort((a, b) => getDistanceInKm(userLocation, a.coordinates) - getDistanceInKm(userLocation, b.coordinates));
    case 'featured':
    default:
      return result.sort((a, b) => {
        const scoreA = Number(a.isRainProof) + Number(a.sessionType === 'indoor') + a.features.length / 10;
        const scoreB = Number(b.isRainProof) + Number(b.sessionType === 'indoor') + b.features.length / 10;
        return scoreB - scoreA || a.name.localeCompare(b.name, 'nl');
      });
  }
}

export function filterSkateparks(
  parks: Skatepark[],
  options: {
    query: string;
    region: SkateparkRegionKey | 'all';
    sessionType: 'all' | 'outdoor' | 'indoor';
    rainProof: 'all' | 'yes';
    surface: 'all' | Skatepark['surface'];
    priceType: 'all' | Skatepark['priceType'];
    feature: 'all' | string;
  },
) {
  const normalizedQuery = options.query.trim().toLowerCase();

  return parks.filter((park) => {
    const matchesQuery =
      !normalizedQuery ||
      [park.name, park.city, park.address, park.regionLabel, ...park.features]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesRegion = options.region === 'all' || park.regionKey === options.region;
    const matchesSessionType = options.sessionType === 'all' || park.sessionType === options.sessionType;
    const matchesRainProof = options.rainProof === 'all' || park.isRainProof;
    const matchesSurface = options.surface === 'all' || park.surface === options.surface;
    const matchesPrice = options.priceType === 'all' || park.priceType === options.priceType;
    const matchesFeature = options.feature === 'all' || park.features.some((feature) => feature.toLowerCase() === options.feature.toLowerCase());

    return matchesQuery && matchesRegion && matchesSessionType && matchesRainProof && matchesSurface && matchesPrice && matchesFeature;
  });
}

export function getNearbySkateparks(currentPark: Skatepark, count = 3) {
  return skateparks
    .filter((park) => park.id !== currentPark.id)
    .map((park) => ({
      park,
      distance: getDistanceInKm(currentPark.coordinates, park.coordinates),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(({ park }) => park);
}

export function groupByRegion(parks: Skatepark[]) {
  return skateparks.reduce(
    (acc, park) => {
      if (!parks.some((item) => item.id === park.id)) {
        return acc;
      }

      acc[park.regionKey] = [...(acc[park.regionKey] ?? []), park];
      return acc;
    },
    {} as Record<SkateparkRegionKey, Skatepark[]>,
  );
}
