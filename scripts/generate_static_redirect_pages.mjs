import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readProductImages, readCatalog } from './lib/productImages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const historyPath = path.join(ROOT, 'data/product-route-redirects.json');

if (!fs.existsSync(DIST)) {
  console.log('dist directory not found; skipping static redirect page generation.');
  process.exit(0);
}

const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8')).redirects || [];
const products = new Map(readCatalog().map((product) => [String(product.id), product]));
// Category changes made in /admin also need the old URL to keep working.
const movesPath = path.join(ROOT, 'src/data/catalog-moves.json');
if (fs.existsSync(movesPath)) history.push(...JSON.parse(fs.readFileSync(movesPath, 'utf-8')));
const photoItemIds = new Set(Object.keys(readProductImages()));

function makeRedirectHtml(destination) {
  const absoluteUrl = `https://vanharvestllc.com${destination}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${destination}">
  <link rel="canonical" href="${absoluteUrl}">
  <meta name="robots" content="noindex, follow">
  <title>Redirecting...</title>
  <script>location.replace(${JSON.stringify(destination)});</script>
</head>
<body>
  <p>Redirecting to <a href="${destination}">${destination}</a>...</p>
</body>
</html>
`;
}

let createdCount = 0;
for (const { id, from, to } of history) {
  const product = products.get(String(id));
  const destinationCategory = product?.category || to;
  // The item is back in its old category: that path is a real page now, not a redirect.
  if (destinationCategory === from) continue;
  const hasStaticDetail = photoItemIds.has(String(id));
  const enDestination = hasStaticDetail
    ? `/products/${destinationCategory}/${id}/`
    : `/products/${destinationCategory}/`;
  const zhDestination = hasStaticDetail
    ? `/zh/products/${destinationCategory}/${id}/`
    : `/zh/products/${destinationCategory}/`;

  const pairs = [
    { dir: path.join(DIST, 'products', from, String(id)), destination: enDestination },
    { dir: path.join(DIST, 'zh', 'products', from, String(id)), destination: zhDestination },
  ];

  for (const { dir, destination } of pairs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const htmlFile = path.join(dir, 'index.html');
    fs.writeFileSync(htmlFile, makeRedirectHtml(destination), 'utf-8');
    createdCount++;
  }
}

console.log(`Generated ${createdCount} static HTML redirect pages in dist/ for legacy product paths.`);
