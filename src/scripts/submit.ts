// Sends a website form. First our own /api/submit (Gmail), then FormSubmit as a backup.
// Returns true when either one accepted the submission.

export interface SubmitPayload {
  kind: 'order' | 'contact' | 'apply' | 'careers' | 'suppliers';
  subject: string;
  replyTo?: string;
  fields: [string, string][];
  files?: File[];
  elapsedMs: number;
  honey?: string;
}

const FORMSUBMIT = 'https://formsubmit.co/ajax/ordersvhd@gmail.com';
const API_FILE_LIMIT = 3_200_000;

const timeout = (ms: number) => (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(ms) : undefined);

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

async function viaApi(payload: SubmitPayload): Promise<boolean> {
  const files = payload.files || [];
  if (files.reduce((sum, file) => sum + file.size, 0) > API_FILE_LIMIT) return false; // too big for our endpoint
  const attachments = await Promise.all(files.map(async (file) => ({ name: file.name, type: file.type, data: await toBase64(file) })));
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ kind: payload.kind, subject: payload.subject, replyTo: payload.replyTo, fields: payload.fields, attachments, elapsedMs: payload.elapsedMs, honey: payload.honey || '' }),
    signal: timeout(25000),
  });
  if (!response.ok) return false;
  const data = await response.json().catch(() => null);
  return Boolean(data && data.ok);
}

async function viaFormSubmit(payload: SubmitPayload): Promise<boolean> {
  const form = new FormData();
  form.set('_subject', payload.subject);
  form.set('_template', 'table');
  form.set('_captcha', 'false');
  if (payload.replyTo) form.set('_replyto', payload.replyTo);
  const seen = new Map<string, number>();
  for (const [label, value] of payload.fields) {
    const count = (seen.get(label) || 0) + 1;
    seen.set(label, count);
    form.set(count > 1 ? `${label} (${count})` : label, value);
  }
  (payload.files || []).forEach((file, index) => form.append(index ? `attachment${index + 1}` : 'attachment', file));
  const response = await fetch(FORMSUBMIT, { method: 'POST', headers: { Accept: 'application/json' }, body: form, signal: timeout(20000) });
  if (!response.ok) return false;
  const data = await response.json().catch(() => null);
  return !(data && (data.success === false || data.success === 'false'));
}

export async function sendForm(payload: SubmitPayload): Promise<boolean> {
  try {
    if (await viaApi(payload)) return true;
  } catch {
    /* fall through to the backup service */
  }
  try {
    return await viaFormSubmit(payload);
  } catch {
    return false;
  }
}
