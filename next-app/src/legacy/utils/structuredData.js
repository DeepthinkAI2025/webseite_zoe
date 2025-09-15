// Utilities zur Generierung von JSON-LD Snippets zentral
// Vermeidet Duplikate und erlaubt einfache Erweiterung (FAQ, Breadcrumb, Article etc.)

export function organizationLD({ origin='https://example.com' } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZOE Solar',
    url: origin,
    logo: origin + '/Logo-ZOE.png'
  };
}

export function breadcrumbLD(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item
    }))
  };
}

export function faqLD(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(q => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a }
    }))
  };
}

export function articleLD({ title, description, author='ZOE Redaktion', datePublished, dateModified, slug, origin='https://example.com', wordCount }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Person', name: author },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: origin + slug,
    wordCount,
    publisher: {
      '@type': 'Organization',
      name: 'ZOE Solar',
      logo: { '@type':'ImageObject', url: origin + '/Logo-ZOE.png' }
    }
  };
}

export function pillarServiceLD({ name, description, area='DE', origin='https://example.com' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'Organization', name: 'ZOE Solar', logo: origin + '/Logo-ZOE.png' },
    areaServed: area,
    serviceType: name
  };
}

export function howToLD({ name, steps }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((s,i) => ({ '@type': 'HowToStep', position: i+1, name: s.name, text: s.text }))
  };
}

export function personLD({ name, title, sameAs=[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name, jobTitle: title,
    sameAs
  };
}

// Hreflang Helper
// strategy:
//  - 'prefix' (default): erzeugt /{lng}{path} also /en/blog, /fr/blog etc.
//  - 'same': verwendet denselben Pfad (wenn Content sprach-dynamisch auf einer URL gerendert wird)
//  - custom builder function: (lng, path) => string
export function buildHreflang({ origin='https://zoe-solar.de', path='/', locales=['de','en','fr','es'], strategy='prefix', build }) {
  const base = origin.replace(/\/$/,'');
  const normPath = path.startsWith('/') ? path : `/${path}`;
  const makeHref = (lng) => {
    if (typeof build === 'function') return base + build(lng, normPath);
    if (strategy === 'same') return base + normPath;
    if (strategy === 'prefix') return base + `/${lng}${normPath}`.replace(/\/+/, '/');
    // fallback: same
    return base + normPath;
  };
  const tags = locales.map(l => ({ rel: 'alternate', hrefLang: l, href: makeHref(l) }));
  tags.push({ rel: 'alternate', hrefLang: 'x-default', href: base + normPath });
  return tags;
}
