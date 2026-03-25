import React from 'react';
import { motion } from 'motion/react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Instagram,
  MessageCircle,
  PlaySquare,
  Search,
  User
} from 'lucide-react';
import { instagramPosts } from '../data/instagramPosts';

const instagramProfile = 'https://www.instagram.com/dailygrindskateshop/';

export default function InstagramCarousel() {
  const posts = instagramPosts;
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!posts.length) {
    return null;
  }

  const activePost = posts[activeIndex];

  const goPrevious = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  const goNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [posts.length]);

  const stripPosts = React.useMemo(() => {
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((offset) => {
      const safeIndex = (activeIndex + offset + posts.length) % posts.length;
      return {
        post: posts[safeIndex],
        offset
      };
    });
  }, [activeIndex, posts]);
  const centerStripPost = stripPosts.find((item) => item.offset === 0)?.post ?? activePost;

  const dotCount = Math.min(posts.length, 8);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
        <div>
          <p className="text-accent font-display font-bold uppercase tracking-widest text-xs mb-3">Instagram</p>
          <h2 className="text-4xl md:text-6xl font-black leading-[0.95] text-fg">Inside The Feed</h2>
          <p className="mt-4 text-fg/70 max-w-xl">
            Real posts from the crew in an Instagram-style showcase. Sessions, shop life and new drops from
            <span className="font-bold text-fg"> @dailygrindskateshop</span>.
          </p>
        </div>

        <a
          href={instagramProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start md:self-auto text-[10px] md:text-xs font-display font-bold uppercase tracking-widest border-b-2 border-fg pb-1 hover:text-accent hover:border-accent transition-colors"
        >
          <Instagram size={14} />
          Follow on Instagram
        </a>
      </div>

      <div className="relative rounded-3xl p-4 md:p-8 bg-gradient-to-b from-surface to-bg brutal-border">
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(80% 55% at 50% 50%, rgba(196,43,43,0.12) 0%, rgba(196,43,43,0.04) 40%, rgba(255,255,255,0) 100%)'
          }}
        />

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-2 md:px-8">
          <motion.div
            className="grid grid-cols-5 items-center"
            key={activeIndex}
            initial={{ opacity: 0.55, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {stripPosts.map(({ post, offset }, index) => {
              const distance = Math.abs(offset);
              const isCenter = offset === 0;

              return (
                <button
                  key={post.id}
                  onClick={() => setActiveIndex((activeIndex + offset + posts.length) % posts.length)}
                  className={`group relative overflow-hidden brutal-border bg-black/30 transition-all mx-auto ${isCenter ? 'ring-2 ring-accent/70' : ''} ${distance === 2 ? 'w-[18vw] min-w-[100px] md:min-w-[150px]' : distance === 1 ? 'w-[24vw] min-w-[145px] md:min-w-[210px]' : 'w-[31vw] min-w-[190px] md:min-w-[285px]'}`}
                  style={{
                    height: distance === 2 ? '116px' : distance === 1 ? '136px' : '156px',
                    filter: distance === 2 ? 'blur(1.2px)' : distance === 1 ? 'blur(0.35px)' : 'none',
                    opacity: distance === 2 ? 0.35 : distance === 1 ? 0.72 : 1,
                    transform: isCenter ? 'scale(1)' : distance === 1 ? 'scale(0.95)' : 'scale(0.9)'
                  }}
                  aria-label={`Open Instagram post ${index + 1}`}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 ${isCenter ? 'bg-black/12' : 'bg-black/30'}`} />
                </button>
              );
            })}
          </motion.div>

          <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-surface via-surface/70 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-surface via-surface/70 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-20 w-[230px] md:w-[310px] mx-auto">
          <div className="relative rounded-[2.2rem] md:rounded-[2.8rem] bg-[#111] p-2 md:p-3 shadow-[0_30px_70px_rgba(0,0,0,0.35)] brutal-border">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 md:h-6 rounded-full bg-black z-30" />

            <div className="rounded-[1.8rem] md:rounded-[2.3rem] overflow-hidden bg-white pt-8 md:pt-10">
              <div className="px-4 py-2 border-b border-black/10 flex items-center justify-between text-black">
                <span className="font-display font-bold uppercase tracking-widest text-[10px]">Daily Grind</span>
                <div className="flex items-center gap-2 text-black/70">
                  <Heart size={14} />
                  <MessageCircle size={14} />
                </div>
              </div>

              <a
                href={centerStripPost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <motion.img
                  key={centerStripPost.id}
                  src={centerStripPost.imageUrl}
                  alt={centerStripPost.alt}
                  className="w-full aspect-[4/5] object-cover"
                  initial={{ opacity: 0.4, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                />
              </a>

              <div className="px-4 py-3 border-t border-black/10">
                <div className="flex items-center justify-between text-black mb-2">
                  <div className="flex items-center gap-3">
                    <Heart size={15} />
                    <MessageCircle size={15} />
                    <PlaySquare size={15} />
                  </div>
                  <Bookmark size={15} />
                </div>
                <p className="text-[10px] font-display font-bold uppercase tracking-widest text-black/80 line-clamp-2">
                  {centerStripPost.caption}
                </p>
              </div>

              <div className="px-4 py-2 border-t border-black/10 flex items-center justify-between text-black/65">
                <Home size={13} />
                <Search size={13} />
                <PlaySquare size={13} />
                <User size={13} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-30 mt-8 flex items-center justify-center gap-2">
          <button
            onClick={goPrevious}
            aria-label="Previous Instagram slide"
            className="h-10 w-10 brutal-border bg-white text-fg hover:bg-accent hover:text-white transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {posts.slice(0, dotCount).map((post, idx) => (
              <button
                key={post.id}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 transition-all ${idx === activeIndex % dotCount ? 'w-6 bg-accent' : 'w-2 bg-fg/30 hover:bg-fg/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === activeIndex % dotCount}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            aria-label="Next Instagram slide"
            className="h-10 w-10 brutal-border bg-fg text-bg hover:bg-accent transition-colors flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
