// Everything the admin page needs, read live from the latest commit on GitHub
// (so it includes saves that are still deploying).
import { guard } from '../_lib/auth.js';
import { getHead, readText, listFolder } from '../_lib/github.js';
import { PATHS, studioMap, warehouseMap } from '../_lib/catalog.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (guard(req, res, { method: 'GET' })) return;
  try {
    const head = await getHead();
    const [productsText, overridesText, featuredText, studioFiles, warehouseText] = await Promise.all([
      readText(PATHS.products, head.sha),
      readText(PATHS.overrides, head.sha),
      readText(PATHS.featured, head.sha),
      listFolder(PATHS.studioDir, head.sha),
      readText(PATHS.warehouse, head.sha),
    ]);
    const products = JSON.parse(productsText).map((p) => [String(p.id), p.name || '', p.nameZh || '', p.category || '', p.packSize || '', p.storage || '']);
    res.status(200).json({
      commit: head.sha,
      products,
      overrides: overridesText ? JSON.parse(overridesText) : {},
      featured: featuredText ? JSON.parse(featuredText) : {},
      studio: studioMap(studioFiles),
      warehouse: warehouseMap(warehouseText),
    });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: `读取数据失败：${error.message}` });
  }
}
