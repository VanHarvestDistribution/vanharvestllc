// Shared-password login for /admin. The password lives in the ADMIN_PASSWORD
// environment variable on Vercel; a signed, HttpOnly cookie keeps staff signed in.
import crypto from 'node:crypto';

const COOKIE = 'vh_admin';
const MAX_AGE = 12 * 60 * 60; // seconds

function secret() {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit) return explicit;
  // Changing the password (or the GitHub token) signs everyone out.
  return crypto.createHash('sha256').update(`${process.env.ADMIN_PASSWORD}|${process.env.GITHUB_TOKEN}`).digest('hex');
}

const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export function passwordMatches(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== 'string') return false;
  const a = crypto.createHash('sha256').update(input).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export function sessionCookie() {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function isSignedIn(req) {
  const raw = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const [payload, mac] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !mac) return false;
  const expected = sign(payload);
  if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Rejects requests that are not signed in or not sent by the admin page itself. Returns true when handled. */
export function guard(req, res, { method }) {
  if (req.method !== method) {
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }
  if (method !== 'GET' && req.headers['x-admin-request'] !== '1') {
    res.status(403).json({ error: 'Forbidden' });
    return true;
  }
  if (!isSignedIn(req)) {
    res.status(401).json({ error: '请先登录' });
    return true;
  }
  return false;
}
