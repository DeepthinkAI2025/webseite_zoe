import { SITE_NAME, SITE_URL, ORG } from './constants';

export interface OrganizationExtOptions { sameAsExtra?: string[]; foundingDate?: string; duns?: string; vatID?: string; iso6523Code?: string; }
export function organizationJsonLd(opts: OrganizationExtOptions = {}) {
  const sameAs = [
    'https://www.linkedin.com/company/zoe-solar/',
    'https://www.facebook.com/zoesolar',
    'https://www.instagram.com/zoe.solar/',
    'https://www.xing.com/pages/zoe-solar',
    'https://github.com/zoe-solar',
    ...(opts.sameAsExtra || [])
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE_URL + '#organization',
    name: ORG.brand,
    legalName: ORG.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs,
    contactPoint: [{
      '@type': 'ContactPoint',
      email: ORG.email,
      telephone: ORG.phone,
      contactType: 'customer service',
      areaServed: 'DE'
    }],
    foundingDate: opts.foundingDate,
    duns: opts.duns,
    vatID: opts.vatID,
    iso6523Code: opts.iso6523Code,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.streetAddress,
      postalCode: ORG.address.postalCode,
      addressLocality: ORG.address.addressLocality,
      addressCountry: ORG.address.addressCountry
    }
  };
}

// Person / Expertenprofil (E-E-A-T)
export interface PersonProfileInput { name: string; jobTitle?: string; sameAs?: string[]; image?: string; knowsAbout?: string[]; description?: string; credentials?: string[]; }
export function personJsonLd(p: PersonProfileInput){
  const base: any = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    description: p.description,
    jobTitle: p.jobTitle,
    image: p.image,
    worksFor: { '@id': SITE_URL + '#organization' },
    knowsAbout: p.knowsAbout,
    sameAs: p.sameAs,
    hasCredential: p.credentials?.map(c => ({ '@type': 'EducationalOccupationalCredential', name: c }))
  };
  Object.keys(base).forEach(k => base[k] == null && delete base[k]);
  return base;
}

// Service Schema (Photovoltaik Planung, Installation etc.)
export interface ServiceInput { name: string; description?: string; areaServed?: string[]; serviceType?: string; providerMobility?: string; termsUrl?: string; }
export function serviceJsonLd(s: ServiceInput){
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    areaServed: s.areaServed?.map(a => ({ '@type': 'AdministrativeArea', name: a })),
    serviceType: s.serviceType,
    provider: { '@id': SITE_URL + '#organization' },
    providerMobility: s.providerMobility,
    termsOfService: s.termsUrl
  };
}

// Product Schema (PV Paket / Speicher Bundle)
export interface ProductInput { name: string; description?: string; sku?: string; mpn?: string; brand?: string; model?: string; capacityKwp?: number; storageKwh?: number; image?: string; }
export function productJsonLd(p: ProductInput){
  const props: any[] = [];
  if (p.capacityKwp) props.push({ '@type':'PropertyValue', name:'Capacity kWp', value: p.capacityKwp });
  if (p.storageKwh) props.push({ '@type':'PropertyValue', name:'Storage kWh', value: p.storageKwh });
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    sku: p.sku,
    mpn: p.mpn,
    brand: p.brand ? { '@type':'Brand', name: p.brand } : undefined,
    model: p.model,
    image: p.image,
    additionalProperty: props
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_URL + '#website',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url
    }))
  };
}

export interface OfferBundleInput {
  id: string;
  title: string;
  price: string;            // z.B. "€8.900" (wird bereinigt)
  minPrice?: string;        // optional (Range)
  maxPrice?: string;        // optional (Range)
  capacityKwp?: number;     // Photovoltaik Leistung
  paybackYears?: number;    // Amortisationsdauer
  warrantyYears?: number;   // Garantie auf Hauptkomponenten
  category?: string;        // Kategorie (z.B. "Residential", "Commercial")
  description?: string;     // Kurzbeschreibung
  efficiencyClass?: string; // Energieeffizienzklasse (z.B. A+, A, B)
}

