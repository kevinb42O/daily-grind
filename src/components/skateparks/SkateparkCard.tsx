import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowUpRight, CloudRain, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Skatepark } from '../../data/skateparks';
import SkateparkImage from './SkateparkImage';

type SkateparkCardProps = {
  park: Skatepark;
  index: number;
  onSelect?: (park: Skatepark) => void;
  active?: boolean;
  variant?: 'featured' | 'standard' | 'compact';
  featuredSize?: 'large' | 'small';
  compactSize?: 'hero' | 'wide' | 'standard' | 'full';
};

function SkateparkPills({
  park,
  inverted = false,
  size = 'standard',
}: {
  park: Skatepark;
  inverted?: boolean;
  size?: 'standard' | 'large';
}) {
  const baseClass = inverted
    ? 'border border-white/18 bg-black/28 text-white/86'
    : 'border border-fg/10 bg-fg/[0.03] text-fg/68';
  const sizeClass = size === 'large' ? 'px-3.5 py-1.5 text-[10px] tracking-[0.2em]' : 'px-3 py-1 text-[10px] tracking-[0.18em]';

  return (
    <div className="flex flex-wrap gap-2">
      {park.features.slice(0, 3).map((feature) => (
        <span
          key={feature}
          className={`font-display font-bold uppercase ${sizeClass} ${baseClass}`}
        >
          {feature}
        </span>
      ))}
    </div>
  );
}

function SkateparkStatus({
  park,
  inverted = false,
  size = 'standard',
}: {
  park: Skatepark;
  inverted?: boolean;
  size?: 'standard' | 'large';
}) {
  const textClass = inverted ? 'text-white/74' : 'text-fg/58';
  const sizeClass = size === 'large' ? 'gap-4 text-[11px] tracking-[0.2em]' : 'gap-3 text-[10px] tracking-[0.18em]';

  return (
    <div className={`flex flex-wrap items-center font-bold uppercase ${sizeClass} ${textClass}`}>
      <span>{park.city}</span>
      <span>{park.surface}</span>
      <span>{park.sessionType}</span>
      {park.isRainProof && (
        <span className="inline-flex items-center gap-2">
          <CloudRain size={13} className={inverted ? 'text-white' : 'text-accent'} />
          Regenproof
        </span>
      )}
    </div>
  );
}

