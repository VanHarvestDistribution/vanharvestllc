// Website forms (order cart, contact, account application, careers, suppliers) -> email to the sales inbox.
// Sends through Gmail SMTP with an app password, so it does not depend on a third-party form service.
//
// Environment variables (set in Vercel -> Project -> Settings -> Environment Variables):
//   GMAIL_USER          the Gmail address that sends the mail, e.g. ordersvhd@gmail.com
//   GMAIL_APP_PASSWORD  a 16-character Google "app password" for that account (not the normal password)
//   FORM_TO             optional; where submissions go (comma-separated). Defaults to GMAIL_USER.
//
// POST JSON {
//   kind: 'order' | 'contact' | 'apply' | 'careers' | 'suppliers',
//   subject: string, replyTo?: string,
//   fields: [[label, value], ...],
//   attachments?: [{ name, type, data: base64 }],
//   elapsedMs: number, honey?: string
// }
// Responds { ok: true } or { error } (503 'not_configured' when the env vars are missing, so the page can fall back).
import nodemailer from 'nodemailer';

const KINDS = { order: '网站订单', contact: '联系', apply: '开户申请', careers: '招聘', suppliers: '供应商' };
const MAX_FIELDS = 260;
const MAX_ATTACHMENT_BYTES = 3_300_000; // Vercel request bodies are capped at 4.5 MB, base64 adds a third
const ALLOWED_FILE = /\.(pdf|doc|docx|xls|xlsx|csv|jpe?g|png|webp|heic)$/i;
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

const oneLine = (value, max) => String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
const multiLine = (value, max) => String(value ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let transporter;
function mailer() {
  transporter ||= nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '') },
  });
  return transporter;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return res.status(503).json({ error: 'not_configured' });

  const body = typeof req.body === 'object' && req.body ? req.body : {};
  const kind = KINDS[body.kind] ? body.kind : null;
  if (!kind) return res.status(400).json({ error: 'bad_kind' });
  // Bots fill the hidden field or submit instantly; pretend success so they don't retry.
  if (oneLine(body.honey, 200) || Number(body.elapsedMs) < 2000) return res.status(200).json({ ok: true });

  const fields = (Array.isArray(body.fields) ? body.fields : [])
    .slice(0, MAX_FIELDS)
    .filter((pair) => Array.isArray(pair) && pair.length === 2)
    .map(([label, value]) => [oneLine(label, 80), multiLine(value, 3000)])
    .filter(([label]) => label);
  if (!fields.length) return res.status(400).json({ error: 'empty' });

  const attachments = [];
  let attachmentBytes = 0;
  for (const file of Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : []) {
    const name = oneLine(file?.name, 120).replace(/[\\/]/g, '_');
    if (!name || !ALLOWED_FILE.test(name)) return res.status(400).json({ error: 'bad_file' });
    const content = Buffer.from(String(file.data || ''), 'base64');
    attachmentBytes += content.length;
    if (attachmentBytes > MAX_ATTACHMENT_BYTES) return res.status(413).json({ error: 'too_large' });
    attachments.push({ filename: name, content, contentType: oneLine(file.type, 100) || undefined });
  }

  const subjectText = oneLine(body.subject, 180) || `[${KINDS[kind]}] 网站表单`;
  const replyTo = EMAIL.test(oneLine(body.replyTo, 200)) ? oneLine(body.replyTo, 200) : undefined;
  const rows = fields
    .map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:8px 12px;border:1px solid #ddd;background:#f6f3ee;white-space:nowrap;font-weight:600">${escapeHtml(label)}</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');
  const html = `<div style="font:14px/1.5 -apple-system,Segoe UI,Arial,sans-serif;color:#1a1a1a"><table style="border-collapse:collapse;max-width:760px">${rows}</table><p style="color:#888;font-size:12px;margin-top:16px">来自 vanharvestllc.com 网站表单</p></div>`;
  const text = fields.map(([label, value]) => `${label}: ${value}`).join('\n');

  try {
    await mailer().sendMail({
      from: { name: 'Van Harvest 网站', address: process.env.GMAIL_USER },
      to: process.env.FORM_TO || process.env.GMAIL_USER,
      replyTo,
      subject: subjectText,
      text,
      html,
      attachments,
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('submit failed', error?.code, error?.responseCode, error?.message);
    return res.status(502).json({ error: 'send_failed' });
  }
}
