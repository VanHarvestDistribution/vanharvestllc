// POST {password} signs in, DELETE signs out, GET reports whether the cookie is valid.
import { passwordMatches, sessionCookie, clearCookie, isSignedIn } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ signedIn: isSignedIn(req) });
  if (req.headers['x-admin-request'] !== '1') return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCookie());
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD 未设置' });
  if (!passwordMatches(req.body?.password)) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // slow down guessing
    return res.status(401).json({ error: '密码不正确' });
  }
  res.setHeader('Set-Cookie', sessionCookie());
  return res.status(200).json({ ok: true });
}