const SkateparkCard: React.FC<SkateparkCardProps> = ({
  park,
  index,
  onSelect,
  active = false,
  variant = 'standard',
  featuredSize = 'large',
  compactSize = 'standard',
}) => {
  const shellClass =
    variant === 'featured'
      ? `group relative overflow-hidden border border-white/12 bg-[#090b0d] text-white shadow-[0_26px_80px_rgba(0,0,0,0.34)] transition-all duration-500 ${active ? 'ring-2 ring-accent' : ''}`
      : variant === 'compact'
        ? `group relative h-full overflow-hidden border border-white/8 bg-[#050608] text-white shadow-[0_22px_60px_rgba(0,0,0,0.32)] transition-all duration-500 ${active ? 'ring-2 ring-accent shadow-[0_24px_70px_rgba(196,43,43,0.18)]' : 'hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.42)]'}`
        : `group relative overflow-hidden brutal-border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-500 ${active ? 'ring-2 ring-accent shadow-[0_24px_60px_rgba(196,43,43,0.16)]' : 'hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]'}`;

  const motionHover =
    variant === 'featured' ? { y: -6, transition: { duration: 0.28 } } : { y: -4, transition: { duration: 0.28 } };

  if (variant === 'featured') {
    const isSmallFeatured = featuredSize === 'small';

    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={motionHover}
        transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.2) }}
        viewport={{ once: true, margin: '-60px' }}
        className={shellClass}
        onMouseEnter={() => onSelect?.(park)}
      >
        <Link to={`/skateparks-west-vlaanderen/${park.slug}`} className="block">
          <div
            className={`griptape-overlay relative overflow-hidden ${
              isSmallFeatured ? 'h-[320px] sm:h-[360px] md:h-[380px] lg:h-[400px]' : 'min-h-[430px] md:min-h-[520px]'
            }`}
          >
            <SkateparkImage
              park={park}
              alt={`${park.name} in ${park.city}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.28)_34%,rgba(0,0,0,0.82)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/16" />

            <div
              className={`absolute left-5 right-5 top-5 ${
                isSmallFeatured ? 'left-3 right-3 top-3 sm:left-5 sm:right-5 sm:top-5 md:left-6 md:right-6 md:top-6' : 'md:left-7 md:right-7 md:top-7'
              }`}
            >
              <div className="flex flex-wrap gap-2">
                <span className="bg-white px-2 py-1 font-display text-[8px] font-black uppercase tracking-[0.22em] text-fg sm:px-3 sm:text-[10px]">
                  {park.city}
                </span>
                <span className="border border-white/16 bg-black/26 px-2 py-1 font-display text-[8px] font-black uppercase tracking-[0.22em] text-white sm:px-3 sm:text-[10px]">
                  {park.sessionType}
                </span>
              </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 ${isSmallFeatured ? 'p-3 sm:p-5 md:p-6' : 'p-5 md:p-7'}`}>
              <SkateparkStatus park={park} inverted />
              <h3
                className={`mt-4 font-black leading-[0.9] text-white ${
                  isSmallFeatured ? 'max-w-2xl text-lg line-clamp-2 sm:text-3xl md:text-4xl xl:text-5xl' : 'max-w-3xl text-4xl md:text-5xl xl:text-6xl'
                }`}
              >
                {park.name}
              </h3>
              <p className={`mt-3 max-w-2xl leading-relaxed text-white/76 ${isSmallFeatured ? 'line-clamp-3 text-[11px] sm:text-sm md:text-base' : 'text-base md:text-lg'}`}>
                {park.shortDescription}
              </p>

              <div className={`flex flex-col gap-3 border-t border-white/12 pt-3 sm:gap-5 sm:pt-5 md:flex-row md:items-end md:justify-between ${isSmallFeatured ? 'mt-4 sm:mt-5' : 'mt-7'}`}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-white/72">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                    <p className={`${isSmallFeatured ? 'line-clamp-2 text-[11px] sm:text-[15px]' : 'text-sm'} leading-relaxed`}>{park.address}</p>
                  </div>
                  <SkateparkPills park={park} inverted />
                </div>

                <span className="inline-flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-[0.24em] text-white transition-colors group-hover:text-accent">
                  Open spot
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'compact') {
    const isHeroCompact = compactSize === 'hero';
    const isWideCompact = compactSize === 'wide';
    const isFullCompact = compactSize === 'full';
    const imageClass =
      isFullCompact
        ? 'aspect-[16/9] xl:h-full xl:min-h-[320px] xl:aspect-auto'
        : isHeroCompact
        ? 'aspect-[16/10] lg:aspect-[16/9]'
        : isWideCompact
          ? 'aspect-[16/10]'
          : 'aspect-[4/3]';
    const badgeClass = isFullCompact
      ? 'px-4 py-1.5 text-[10px] tracking-[0.24em]'
      : isHeroCompact
      ? 'px-4 py-1.5 text-[10px] sm:text-[11px] tracking-[0.24em]'
      : isWideCompact
        ? 'px-3.5 py-1.5 text-[10px] tracking-[0.23em]'
        : 'px-3 py-1 text-[9px] tracking-[0.22em]';
    const titleClass = isFullCompact
      ? 'text-2xl sm:text-3xl xl:text-[40px]'
      : isHeroCompact
      ? 'text-2xl sm:text-3xl lg:text-4xl'
      : isWideCompact
        ? 'text-xl sm:text-2xl lg:text-[28px]'
        : 'text-lg sm:text-2xl';
    const descriptionClass = isFullCompact
      ? 'line-clamp-4 text-sm leading-7 sm:text-base xl:text-[17px]'
      : isHeroCompact
      ? 'line-clamp-4 text-sm leading-7 sm:text-base lg:text-[17px]'
      : isWideCompact
        ? 'line-clamp-3 text-sm leading-6 sm:text-[15px]'
        : 'line-clamp-3 text-xs leading-relaxed sm:text-sm';
    const bodyPaddingClass = isFullCompact
      ? 'px-4 py-4 sm:px-5 sm:py-5 xl:px-7 xl:py-6'
      : isHeroCompact
      ? 'px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7'
      : isWideCompact
        ? 'px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6'
        : 'px-4 py-3 sm:px-5 sm:py-5';
    const addressClass = isFullCompact
      ? 'text-sm sm:text-base text-white/72'
      : isHeroCompact
        ? 'text-sm sm:text-base text-white/72'
        : isWideCompact
          ? 'text-sm text-white/70'
          : 'text-xs sm:text-sm text-white/68';
    const metaSize = isFullCompact || isHeroCompact ? 'large' : 'standard';
    const ctaClass = isFullCompact || isHeroCompact ? 'text-[11px] tracking-[0.24em]' : 'text-[10px] tracking-[0.22em]';
    const linkClass = isFullCompact ? 'flex h-full flex-col xl:grid xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.95fr)]' : 'flex h-full flex-col';
    const imageShellClass = isFullCompact ? 'bg-[#090b0d] p-2 sm:p-3 xl:p-4' : 'bg-[#090b0d] p-2 sm:p-3';
    const bodyClass = isFullCompact
      ? `flex flex-col gap-3 bg-[#090b0d] text-white sm:gap-4 xl:justify-center ${bodyPaddingClass}`
      : `flex flex-col gap-3 bg-[#090b0d] text-white sm:gap-4 ${bodyPaddingClass}`;

    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={motionHover}
        transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.2) }}
        viewport={{ once: true, margin: '-60px' }}
        className={shellClass}
        onMouseEnter={() => onSelect?.(park)}
      >
        <Link to={`/skateparks-west-vlaanderen/${park.slug}`} className={linkClass}>
          <div className={imageShellClass}>
            <div className={`relative overflow-hidden border border-white/8 bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ${imageClass}`}>
              <SkateparkImage
                park={park}
                alt={`${park.name} in ${park.city}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          <div className={bodyClass}>
            <div className="flex flex-wrap gap-2">
              <span className={`bg-accent font-display font-bold uppercase text-white shadow-[0_10px_24px_rgba(196,43,43,0.28)] ${badgeClass}`}>
                {park.city}
              </span>
              <span className={`border border-accent/35 bg-accent/10 font-display font-bold uppercase text-white/90 ${badgeClass}`}>
                {park.sessionType}
              </span>
            </div>
            <h3 className={`font-black leading-[0.92] text-white ${titleClass}`}>{park.name}</h3>
            <SkateparkStatus park={park} inverted size={metaSize} />
            <p className={`leading-relaxed text-white/78 ${descriptionClass}`}>{park.shortDescription}</p>
            <div className="space-y-3 border-t border-white/12 pt-3 sm:pt-4">
              <p className={`leading-relaxed ${addressClass}`}>{park.address}</p>
              <SkateparkPills park={park} inverted size={metaSize} />
            </div>
            <div className="flex items-center justify-between border-t border-white/12 pt-3 sm:pt-4">
              <div className={`flex items-center gap-2 font-bold uppercase text-white/58 ${isHeroCompact ? 'text-[11px] tracking-[0.22em]' : 'text-[10px] tracking-[0.2em]'}`}>
                {park.sessionType === 'indoor' ? <Warehouse size={13} className="text-accent" /> : null}
                <span>{park.priceType}</span>
              </div>
              <span className={`inline-flex items-center gap-2 font-display font-black uppercase text-accent transition-colors group-hover:text-white ${ctaClass}`}>
                Open spot
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={motionHover}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.2) }}
      viewport={{ once: true, margin: '-60px' }}
      className={shellClass}
      onMouseEnter={() => onSelect?.(park)}
    >
      <Link to={`/skateparks-west-vlaanderen/${park.slug}`} className="block">
        <div className="griptape-overlay relative aspect-[10/12] overflow-hidden bg-fg">
          <SkateparkImage
            park={park}
            alt={`${park.name} in ${park.city}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.16)_38%,rgba(0,0,0,0.76)_100%)]" />
          <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-white px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.22em] text-fg">
                {park.city}
              </span>
              <span className="border border-white/20 bg-black/30 px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.22em] text-white">
                {park.sessionType}
              </span>
            </div>
            <span className="font-display text-4xl font-black leading-none text-white/18">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <SkateparkStatus park={park} inverted />
            <h3 className="mt-4 max-w-[92%] text-3xl font-black leading-[0.92] text-white md:text-4xl">{park.name}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/76 md:text-base">{park.shortDescription}</p>
          </div>
        </div>

        <div className="space-y-5 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fb_100%)] p-6">
          <div className="flex items-start gap-3 text-fg/72">
            <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg/46">Adres</p>
              <p className="mt-1 text-sm leading-relaxed">{park.address}</p>
            </div>
          </div>

          <SkateparkPills park={park} />

          <div className="flex items-center justify-between gap-4 border-t border-fg/10 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/52">
              {park.sessionType === 'indoor' ? <Warehouse size={13} className="text-accent" /> : null}
              <span>{park.priceType}</span>
            </div>

            <span className="inline-flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-[0.22em] text-fg transition-colors group-hover:text-accent">
              Open spot
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default SkateparkCard;
