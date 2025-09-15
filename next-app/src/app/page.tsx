import React from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { LandingContent } from './_components/LandingContent';
import { StickyCtaBar } from '@/components/conversion/StickyCtaBar';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik & Energie Zukunft',
  description: 'ZOE Solar – Planung, Lieferung & Montage von Photovoltaik-Anlagen inkl. Speicher & Wallbox. Festpreise, Effizienz & Transparenz.',
  canonicalPath: '/'
});

export const dynamic = 'force-static';

const PROCESS_STEPS = [
  { t: 'Anlagen-Screening', d: 'Dachdaten, Verbrauch & erste Wirtschaftlichkeit.' },
  { t: 'Technische Planung', d: 'String Design, Speicher & Ertragsszenarien.' },
  { t: 'Festpreis Angebot', d: 'Transparente Aufschlüsselung inkl. Komponenten.' },
  { t: 'Netz & Material', d: 'Anträge & Material-Logistik.' },
  { t: 'Montage & Elektrik', d: 'Installation & Abnahme.' },
  { t: 'Übergabe & Monitoring', d: 'Dashboard & Optimierung.' }
];

export default function Home() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Wie schnell kann installiert werden?', acceptedAnswer:{ '@type':'Answer', text:'Standardprojekte 6–10 Wochen (Netzbetreiber abhängig). Vorprüfung & Netzprozess teilweise parallel.' }},
      { '@type': 'Question', name: 'Speicher jetzt oder später?', acceptedAnswer:{ '@type':'Answer', text:'Abendlast / Wärmepumpe / EV -> direkt; sonst modular nachrüstbar mit Szenario-Modell.' }},
      { '@type': 'Question', name: 'Welche Förderungen 2025?', acceptedAnswer:{ '@type':'Answer', text:'Nullsteuer + regionale Speicherprogramme + evtl. KfW – strukturierte Wirtschaftlichkeitsprüfung.' }},
      { '@type': 'Question', name: 'Qualitätssicherung?', acceptedAnswer:{ '@type':'Answer', text:'Checklisten, Messprotokolle & Monitoring senken Fehlerkosten und sichern Erträge.' }}
    ]
  };
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Photovoltaik Projekt Ablauf',
    step: PROCESS_STEPS.map((s,i) => ({ '@type': 'HowToStep', position: i+1, name: s.t, text: s.d }))
  };
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Photovoltaik Planung & Installation',
    areaServed: ['Berlin','Brandenburg','Sachsen'],
    provider: { '@type':'Organization', name:'ZOE Solar' },
    offers: { '@type':'Offer', availability: 'https://schema.org/InStock', priceCurrency:'EUR', priceSpecification: { '@type':'PriceSpecification', price: '0', priceCurrency:'EUR' }, price:'0', description:'Kostenfreie Erst-Analyse (Ertrags- & Wirtschaftlichkeitsmodell)' }
  };
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'PV Komplettanlage (Individuelle Auslegung)',
    brand: { '@type':'Brand', name:'ZOE Solar' },
    description: 'Individuell geplante Photovoltaik-Anlage inkl. Montage, Dokumentation & Monitoring Onboarding.',
    offers: { '@type':'AggregateOffer', priceCurrency:'EUR', lowPrice:'6000', highPrice:'24000', offerCount: '3' },
    aggregateRating: { '@type':'AggregateRating', ratingValue:'4.9', reviewCount:'37' }
  };
  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type':'ListItem', position:1, item:{ '@type':'Review', author:{'@type':'Person', name:'M. Schneider'}, reviewBody:'Simulation & Angebot innerhalb weniger Tage – Montage im Zeitfenster.', reviewRating:{ '@type':'Rating', ratingValue:'5' } } },
      { '@type':'ListItem', position:2, item:{ '@type':'Review', author:{'@type':'Person', name:'L. Fischer'}, reviewBody:'Phasenweise Speicher-Dimensionierung spart Invest & passt Lastprofil an.', reviewRating:{ '@type':'Rating', ratingValue:'5' } } }
    ]
  };

  return (
    <>
  <JsonLd id="ld-breadcrumb" data={breadcrumbJsonLd([{ name: 'Home', url: '/' }])} />
  <JsonLd id="ld-faq" data={faqJsonLd} />
  <JsonLd id="ld-howto" data={howToJsonLd} />
  <JsonLd id="ld-service" data={serviceJsonLd} />
  <JsonLd id="ld-product" data={productJsonLd} />
  <JsonLd id="ld-reviews" data={reviewJsonLd} />
      <main className="row-start-2 w-full">
        <LandingContent />
      </main>
      <StickyCtaBar />
      <footer className="row-start-3 flex flex-col md:flex-row gap-6 md:gap-[32px] flex-wrap items-center justify-center text-sm py-10 px-6 bg-neutral-50 dark:bg-neutral-900 w-full">
        <div className="text-neutral-600 dark:text-neutral-400">© {new Date().getFullYear()} ZOE Solar</div>
        <nav aria-label="Footer Navigation" className="flex gap-4 text-neutral-600 dark:text-neutral-400 flex-wrap justify-center">
          <a href="/pricing" className="hover:underline">Preise</a>
          <a href="/projects" className="hover:underline">Projekte</a>
          <a href="/standorte" className="hover:underline">Standorte</a>
          <a href="/privacy" className="hover:underline">Datenschutz</a>
          <a href="/contact" className="hover:underline">Kontakt</a>
        </nav>
      </footer>
    </>
  );
}
