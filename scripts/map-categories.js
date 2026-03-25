import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const SITE_URL = 'https://daily-grind-skateshop.webshopapp.com';
const productMap = {}; // slug -> { category, subcategory }

async function getNavLinks() {
  console.log('Fetching homepage for navigation links...');
  const response = await axios.get(SITE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const $ = cheerio.load(response.data);
  const navLinks = [];

  // Site uses .main-header__item for top level nav items
  $('.main-header__item').each((i, topLi) => {
    const mainCatLink = $(topLi).find('.main-header__link');
    const mainCat = mainCatLink.find('span').first().text().trim() || mainCatLink.text().trim();
    if (!mainCat || mainCat.toLowerCase().includes('home') || mainCat.toLowerCase().includes('about') || mainCat.toLowerCase().includes('contact')) return;

    // Check for dropdown subcategories
    const subLinks = $(topLi).find('.main-header__dropdown-link');
    if (subLinks.length > 0) {
      subLinks.each((j, subA) => {
        const subCat = $(subA).text().trim();
        const subUrl = $(subA).attr('href');
        // Ignore the "Alle [Category]" links as they are just the main category again
        if (subCat && subUrl && !subCat.toLowerCase().startsWith('alle ')) {
          navLinks.push({ 
            cat: mainCat, 
            sub: subCat, 
            url: subUrl.startsWith('http') ? subUrl : SITE_URL + subUrl 
          });
        }
      });
    }

    // Always add the main category link as well (for items in main cat but no subcat)
    const mainUrl = mainCatLink.attr('href');
    if (mainUrl) {
      navLinks.push({ 
        cat: mainCat, 
        sub: '', 
        url: mainUrl.startsWith('http') ? mainUrl : SITE_URL + mainUrl 
      });
    }
  });

  return navLinks;
}

async function scrapeCategoryPage(catName, subcatName, startUrl) {
  let currentUrl = startUrl;
  
  while (currentUrl) {
    try {
      console.log(`Crawl -> ${catName}${subcatName ? ' > ' + subcatName : ''} : ${currentUrl}`);
      const response = await axios.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const $ = cheerio.load(response.data);
      
      const productLinks = $('.product-card__title').map((i, el) => $(el).attr('href')).get();
      if (productLinks.length === 0) break;

      for (const link of productLinks) {
        const fullLink = link.startsWith('http') ? link : SITE_URL + link;
        const slug = fullLink.split('/').pop().replace('.html', '');
        
        // Priority: Keep existing subcategory if we found it, but overrite if the new one is more specific (i.e. we have a subcategory name)
        if (!productMap[slug] || subcatName) {
          productMap[slug] = { category: catName, subcategory: subcatName };
        }
      }

      const nextLink = $('a.pagination__item:contains("Volgende")').attr('href') || $('a[aria-label="Ga naar volgende pagina"]').attr('href');
      if (!nextLink) break;
      currentUrl = nextLink.startsWith('http') ? nextLink : SITE_URL + nextLink;

      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error(`Error fetching ${currentUrl}:`, e.message);
      break;
    }
  }
}

async function run() {
  const links = await getNavLinks();
  console.log(`Found ${links.length} category/subcategory links.`);
  
  for (const link of links) {
    await scrapeCategoryPage(link.cat, link.sub, link.url);
  }

  const tsPath = path.join(process.cwd(), 'src/data/products.ts');
  const tsContent = fs.readFileSync(tsPath, 'utf8');
  const match = tsContent.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
  
  if (match) {
    const products = eval(match[1]);
    let mappedCount = 0;
    
    for (const p of products) {
      const slug = p.image.split('/').pop().replace(/\.[^/.]+$/, "");
      if (productMap[slug]) {
        p.category = productMap[slug].category;
        p.subcategory = productMap[slug].subcategory || '';
        mappedCount++;
      } else {
        // Fallback matching
        const bestMatch = Object.keys(productMap).find(s => s.replace(/-/g, '').includes(slug.replace(/-/g, '').substring(0, 10)));
        if (bestMatch) {
           p.category = productMap[bestMatch].category;
           p.subcategory = productMap[bestMatch].subcategory || '';
           mappedCount++;
        }
      }
    }

    console.log(`Final Mapping Result: Mapped ${mappedCount} out of ${products.length} products.`);

    const outputContent = `export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
}

export const products: Product[] = ${JSON.stringify(products, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

    fs.writeFileSync(tsPath, outputContent);
    console.log('DONE: Updated products.ts!');
  }
}

run();
