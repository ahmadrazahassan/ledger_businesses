/** Public site domain (no protocol). */
export const SITE_DOMAIN = 'ledgerthebusinesses.co.uk';

/** Primary contact email shown sitewide. */
export const CONTACT_EMAIL = 'fiza.kanwal@ledgerthebusinesses.co.uk';

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Sole public social profile linked from the site (footer, About, Contact). */
export const INSTAGRAM_HREF = 'https://www.instagram.com/fiza_rana_42';

const DEFAULT_SITE_URL = `https://${SITE_DOMAIN}`;

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
