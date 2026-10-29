// Small 480px copies of product photos for the featured-product cards on category pages.
// Only missing thumbnails are generated, so repeat builds stay fast. Replaced photos use new
// file names (images are cached as immutable), so an existing thumbnail never goes stale.
import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCES = ['public/images/products/ai', 'public/images/products/uploaded', 'public/images/products/real'];
const OUT = 'public/images/products/thumb';
mkdirSync(OUT, { recursive: true });

let made = 0;
const available = [];
for (const dir of SOURCES) {
  if (!existsSync(dir)) continue;
  const sub = path.basename(dir);
  mkdirSync(path.join(OUT, sub), { recursive: true });
  for (const file of readdirSync(dir)) {
    if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
    const src = path.join(dir, file);
    const dest = path.join(OUT, sub, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    if (!existsSync(dest)) { // replaced photos get new file names, so existing thumbnails stay valid
      await sharp(src).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
      made++;
    }
    available.push(`/images/products/${sub}/${file}`);
  }
}
writeFileSync('src/data/productThumbs.json', `${JSON.stringify(available.sort())}\n`);
console.log(`product thumbnails: ${made} generated, ${available.length} available`);
