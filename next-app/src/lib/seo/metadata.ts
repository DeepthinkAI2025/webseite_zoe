import type { Metadata } from 'next';
import { SITE_NAME, SITE_TAGLINE, DEFAULT_OG_IMAGE, SITE_URL } from './constants';

interface MetaOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;              // relative oder absolute URL
  localizedPaths?: Record<string,string>; // z.B. { 'de-DE': '/pricing', 'en-US': '/en/pricing' }
  noIndex?: boolean;                   // index steuern
  noFollow?: boolean;                  // follow steuern
  ogImage?: string;
  ogImageAlt?: string;
  ogImageAltSuffix?: string;           // z.B. für Variation
  ogImageWidth?: number;               // Default 1200
  ogImageHeight?: number;              // Default 630
  type?: 'website' | 'article';
  publishedTime?: string; // ISO
  modifiedTime?: string; // ISO
}

function normalizeCanonical(path?: string): string {
  if (!path) return SITE_URL;
  // Absolut? -> nutzen, sonst mit Base joinen
  try {
    const u = path.startsWith('http') ? new URL(path) : new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL);
    // trailing slash entfernen außer Root
    if (u.pathname !== '/' && u.pathname.endsWith('/')) u.pathname = u.pathname.replace(/\/$/, '');
    return u.toString();
  } catch {
    return SITE_URL;
  }
}

function truncateDescription(desc: string, max = 160): string {
  if (desc.length <= max) return desc;
  const cut = desc.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

export function buildMetadata(opts: MetaOptions = {}): Metadata {
  const baseTitle = opts.title ? `${opts.title} | ${SITE_NAME}` : `${SITE_NAME} – ${SITE_TAGLINE}`;
  const rawDescription = opts.description || 'ZOE Solar – Planung, Lieferung & Montage von Photovoltaik-Anlagen inkl. Speicher & Wallbox. Festpreise, Effizienz & Transparenz.';
  const description = truncateDescription(rawDescription);
  const url = normalizeCanonical(opts.canonicalPath);
  const ogImage = opts.ogImage || DEFAULT_OG_IMAGE;
  const ogImageAltBase = opts.ogImageAlt || `${SITE_NAME} – ${SITE_TAGLINE}`;
  const ogImageAlt = opts.ogImageAltSuffix ? `${ogImageAltBase} – ${opts.ogImageAltSuffix}` : ogImageAltBase;
  const type = opts.type || 'website';
  const ogWidth = opts.ogImageWidth || 1200;
  const ogHeight = opts.ogImageHeight || 630;

  const languages = opts.localizedPaths ? Object.fromEntries(
    Object.entries(opts.localizedPaths).map(([locale, p]) => [locale, normalizeCanonical(p)])
  ) : undefined;
  return {
    title: baseTitle,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      title: baseTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, alt: ogImageAlt, width: ogWidth, height: ogHeight, type: 'image/jpeg' }],
      type,
      locale: 'de_DE',
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {})
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description,
      images: [ogImage],
      creator: '@zoe_solar',
      site: '@zoe_solar'
    },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: !(opts.noFollow) }
  };
}
