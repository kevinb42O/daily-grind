import React from 'react';
import { getRegionByKey } from '../../lib/skateparks';
import type { Skatepark } from '../../data/skateparks';

type SkateparkImageProps = {
  park: Skatepark;
  alt: string;
  className?: string;
  fallbackIndex?: number;
  loading?: 'eager' | 'lazy';
};

export default function SkateparkImage({
  park,
  alt,
  className,
  fallbackIndex = 0,
  loading = 'lazy',
}: SkateparkImageProps) {
  const region = getRegionByKey(park.regionKey);
  const fallbackImages = region?.fallbackImages ?? ['/images/site/promo-1.jpg'];
  const fallbackImage = fallbackImages[fallbackIndex % fallbackImages.length];
  const [src, setSrc] = React.useState(park.heroImage);

  React.useEffect(() => {
    setSrc(park.heroImage);
  }, [park.heroImage]);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setSrc(fallbackImage)}
    />
  );
}