export function offersJsonLd(bundles: OfferBundleInput[]) {
  const offers = bundles.map((b, idx) => {
    const numeric = (val?: string) => val ? val.replace(/[^0-9.]/g, '') : undefined;
    const priceNumber = numeric(b.price);
    const minPrice = numeric(b.minPrice);
    const maxPrice = numeric(b.maxPrice);

  interface PriceSpec { [k: string]: string | number | undefined; '@type': string; priceCurrency: string; price?: string; minPrice?: string; maxPrice?: string }
  const priceSpec: PriceSpec = {
      '@type': 'PriceSpecification',
      priceCurrency: 'EUR'
    };
    if (priceNumber) priceSpec.price = priceNumber;
    if (minPrice) priceSpec.minPrice = minPrice;
    if (maxPrice) priceSpec.maxPrice = maxPrice;

    return {
      '@type': 'Offer',
      position: idx + 1,
      sku: b.id,
      itemOffered: {
        '@type': 'Product',
        name: b.title,
        category: b.category,
        description: b.description,
        additionalProperty: [
          b.capacityKwp ? { '@type': 'PropertyValue', name: 'Capacity kWp', value: b.capacityKwp } : null,
          b.paybackYears ? { '@type': 'PropertyValue', name: 'Payback Years', value: b.paybackYears } : null,
          b.warrantyYears ? { '@type': 'PropertyValue', name: 'Warranty Years', value: b.warrantyYears } : null,
          b.efficiencyClass ? { '@type': 'PropertyValue', name: 'Energy Efficiency Class', value: b.efficiencyClass } : null
        ].filter(Boolean)
      },
      priceSpecification: priceSpec,
      warranty: b.warrantyYears ? {
        '@type': 'WarrantyPromise',
        durationOfWarranty: `P${b.warrantyYears}Y`
      } : undefined
    };
  });

  // AggregateOffer (nur wenn min/max Preise vorhanden)
  interface AggregateOffer { [k:string]: string | number; '@type': string; priceCurrency: string; lowPrice: string; highPrice: string; offerCount: number }
  let aggregateOffer: AggregateOffer | undefined = undefined;
  const numericPrices = bundles.map(b => Number((b.price || '').replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
  if (numericPrices.length) {
    const min = Math.min(...numericPrices);
    const max = Math.max(...numericPrices);
    aggregateOffer = {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: String(min),
      highPrice: String(max),
      offerCount: offers.length
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Solar Pakete',
    numberOfItems: offers.length,
    offers: aggregateOffer,
    itemListElement: offers
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(it => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.a
      }
    }))
  };
}

interface LocalBusinessOptions {
  name: string;
  url: string;
  email?: string;
  phone?: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  openingHours?: string[]; // e.g. ["Mo-Fr 09:00-18:00", "Sa 10:00-14:00"]
  latitude?: number;
  longitude?: number;
  priceRange?: string;
  sameAs?: string[];
  areaServed?: string[]; // e.g. list of states / regions
}

/**
 * @deprecated Ersetzt durch cityServiceJsonLd (Service + ServiceAreaBusiness Kombination)
 * Beibehalten für rückwärtskompatible Nutzung einzelner Legacy Pages / Tests.
 */
export function localBusinessJsonLd(opts: LocalBusinessOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': opts.url + '#localbusiness',
    name: opts.name,
    url: opts.url,
    email: opts.email,
    telephone: opts.phone,
    priceRange: opts.priceRange,
    parentOrganization: { '@id': SITE_URL + '#organization' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: opts.street,
      postalCode: opts.postalCode,
      addressLocality: opts.city,
      addressCountry: opts.country
    },
    openingHours: opts.openingHours,
    geo: opts.latitude && opts.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: opts.latitude,
      longitude: opts.longitude
    } : undefined,
    sameAs: opts.sameAs,
    areaServed: opts.areaServed?.map(r => ({ '@type': 'AdministrativeArea', name: r }))
  };
}

// ServiceAreaBusiness Wrapper für Städte (vermeidet mehrfach identische Adresse bei reinem Servicegebiet)
export interface CityServiceInput {
  name: string; url: string; city: string; region?: string; country: string; areaServed?: string[]; lat?: number; lon?: number; serviceName?: string; serviceDescription?: string;
}
export function cityServiceJsonLd(c: CityServiceInput){
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: c.serviceName || 'Photovoltaik Planung & Installation',
      description: c.serviceDescription || 'Planung, Auslegung, Montage & Netzkoordination für PV & Speicher Systeme.',
      areaServed: [...new Set([c.city, ...(c.areaServed||[])])].map(n => ({ '@type':'AdministrativeArea', name: n })),
      provider: { '@id': SITE_URL + '#organization' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ServiceAreaBusiness',
      name: `${c.name} – Servicegebiet ${c.city}`,
      url: c.url,
      areaServed: [...new Set([c.city, ...(c.areaServed||[])])].map(n => ({ '@type':'AdministrativeArea', name: n })),
      parentOrganization: { '@id': SITE_URL + '#organization' },
      geo: (c.lat && c.lon) ? { '@type':'GeoCoordinates', latitude: c.lat, longitude: c.lon } : undefined
    }
  ];
}

// HowTo Schema für Prozessdarstellungen (z.B. Ablauf Angebot → Installation)
export interface HowToStepInput { name: string; text: string; url?: string }
export function howToJsonLd({ name, steps, description }: { name: string; description?: string; steps: HowToStepInput[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: s.url
    }))
  };
}

// Google Business Profile / Place Schema Helper
export interface GbpInput {
  name: string; url: string; mapUrl?: string; placeId?: string; categories?: string[]; aggregateRating?: { ratingValue: number; reviewCount: number };
  street?: string; postalCode?: string; city?: string; country?: string; phone?: string; }
export function googleBusinessProfileJsonLd(g: GbpInput){
  const base: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: g.name,
    url: g.url,
    '@id': g.placeId ? g.url + '#place' : undefined,
    hasMap: g.mapUrl,
    telephone: g.phone,
    address: g.street ? {
      '@type': 'PostalAddress',
      streetAddress: g.street,
      postalCode: g.postalCode,
      addressLocality: g.city,
      addressCountry: g.country
    }: undefined,
    aggregateRating: g.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: g.aggregateRating.ratingValue,
      reviewCount: g.aggregateRating.reviewCount
    } : undefined,
    category: g.categories
  };
  Object.keys(base).forEach(k => base[k] == null && delete base[k]);
  return base;
}
