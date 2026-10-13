// Saves admin edits as one GitHub commit; Vercel then rebuilds and publishes the site (about 1-2 minutes).
//
// Body (all parts optional):
//   products: { "12152": { name, nameZh, category, packSize, storage, hidden } }   desired values
//   images:   { "12152": "<base64 JPEG/PNG/WebP>" | null }                          null = remove studio image
//   featured: { meat: ["12152", ...], ... }                                         full replacement
import sharp from 'sharp';
import { guard } from '../_lib/auth.js';
import { getHead, readText, listFolder, commitFiles, GitHubError } from '../_lib/github.js';
import { PATHS, CATEGORY_KEYS, STORAGE_VALUES, FIELDS, STUDIO_FILE, MAX_FEATURED, jsonFile, sortKeys } from '../_lib/catalog.js';

const ID = /^\d{3,6}$/;
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 200);

class BadRequest extends Error {}

function validateProducts(input, baseById) {
  const out = {};
  for (const [id, value] of Object.entries(input || {})) {
    if (!ID.test(id) || !baseById.has(id)) throw new BadRequest(`找不到产品 ${id}`);
    const product = {
      name: clean(value.name),
      nameZh: clean(value.nameZh),
      category: String(value.category || ''),
      packSize: clean(value.packSize),
      storage: String(value.storage || ''),
      hidden: Boolean(value.hidden),
    };
    if (!product.name) throw new BadRequest(`产品 ${id} 的英文名称不能为空`);
    if (!CATEGORY_KEYS.includes(product.category)) throw new BadRequest(`产品 ${id} 的品类无效`);
    if (!STORAGE_VALUES.includes(product.storage)) throw new BadRequest(`产品 ${id} 的温层无效`);
    out[id] = product;
  }
  return out;
}

function validateFeatured(input, baseById) {
  if (input === undefined) return undefined;
  const out = {};
  for (const key of CATEGORY_KEYS) {
    const ids = [...new Set((input[key] || []).map(String))];
    for (const id of ids) if (!baseById.has(id)) throw new BadRequest(`精选里的产品 ${id} 不存在`);
    if (ids.length > MAX_FEATURED) throw new BadRequest(`每个品类最多 ${MAX_FEATURED} 个精选产品`);
    out[key] = ids;
  }
  return out;
}

async function toWebp(base64) {
  const input = Buffer.from(base64, 'base64');
  if (input.length < 100) throw new BadRequest('图片无效');
  const pipeline = sharp(input, { failOn: 'none' })
    .rotate()
    .resize(1280, 960, { fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' });
  let output = await pipeline.clone().webp({ quality: 82 }).toBuffer();
  if (output.length > 250_000) output = await pipeline.clone().webp({ quality: 70 }).toBuffer();
  return output;
}

function applyProductEdits(overrides, edits, baseById) {
  const next = { ...overrides };
  for (const [id, wanted] of Object.entries(edits)) {
    const base = baseById.get(id);
    const diff = {};
    for (const field of FIELDS) if (wanted[field] !== (base[field] || '')) diff[field] = wanted[field];
    if (wanted.hidden) diff.hidden = true;
    if (Object.keys(diff).length) next[id] = diff;
    else delete next[id];
  }
  return sortKeys(next);
}

function describe(products, images, featured) {
  const parts = [];
  const productIds = Object.keys(products);
  const imageIds = Object.keys(images);
  if (productIds.length) parts.push(`update ${productIds.length > 3 ? `${productIds.length} products` : productIds.join(', ')}`);
  if (imageIds.length) parts.push(`${imageIds.length > 3 ? `${imageIds.length} images` : `image ${imageIds.join(', ')}`}`);
  if (featured) parts.push('featured products');
  return `Admin: ${parts.join('; ') || 'no changes'}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (guard(req, res, { method: 'POST' })) return;
  try {
    const body = req.body || {};
    const imagesIn = body.images || {};
    for (const id of Object.keys(imagesIn)) if (!ID.test(id)) throw new BadRequest(`图片编号无效：${id}`);

    // Convert images once, outside the retry loop.
    const webps = {};
    for (const [id, data] of Object.entries(imagesIn)) webps[id] = data === null ? null : await toWebp(data);

    for (let attempt = 1; attempt <= 3; attempt++) {
      const head = await getHead();
      const base = JSON.parse(await readText(PATHS.products, head.sha));
      const baseById = new Map(base.map((p) => [String(p.id), p]));
      for (const id of Object.keys(webps)) if (!baseById.has(id)) throw new BadRequest(`找不到产品 ${id}`);
      const products = validateProducts(body.products, baseById);
      const featured = validateFeatured(body.featured, baseById);

      const files = [];
      if (Object.keys(products).length) {
        const overrides = JSON.parse((await readText(PATHS.overrides, head.sha)) || '{}');
        files.push({ path: PATHS.overrides, content: jsonFile(applyProductEdits(overrides, products, baseById)) });
      }
      if (featured) files.push({ path: PATHS.featured, content: jsonFile(featured) });
      if (Object.keys(webps).length) {
        const existing = await listFolder(PATHS.studioDir, head.sha);
        const version = Date.now().toString(36);
        for (const [id, webp] of Object.entries(webps)) {
          for (const file of existing) if (file.match(STUDIO_FILE)?.[1] === id) files.push({ path: `${PATHS.studioDir}/${file}`, content: null });
          if (webp) files.push({ path: `${PATHS.studioDir}/${id}-${version}.webp`, content: webp });
        }
      }
      if (!files.length) return res.status(200).json({ ok: true, commit: head.sha, unchanged: true });

      try {
        const commit = await commitFiles({ head, message: describe(products, webps, featured), files });
        const studio = {};
        for (const file of files) {
          const match = file.content && file.path.split('/').pop().match(STUDIO_FILE);
          if (match) studio[match[1]] = `/images/products/ai/${file.path.split('/').pop()}`;
        }
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
    return res.status(502).json({ error: `保存失败：${error.message}` });
  }
}
