import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readProductImages, readCatalog } from './lib/productImages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = (process.env.PUBLIC_SITE_ORIGIN || 'https://vanharvestllc.com').replace(/\/$/, '');
const products = readCatalog();
const imageIds = new Set(Object.keys(readProductImages()));

const baseRoutes = [
  '', '/products', '/products/catalog', '/company', '/services', '/contact', '/apply', '/delivery',
  '/industries', '/careers', '/suppliers', '/privacy', '/terms', '/charlotte-food-distributor',
  '/chinese-restaurant-supplier', '/nc-sc-food-delivery'
];
const departments = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared'];
const urls = [];
const formatUrl = (pathname) => {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const trailing = clean === '/' || clean.endsWith('/') ? clean : `${clean}/`;
  return `${ORIGIN}${trailing}`;
};
for (const route of baseRoutes) {
  urls.push(formatUrl(route || '/'));
  urls.push(formatUrl(`/zh${route}`));
}
for (const department of departments) {
  urls.push(formatUrl(`/products/${department}`));
  urls.push(formatUrl(`/zh/products/${department}`));
}
for (const product of products) {
  if (!imageIds.has(String(product.id))) continue;
  urls.push(formatUrl(`/products/${product.category}/${product.id}`));
  urls.push(formatUrl(`/zh/products/${product.category}/${product.id}`));
}
const xmlEscape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const uniqueUrls = [...new Set(urls)].sort();
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueUrls.flatMap((url) => ['  <url>', `    <loc>${xmlEscape(url)}</loc>`, '  </url>']),
  '</urlset>', ''
].join('\n');
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf-8');
console.log(`Generated ${uniqueUrls.length} static sitemap entries at public/sitemap.xml`);
