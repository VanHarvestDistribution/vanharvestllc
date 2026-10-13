// Publishes a batch of admin changes as ONE GitHub commit; Vercel then rebuilds the site (about 1-2 minutes).
//
// Body (all parts optional):
//   products: { "12152": { name, nameZh, category, packSize, storage, hidden } }
//             Desired values. For an Item # that is not in the warehouse catalog this creates or
//             updates an admin-added product (requires "create": true the first time).
//             null = delete: an admin-added product is removed; a warehouse product is hidden
//             (warehouse data itself is never edited, so it can be restored later).
//   images:   { "12152": "<blob sha from /api/admin/upload>" | null }   null = remove its studio image
//   featured: { meat: ["12152", ...], ... }                             full replacement
import { guard } from '../_lib/auth.js';
import { getHead, readText, listFolder, commitFiles, GitHubError } from '../_lib/github.js';
import { PATHS, CATEGORY_KEYS, STORAGE_VALUES, FIELDS, STUDIO_FILE, MAX_FEATURED, jsonFile, sortKeys } from '../_lib/catalog.js';

const ID = /^\d{3,6}$/;
const SHA = /^[0-9a-f]{40}$/;
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 200);

class BadRequest extends Error {}

function cleanProduct(id, value) {
  const product = {
    name: clean(value.name),
    nameZh: clean(value.nameZh),
    category: String(value.category || ''),
    packSize: clean(value.packSize),
    storage: String(value.storage || ''),
  };
  if (!product.name) throw new BadRequest(`产品 ${id} 的英文名称不能为空`);
  if (!CATEGORY_KEYS.includes(product.category)) throw new BadRequest(`产品 ${id} 的品类无效`);
  if (!STORAGE_VALUES.includes(product.storage)) throw new BadRequest(`产品 ${id} 的温层无效`);
  return product;
}

/** Applies product edits to the overrides file. Returns { overrides, removedAdded } */
function applyProducts(overrides, edits, baseById) {
  const next = { ...overrides };
  const removedAdded = [];
  for (const [id, value] of Object.entries(edits || {})) {
    if (!ID.test(id)) throw new BadRequest(`Item # 格式不对：${id}`);
    const base = baseById.get(id);
    const existing = next[id];
    if (value === null) {
      if (base) next[id] = { ...(existing || {}), hidden: true };
      else if (existing?.added) { delete next[id]; removedAdded.push(id); }
      continue;
    }
    if (base) {
      const wanted = cleanProduct(id, value);
      const diff = {};
      for (const field of FIELDS) if (wanted[field] !== (base[field] || '')) diff[field] = wanted[field];
      if (value.hidden) diff.hidden = true;
      if (Object.keys(diff).length) next[id] = diff;
      else delete next[id];
    } else {
      if (!existing?.added && !value.create) throw new BadRequest(`找不到产品 ${id}`);
      next[id] = { added: true, ...cleanProduct(id, value), ...(value.hidden ? { hidden: true } : {}) };
    }
  }
  return { overrides: sortKeys(next), removedAdded };
}

function validateFeatured(input, knownIds) {
  if (input === undefined) return undefined;
  const out = {};
  for (const key of CATEGORY_KEYS) {
    const ids = [...new Set((input[key] || []).map(String))].filter((id) => knownIds.has(id));
    if (ids.length > MAX_FEATURED) throw new BadRequest(`每个品类最多 ${MAX_FEATURED} 个精选产品`);
    out[key] = ids;
  }
  return out;
}

function describe(products, images, featured) {
  const list = (ids, one, many) => (ids.length > 3 ? `${ids.length} ${many}` : `${one} ${ids.join(', ')}`);
  const parts = [];
  const productIds = Object.keys(products || {});
  const imageIds = Object.keys(images || {});
  if (productIds.length) parts.push(list(productIds, 'product', 'products'));
  if (imageIds.length) parts.push(list(imageIds, 'image', 'images'));
  if (featured) parts.push('featured products');
  return `Admin: update ${parts.join('; ')}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (guard(req, res, { method: 'POST' })) return;
  try {
    const { products, images = {}, featured } = req.body || {};
    for (const [id, blob] of Object.entries(images)) {
      if (!ID.test(id)) throw new BadRequest(`图片编号无效：${id}`);
      if (blob !== null && !SHA.test(String(blob))) throw new BadRequest(`产品 ${id} 的图片还没上传完`);
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      const head = await getHead();
      const [productsText, overridesText, studioFiles] = await Promise.all([
        readText(PATHS.products, head.sha),
        readText(PATHS.overrides, head.sha),
        Object.keys(images).length || products ? listFolder(PATHS.studioDir, head.sha) : [],
      ]);
      const baseById = new Map(JSON.parse(productsText).map((p) => [String(p.id), p]));
      const currentOverrides = JSON.parse(overridesText || '{}');
      const { overrides, removedAdded } = applyProducts(currentOverrides, products, baseById);
      const knownIds = new Set([...baseById.keys(), ...Object.keys(overrides).filter((id) => overrides[id].added)]);
      for (const id of Object.keys(images)) if (!knownIds.has(id)) throw new BadRequest(`找不到产品 ${id}`);

      const files = [];
      if (products && JSON.stringify(overrides) !== JSON.stringify(sortKeys(currentOverrides))) {
        files.push({ path: PATHS.overrides, content: jsonFile(overrides) });
      }
      const featuredOut = validateFeatured(featured, knownIds);
      if (featuredOut) files.push({ path: PATHS.featured, content: jsonFile(featuredOut) });

      const version = Date.now().toString(36);
      const studio = {};
      const imageEdits = { ...images };
      for (const id of removedAdded) imageEdits[id] = null; // a deleted product takes its picture with it
      for (const [id, blob] of Object.entries(imageEdits)) {
        for (const file of studioFiles) if (file.match(STUDIO_FILE)?.[1] === id) files.push({ path: `${PATHS.studioDir}/${file}`, content: null });
        if (blob) {
          const name = `${id}-${version}.webp`;
          files.push({ path: `${PATHS.studioDir}/${name}`, blob });
          studio[id] = `/images/products/ai/${name}`;
        }
      }
      if (!files.length) return res.status(200).json({ ok: true, commit: head.sha, unchanged: true, studio });

      try {
        const commit = await commitFiles({ head, message: describe(products, images, featured), files });
        return res.status(200).json({ ok: true, commit, studio });
      } catch (error) {
        if (error instanceof GitHubError && error.status === 409 && attempt < 3) continue;
        throw error;
      }
    }
    throw new Error('保存冲突，请重试');
  } catch (error) {
    if (error instanceof BadRequest) return res.status(400).json({ error: error.message });
    console.error(error);
    return res.status(502).json({ error: `发布失败：${error.message}` });
  }
}
