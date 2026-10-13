// Shared product-image lookup for the Node build scripts.
//
// Two sources, merged per Item #:
//   1. Studio images: public/images/products/ai/{itemId}.webp
//      White-background representative photos. To add or replace one, drop
//      a .webp named after the Item # into that folder and rebuild.
//   2. Warehouse photos listed in src/data/yellowLabelProductImages.ts
//      (/images/products/uploaded/...).
// A studio image wins over a warehouse photo for the same item.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const AI_DIR = path.join(ROOT, 'public/images/products/ai');
export const AI_URL_PREFIX = '/images/products/ai/';

export function readStudioImages() {
  if (!fs.existsSync(AI_DIR)) return {};
  return Object.fromEntries(
    fs.readdirSync(AI_DIR)
      .filter((file) => /^\d+\.webp$/.test(file))
      .sort()
      .map((file) => [file.replace('.webp', ''), `${AI_URL_PREFIX}${file}`])
  );
}

export function readWarehousePhotos() {
  const source = fs.readFileSync(path.join(ROOT, 'src/data/yellowLabelProductImages.ts'), 'utf-8');
  return Object.fromEntries(
    [...source.matchAll(/'([0-9]+)':\s*'([^']+)'/g)]
      .filter(([, , image]) => image.startsWith('/images/products/uploaded/'))
      .map(([, itemId, image]) => [itemId, image])
  );
}

export function readProductImages() {
  return { ...readWarehousePhotos(), ...readStudioImages() };
}
