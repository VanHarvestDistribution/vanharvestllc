// Converts one product image to WebP and stores it on GitHub as an unattached blob.
// Nothing changes on the site until /api/admin/save commits it (so a whole batch publishes at once).
//   POST { data: "<base64 JPEG/PNG/WebP>" }  ->  { blob: "<sha>", bytes }
import sharp from 'sharp';
import { guard } from '../_lib/auth.js';
import { createBlob } from '../_lib/github.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (guard(req, res, { method: 'POST' })) return;
  const input = Buffer.from(String(req.body?.data || ''), 'base64');
  if (input.length < 100) return res.status(400).json({ error: '图片无效' });
  try {
    const pipeline = sharp(input, { failOn: 'none' })
      .rotate()
      .resize(1280, 960, { fit: 'contain', background: '#ffffff' })
      .flatten({ background: '#ffffff' });
    let webp = await pipeline.clone().webp({ quality: 82 }).toBuffer();
    if (webp.length > 250_000) webp = await pipeline.clone().webp({ quality: 70 }).toBuffer();
    res.status(200).json({ blob: await createBlob(webp), bytes: webp.length });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: `图片上传失败：${error.message}` });
  }
}
