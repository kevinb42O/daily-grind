import React from 'react';
import { getCanonicalUrl } from '../lib/skateparks';

type SeoProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  robotsContent?: string;
};

const DEFAULT_IMAGE = '/OG_image.png';
const DEFAULT_IMAGE_WIDTH = '1536';
const DEFAULT_IMAGE_HEIGHT = '1024';

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  jsonLd,
  noIndex = false,
  robotsContent,
}: SeoProps) {
  React.useEffect(() => {
    const canonicalUrl = getCanonicalUrl(path);
    const absoluteImage = image.startsWith('http') ? image : getCanonicalUrl(image);
    const robots = robotsContent ?? (noIndex ? 'noindex, nofollow' : 'index, follow');

    document.documentElement.lang = 'nl';
    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage });
    upsertMeta('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: absoluteImage });
    upsertMeta('meta[property="og:image:type"]', { property: 'og:image:type', content: 'image/png' });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: DEFAULT_IMAGE_WIDTH });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: DEFAULT_IMAGE_HEIGHT });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    const existingScript = document.getElementById('seo-json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'seo-json-ld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById('seo-json-ld')?.remove();
    };
  }, [description, image, jsonLd, noIndex, path, robotsContent, title]);

  return null;
}
