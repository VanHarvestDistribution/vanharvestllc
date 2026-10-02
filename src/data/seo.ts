const defaultSiteOrigin = 'https://www.vanharvestllc.com';

const configuredOrigin = import.meta.env.PUBLIC_SITE_ORIGIN?.trim().replace(/\/$/, '');

export const siteOrigin = configuredOrigin && /^https:\/\//.test(configuredOrigin) ? configuredOrigin : defaultSiteOrigin;

export const ensureTrailingSlash = (path: string) => {
  if (!path || path === '/') return '/';
  const clean = path.split('?')[0].split('#')[0];
  const trailing = clean.endsWith('/') ? clean : `${clean}/`;
  const query = path.includes('?') ? `?${path.split('?')[1].split('#')[0]}` : '';
  const hash = path.includes('#') ? `#${path.split('#')[1]}` : '';
  return `${trailing}${query}${hash}`;
};

export const absoluteUrl = (path: string) => {
  if (!siteOrigin) return undefined;
  const normalized = ensureTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  return `${siteOrigin}${normalized}`;
};

export const languagePaths = (pathname: string) => {
  const normalized = ensureTrailingSlash(pathname);
  const base = normalized.replace(/^\/zh(?=\/|$)/, '') || '/';
  const cleanBase = ensureTrailingSlash(base);
  return {
    english: cleanBase,
    chinese: ensureTrailingSlash(`/zh${cleanBase === '/' ? '' : cleanBase}`),
    default: cleanBase,
  };
};
