const configuredOrigin = import.meta.env.PUBLIC_SITE_ORIGIN?.trim().replace(/\/$/, '');

export const siteOrigin = configuredOrigin && /^https:\/\//.test(configuredOrigin) ? configuredOrigin : undefined;

export const absoluteUrl = (path: string) => siteOrigin ? `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}` : undefined;

export const languagePaths = (pathname: string) => {
  const base = pathname.replace(/^\/(?:en|zh)(?=\/|$)/, '') || '/';
  return {
    english: `/en${base === '/' ? '' : base}`,
    chinese: `/zh${base === '/' ? '' : base}`,
    default: base,
  };
};
