// Minimal GitHub client for the admin API. Every save becomes one commit on the
// production branch; Vercel deploys it automatically.
//
// Environment variables (set in Vercel):
//   GITHUB_TOKEN   fine-grained token with "Contents: Read and write" on the repo
//   GITHUB_REPO    defaults to VanHarvestDistribution/vanharvestllc
//   GITHUB_BRANCH  defaults to main
const API = 'https://api.github.com';
const repo = () => process.env.GITHUB_REPO || 'VanHarvestDistribution/vanharvestllc';
export const branch = () => process.env.GITHUB_BRANCH || 'main';

export class GitHubError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function gh(pathname, { method = 'GET', body, accept = 'application/vnd.github+json' } = {}) {
  if (!process.env.GITHUB_TOKEN) throw new GitHubError(500, 'GITHUB_TOKEN is not set');
  const res = await fetch(`${API}/repos/${repo()}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'vanharvest-admin',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new GitHubError(res.status, `GitHub ${method} ${pathname} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return accept.includes('raw') ? res.text() : res.json();
}

/** Latest commit on the branch. */
export async function getHead() {
  const ref = await gh(`/git/ref/heads/${branch()}`);
  const commit = await gh(`/git/commits/${ref.object.sha}`);
  return { sha: ref.object.sha, tree: commit.tree.sha };
}

/** File contents as text at a commit; null if the file does not exist. */
export async function readText(path, ref) {
  try {
    return await gh(`/contents/${encodeURI(path)}?ref=${ref}`, { accept: 'application/vnd.github.raw+json' });
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

/** File names directly inside a folder at a commit (no 1,000-entry limit). */
export async function listFolder(path, ref) {
  const parent = path.split('/').slice(0, -1).join('/');
  const name = path.split('/').pop();
  const entries = await gh(`/contents/${encodeURI(parent)}?ref=${ref}`);
  const folder = entries.find((entry) => entry.name === name && entry.type === 'dir');
  if (!folder) return [];
  const tree = await gh(`/git/trees/${folder.sha}`);
  return tree.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path);
}

/**
 * One commit with several file changes. `files` items: { path, content: Buffer|string } to write,
 * or { path, content: null } to delete. Returns the new commit SHA, or throws GitHubError 409
 * when the branch moved since `head` (caller retries).
 */
export async function commitFiles({ head, message, files }) {
  const entries = [];
  for (const file of files) {
    if (file.content === null) {
      entries.push({ path: file.path, mode: '100644', type: 'blob', sha: null });
      continue;
    }
    const buffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, 'utf-8');
    const blob = await gh('/git/blobs', { method: 'POST', body: { content: buffer.toString('base64'), encoding: 'base64' } });
    entries.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const tree = await gh('/git/trees', { method: 'POST', body: { base_tree: head.tree, tree: entries } });
  const commit = await gh('/git/commits', {
    method: 'POST',
    body: {
      message,
      tree: tree.sha,
      parents: [head.sha],
      author: { name: 'Van Harvest Admin', email: 'admin@vanharvestllc.com', date: new Date().toISOString() },
    },
  });
  try {
    await gh(`/git/refs/heads/${branch()}`, { method: 'PATCH', body: { sha: commit.sha, force: false } });
  } catch (error) {
    if (error.status === 422) throw new GitHubError(409, 'Branch moved; retry');
    throw error;
  }
  return commit.sha;
}
