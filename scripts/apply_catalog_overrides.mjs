// Merges admin edits into the warehouse catalog. Runs first in `pnpm build` and `pnpm dev`.
//
//   src/data/products.json        <- from the warehouse Excel (scripts/import_stocklist.py)
//   data/product-overrides.json   <- edits saved from /admin, keyed by Item #
//   => src/data/catalog.json      (generated, git-ignored; what the site reads)
//   => src/data/catalog-moves.json (generated; items whose category was changed in /admin)
//
// Override fields: name, nameZh, category, packSize, storage, hidden.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/productImages.mjs';

export const CATEGORY_KEYS = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared'];
const FIELDS = ['name', 'nameZh', 'category', 'packSize', 'storage'];

const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf-8'));
const overridesPath = path.join(ROOT, 'data/product-overrides.json');
const overrides = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, 'utf-8')) : {};

const catalog = [];
const moves = [];
let edited = 0;
let hidden = 0;
for (const product of base) {
  const o = overrides[String(product.id)];
  if (!o) { catalog.push(product); continue; }
  edited++;
  if (o.hidden) { hidden++; continue; }
  const merged = { ...product };
  for (const field of FIELDS) if (typeof o[field] === 'string') merged[field] = o[field];
  if (!CATEGORY_KEYS.includes(merged.category)) merged.category = product.category;
  if (merged.category !== product.category) moves.push({ id: String(product.id), from: product.category, to: merged.category });
  catalog.push(merged);
}

const unknown = Object.keys(overrides).filter((id) => !base.some((p) => String(p.id) === id));
if (unknown.length) console.warn(`Overrides for items not in the warehouse catalog (ignored): ${unknown.join(', ')}`);

fs.writeFileSync(path.join(ROOT, 'src/data/catalog.json'), JSON.stringify(catalog), 'utf-8');
fs.writeFileSync(path.join(ROOT, 'src/data/catalog-moves.json'), JSON.stringify(moves, null, 2), 'utf-8');
console.log(`Catalog: ${catalog.length} products (${edited} edited in admin, ${hidden} hidden, ${moves.length} moved)`);
