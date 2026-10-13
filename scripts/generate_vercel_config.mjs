// Writes vercel.json: cache headers + permanent (301/308) redirects for products that changed category.
// Run after the catalog changes:  node scripts/generate_vercel_config.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readProductImages, readCatalog } from './lib/productImages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const history = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/product-route-redirects.json'), 'utf-8')).redirects || [];
const products = new Map(readCatalog().map((p) => [String(p.id), p]));
const detailIds = new Set(Object.keys(readProductImages()));

const redirects = [];
const seen = new Set();
for (const { id, from, to } of history) {
  const cat = products.get(String(id))?.category || to;
  if (cat === from) continue;
  for (const prefix of ['', '/zh']) {
    const source = `${prefix}/products/${from}/${id}/`;
    if (seen.has(source)) continue;
    seen.add(source);
    const destination = detailIds.has(String(id)) ? `${prefix}/products/${cat}/${id}/` : `${prefix}/products/${cat}/`;
    redirects.push({ source, destination, permanent: true });
  }
}
if (redirects.length > 1900) console.warn(`WARNING: ${redirects.length} redirects is close to Vercel's per-project limit.`);

const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'astro',
  installCommand: 'pnpm install --frozen-lockfile',
  buildCommand: 'pnpm build',
  outputDirectory: 'dist',
  trailingSlash: true,
  // /admin saves: image conversion + several GitHub calls can exceed the 10s default.
  functions: { 'api/admin/save.js': { maxDuration: 60 }, 'api/admin/upload.js': { maxDuration: 30 } },
  headers: [
    { source: '/admin/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }] },
    { source: '/_astro/(.*)', headers: immutable },
    { source: '/images/(.*)', headers: immutable },
    { source: '/brand/(.*)', headers: immutable },
    { source: '/catalog/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },
    { source: '/data/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }] },
  ],
  redirects: [
    { source: '/:path*', has: [{ type: 'host', value: 'www.vanharvestllc.com' }], destination: 'https://vanharvestllc.com/:path*', permanent: true },
    ...redirects,
  ],
};
fs.writeFileSync(path.join(ROOT, 'vercel.json'), JSON.stringify(config, null, 2) + '\n');
console.log(`vercel.json written with ${redirects.length} product redirects.`);
