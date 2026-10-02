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

const publicCatalog = products.map((product) => {
  const entry = {
    id: String(product.id),
    name: String(product.name || ''),
    nameZh: String(product.nameZh || ''),
    category: String(product.category || '')
  };

  if (product.packSize) entry.packSize = String(product.packSize);
  if (product.storage === 'frozen' || product.storage === 'refrigerated') entry.storage = product.storage;
  if (realPhotoByItem[product.id]) entry.image = realPhotoByItem[product.id];

  return entry;
});

const forbiddenFields = ['rawName', 'price', 'cost', 'remark', 'remarks', 'note', 'notes'];
for (const item of publicCatalog) {
  for (const field of forbiddenFields) {
    if (Object.prototype.hasOwnProperty.call(item, field)) {
      throw new Error(`Forbidden public catalog field: ${field}`);
    }
  }
}

const outputDir = path.join(ROOT, 'public/data');
fs.mkdirSync(outputDir, { recursive: true });
const outputFile = path.join(outputDir, 'catalog.json');
fs.writeFileSync(outputFile, `${JSON.stringify(publicCatalog)}\n`, 'utf-8');
console.log(`Generated ${publicCatalog.length} public catalog records at ${outputFile}`);
