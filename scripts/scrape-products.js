import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://daily-grind-skateshop.webshopapp.com';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const IMAGE_DIR = path.join(__dirname, '../public/images/products');
const DATA_FILE = path.join(__dirname, '../src/data/products.ts');

// Ensure image directory exists
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function scrape() {
  console.log('Fetching sitemap...');
  const { data: sitemapXml } = await axios.get(SITEMAP_URL);
  const $sitemap = cheerio.load(sitemapXml, { xmlMode: true });
  
  const urls = $sitemap('loc').map((i, el) => $sitemap(el).text()).get();
  
  // Filter for potential product URLs (usually end in .html and aren't service/brand pages)
  const productUrls = urls.filter(url => 
    url.endsWith('.html') && 
    !url.includes('/service/') && 
    !url.includes('/brands/') &&
    !url.includes('/tags/') &&
    !url.includes('/catalog/') &&
    !url.includes('/collection/')
  );

  console.log(`Found ${productUrls.length} potential product URLs.`);

  const products = [];
  let idCounter = 1;

  for (const [index, url] of productUrls.entries()) {
    try {
      console.log(`Scraping ${url}...`);
      const { data: html } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const $ = cheerio.load(html);

      if (index === 0) {
        console.log(`HTML for ${url} (first 1000 chars):`);
        console.log(html.substring(0, 1000));
      }

      // Check availability using schema.org metadata
      const availability = $('meta[itemprop="availability"]').attr('content') || '';
      const isOutOfStock = availability.includes('OutOfStock') || 
                          $('.pro-header__stock').text().toLowerCase().includes('niet op voorraad') || 
                          $('body').text().toLowerCase().includes('uitverkocht');
      
      if (isOutOfStock) {
        console.log(`Skipping ${url} (out of stock: "${availability}")`);
        continue;
      }

      const name = $('meta[itemprop="name"]').attr('content') || $('h1.pro-header__title').text().trim();
      const priceVal = $('meta[itemprop="price"]').attr('content') || $('.pro-header__price').first().text().trim();
      const priceCurrency = $('meta[itemprop="priceCurrency"]').attr('content') || 'EUR';
      const price = priceVal ? `${priceCurrency === 'EUR' ? '€' : priceCurrency}${priceVal.replace('.', ',')}` : '';
      
      // Determine category and subcategory from URL structure or breadcrumbs
      let category = 'Uncategorized';
      let subcategory = '';
      
      const breadcrumbs = $('.breadcrumb__link').map((i, el) => $(el).text().trim()).get();
      if (breadcrumbs.length >= 3) {
        category = breadcrumbs[1];
        subcategory = breadcrumbs[2];
      } else if (breadcrumbs.length === 2) {
        category = breadcrumbs[1];
      }

      const description = $('meta[property="og:description"]').attr('content') || $('.pro-header__description').text().trim() || $('.pro-content').text().trim() || '';
      
      // Get the highest resolution image if possible
      let imageUrl = $('meta[itemprop="image"]').attr('content') || $('meta[property="og:image"]').attr('content');
      
      // Try to get the large image from the gallery
      const galleryImage = $('.img-mag__asset').first().attr('src');
      if (galleryImage) {
        imageUrl = galleryImage;
      }

      if (!name || !price || !imageUrl) {
        console.log(`Skipping ${url} (missing data - Name: ${!!name}, Price: ${!!price}, Image: ${!!imageUrl})`);
        continue;
      }

      // Download image
      const imageSlug = url.split('/').pop().replace('.html', '');
      const imageExt = path.extname(imageUrl.split('?')[0]) || '.jpg';
      const imageName = `${imageSlug}${imageExt}`;
      const imagePath = path.join(IMAGE_DIR, imageName);

      if (!fs.existsSync(imagePath)) {
        console.log(`Downloading image for ${name}...`);
        try {
          const { data: imageStream } = await axios.get(imageUrl, { responseType: 'stream' });
          imageStream.pipe(fs.createWriteStream(imagePath));
          // Simple delay to prevent blocking
          await new Promise(resolve => imageStream.on('end', resolve));
        } catch (imgErr) {
          console.error(`Failed to download image for ${name}: ${imgErr.message}`);
        }
      }

      products.push({
        id: idCounter++,
        name,
        price,
        category,
        subcategory,
        description,
        image: `/images/products/${imageName}`
      });

      // Avoid getting rate limited
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
    }
  }

  // Write to src/data/products.ts
  const fileContent = `export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, fileContent);
  console.log(`Successfully scraped ${products.length} products and updated ${DATA_FILE}`);
}

scrape().catch(console.error);
