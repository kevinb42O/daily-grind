const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const match = content.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
if (match) {
  const products = eval(match[1]);
  const categories = {};
  products.forEach(p => {
    if (!categories[p.category]) categories[p.category] = new Set();
    if (p.subcategory && p.subcategory !== 'Uncategorized') categories[p.category].add(p.subcategory);
  });
  for (const c in categories) {
    console.log(c + ':', Array.from(categories[c]));
  }
}
