const DEFAULT_SITE_URL = 'https://ledgerbusinesses.com';

function normalizeSiteUrl(url?: string) {
  if (!url) return DEFAULT_SITE_URL;
  const trimmed = url.trim();
  if (!trimmed) return DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function toAbsoluteUrl(path: string) {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
