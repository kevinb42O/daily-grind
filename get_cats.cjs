const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const lines = content.split('\n');

let productsStr = '';
let capture = false;
for (let line of lines) {
  if (line.includes('export const products: Product[] = [')) {
    capture = true;
    productsStr += '[\n';
    continue;
  }
  if (capture) {
    productsStr += line + '\n';
  }
}
const products = eval(productsStr);
const categories = {};

products.forEach(p => {
  if (!categories[p.category]) categories[p.category] = new Set();
  
  // We skip "Uncategorized" subcategories unless they have actual values
  if (p.subcategory && p.subcategory !== 'Uncategorized') {
    categories[p.category].add(p.subcategory);
  }
});

for (const c in categories) {
  console.log(`\n${c}:`);
  const subcats = Array.from(categories[c]);
  if (subcats.length === 0) {
    console.log('  (no subcategories)');
  } else {
    subcats.forEach(s => console.log(`  - ${s}`));
  }
}
