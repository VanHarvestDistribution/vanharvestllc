import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const historyPath = path.join(ROOT, 'data/product-route-redirects.json');
const productsPath = path.join(ROOT, 'src/data/products.json');
const photoMapPath = path.join(ROOT, 'src/data/yellowLabelProductImages.ts');
const outputPath = path.join(ROOT, 'public/_redirects');

const base = `# Canonical domain: apex vanharvestllc.com
https://www.vanharvestllc.com/* https://vanharvestllc.com/:splat 301!
http://www.vanharvestllc.com/* https://vanharvestllc.com/:splat 301!
http://vanharvestllc.com/* https://vanharvestllc.com/:splat 301!

# Legacy product detail paths from item reclassification
# Photo-backed products keep a detail destination. Products without an emitted
# detail page redirect to their current public category page instead of a 404.
`;

const staticRoutes = [
  '/products', '/products/catalog', '/company', '/services', '/contact', '/apply', '/delivery',
  '/industries', '/careers', '/suppliers', '/privacy', '/terms', '/charlotte-food-distributor',
  '/chinese-restaurant-supplier', '/nc-sc-food-delivery',
];
const departments = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared'];
const noSlash = [...staticRoutes, ...departments.map((department) => `/products/${department}`)];
const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8')).redirects || [];
const products = new Map(JSON.parse(fs.readFileSync(productsPath, 'utf-8')).map((product) => [String(product.id), product]));
const photoMapSource = fs.readFileSync(photoMapPath, 'utf-8');
const photoItemIds = new Set(
  [...photoMapSource.matchAll(/'([0-9]+)':\s*'([^']+)'/g)]
    .filter(([, , image]) => image.startsWith('/images/products/uploaded/'))
    .map(([, itemId]) => itemId)
);

const productRedirects = history.flatMap(({ id, from, to }) => {
  const product = products.get(String(id));
  const destinationCategory = product?.category || to;
  const hasStaticDetail = photoItemIds.has(String(id));
  const destination = hasStaticDetail
    ? `/products/${destinationCategory}/${id}/`
    : `/products/${destinationCategory}/`;
  const localizedDestination = hasStaticDetail
    ? `/zh/products/${destinationCategory}/${id}/`
    : `/zh/products/${destinationCategory}/`;
  return [
    `/products/${from}/${id}/ ${destination} 301`,
    `/zh/products/${from}/${id}/ ${localizedDestination} 301`,
  ];
});
const trailing = [...noSlash, ...noSlash.map((route) => `/zh${route}`), '/zh'].map((route) => `${route} ${route}/ 301`);

fs.writeFileSync(outputPath, `${base}${productRedirects.join('\n')}\n\n# Support legacy non-trailing slashes\n${trailing.join('\n')}\n`, 'utf-8');
console.log(`Generated ${productRedirects.length} product redirects and ${trailing.length} trailing-slash redirects.`);
