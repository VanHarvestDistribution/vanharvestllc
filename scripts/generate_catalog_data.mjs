import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf-8'));
const yellowLabelMapSource = fs.readFileSync(path.join(ROOT, 'src/data/yellowLabelProductImages.ts'), 'utf-8');
const realPhotoByItem = Object.fromEntries(
  [...yellowLabelMapSource.matchAll(/'([0-9]+)':\s*'([^']+)'/g)]
    .filter(([, , image]) => image.startsWith('/images/products/uploaded/'))
    .map(([, itemId, image]) => [itemId, image])
);

const outputDir = path.join(ROOT, 'public/data');
const categoryDir = path.join(outputDir, 'categories');
fs.mkdirSync(categoryDir, { recursive: true });

const index = products.map((product) => ({
  id: String(product.id),
  name: String(product.name || ''),
  nameZh: String(product.nameZh || ''),
  category: String(product.category || '')
}));

const byCategory = new Map();
for (const product of products) {
  const category = String(product.category || '');
  const entry = {
    id: String(product.id),
    name: String(product.name || ''),
    nameZh: String(product.nameZh || ''),
    category,
  };
  if (product.packSize) entry.packSize = String(product.packSize);
  if (product.storage === 'frozen' || product.storage === 'refrigerated') entry.storage = product.storage;
  if (realPhotoByItem[String(product.id)]) entry.image = realPhotoByItem[String(product.id)];
  if (!byCategory.has(category)) byCategory.set(category, []);
  byCategory.get(category).push(entry);
}

const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value)}\n`, 'utf-8');
writeJson(path.join(outputDir, 'catalog-index.json'), index);
for (const [category, entries] of byCategory) writeJson(path.join(categoryDir, `${category}.json`), entries);
console.log(`Generated ${index.length} index records and ${byCategory.size} category files`);
