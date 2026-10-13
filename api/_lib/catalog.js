// Paths and rules shared by the admin API. Keep in sync with scripts/apply_catalog_overrides.mjs.
export const PATHS = {
  products: 'src/data/products.json',
  overrides: 'data/product-overrides.json',
  featured: 'src/data/featured.json',
  studioDir: 'public/images/products/ai',
  warehouse: 'src/data/yellowLabelProductImages.ts',
};
export const CATEGORY_KEYS = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared'];
export const STORAGE_VALUES = ['', 'frozen', 'refrigerated'];
export const FIELDS = ['name', 'nameZh', 'category', 'packSize', 'storage'];
export const STUDIO_FILE = /^(\d+)(?:-[a-z0-9]+)?\.webp$/;
export const MAX_FEATURED = 24;

export function studioMap(fileNames) {
  const map = {};
  for (const file of [...fileNames].sort()) {
    const match = file.match(STUDIO_FILE);
    if (!match || (map[match[1]] && !file.includes('-'))) continue;
    map[match[1]] = `/images/products/ai/${file}`;
  }
  return map;
}

export function warehouseMap(source) {
  return Object.fromEntries(
    [...(source || '').matchAll(/'([0-9]+)':\s*'([^']+)'/g)]
      .filter(([, , image]) => image.startsWith('/images/products/uploaded/'))
      .map(([, id, image]) => [id, image])
  );
}

export const jsonFile = (value) => `${JSON.stringify(value, null, 2)}\n`;

export function sortKeys(object) {
  return Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]));
}
