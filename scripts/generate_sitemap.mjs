import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = (process.env.PUBLIC_SITE_ORIGIN || 'https://vanharvest.com').replace(/\/$/, '');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf-8'));

const base_routes = [
  '',
  '/products',
  '/products/catalog',
  '/company',
  '/services',
  '/contact',
  '/apply',
  '/delivery',
  '/industries',
  '/careers',
  '/suppliers',
  '/privacy',
  '/terms'
];

const urls = [];
for (const r of base_routes) {
  urls.push(`${ORIGIN}${r || '/'}`);
  urls.push(`${ORIGIN}/zh${r}`);
}

const departments = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared'];
for (const d of departments) {
  urls.push(`${ORIGIN}/products/${d}`);
  urls.push(`${ORIGIN}/zh/products/${d}`);
}

for (const p of products) {
  urls.push(`${ORIGIN}/products/${p.category}/${p.id}`);
  urls.push(`${ORIGIN}/zh/products/${p.category}/${p.id}`);
}

const uniqueUrls = Array.from(new Set(urls)).sort();
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];
for (const u of uniqueUrls) {
  lines.push('  <url>');
  lines.push(`    <loc>${u.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</loc>`);
  lines.push('  </url>');
}
lines.push('</urlset>');

const outFile = path.join(ROOT, 'public/sitemap.xml');
fs.writeFileSync(outFile, lines.join('\n') + '\n', 'utf-8');
console.log(`Generated ${uniqueUrls.length} sitemap entries at ${outFile}`);
