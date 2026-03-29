import fs from 'node:fs';
import path from 'node:path';
import { products } from '../src/data/products';
import { skateparks } from '../src/data/skateparks';
import { getSiteUrl } from '../src/lib/skateparks';

type UrlEntry = {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
};

function toCategorySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toSubcategorySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toAbsoluteUrl(siteUrl: string, routePath: string) {
  return `${siteUrl}${routePath.startsWith('/') ? routePath : `/${routePath}`}`;
}

function buildSitemapXml(entries: UrlEntry[], siteUrl: string) {
  const lastmod = new Date().toISOString().slice(0, 10);

  const xmlEntries = entries
    .map((entry) => {
      const loc = xmlEscape(toAbsoluteUrl(siteUrl, entry.path));
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', xmlEntries, '</urlset>', ''].join('\n');
}

function buildRobotsTxt(siteUrl: string) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Host: ${siteUrl.replace(/^https?:\/\//, '')}`,
    '',
  ].join('\n');
}

function getSeoEntries(): UrlEntry[] {
  const staticEntries: UrlEntry[] = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/skateparks-west-vlaanderen', changefreq: 'weekly', priority: '0.95' },
  ];

  const categoryPaths = new Set<string>();
  const subcategoryPaths = new Set<string>();

  for (const product of products) {
    if (!product.category) {
      continue;
    }

    const categorySlug = toCategorySlug(product.category);
    if (!categorySlug || categorySlug === 'uncategorized') {
      continue;
    }

    categoryPaths.add(`/category/${categorySlug}`);

    if (product.subcategory && product.subcategory !== 'Uncategorized') {
      const subcategorySlug = toSubcategorySlug(product.subcategory);
      if (subcategorySlug) {
        subcategoryPaths.add(`/category/${categorySlug}/${subcategorySlug}`);
      }
    }
  }

  const categoryEntries: UrlEntry[] = [...categoryPaths]
    .sort((a, b) => a.localeCompare(b, 'nl'))
    .map((routePath) => ({ path: routePath, changefreq: 'weekly', priority: '0.9' }));

  const subcategoryEntries: UrlEntry[] = [...subcategoryPaths]
    .sort((a, b) => a.localeCompare(b, 'nl'))
    .map((routePath) => ({ path: routePath, changefreq: 'weekly', priority: '0.8' }));

  const skateparkEntries: UrlEntry[] = skateparks
    .map((park) => ({
      path: `/skateparks-west-vlaanderen/${park.slug}`,
      changefreq: 'monthly' as const,
      priority: '0.75',
    }))
    .sort((a, b) => a.path.localeCompare(b.path, 'nl'));

  return [...staticEntries, ...categoryEntries, ...subcategoryEntries, ...skateparkEntries];
}

function main() {
  const siteUrl = getSiteUrl();
  const entries = getSeoEntries();
  const sitemapXml = buildSitemapXml(entries, siteUrl);
  const robotsTxt = buildRobotsTxt(siteUrl);

  const publicDir = path.resolve(process.cwd(), 'public');
  fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`Generated sitemap.xml with ${entries.length} URLs`);
  console.log('Generated robots.txt');
}

main();
