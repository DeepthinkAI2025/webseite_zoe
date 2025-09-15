import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Stuttgart – Planung & Montage',
  description: 'Regionale PV Umsetzung in Stuttgart: Hanglagen, Teilverschattung & Speicheroptimierung.',
  canonicalPath: '/standorte/stuttgart'
});

export default function StuttgartStandortPage(){
  const usp = ['String Design für Hanglagen', 'Verschattungsanalyse & Optimierer nur wo nötig', 'Hybrid Speicher Integration', 'Monitoring & KPI Tracking'];
  const faqs = [
    { q: 'Erträge Stuttgart?', a: 'Ca. 930–1070 kWh/kWp p.a. bei geeigneter Dachausrichtung.' },
    { q: 'Optimierer Pflicht?', a: 'Nur bei komplexen Teilverschattungen – selektiv einsetzen.' },
    { q: 'Speicher Nutzen?', a: 'Erhöhte Eigenverbrauchsquote & Backup (optional) – modulare Skalierung.' },
    { q: 'Timeline?', a: 'Planung bis Übergabe 6–10 Wochen typische Spanne.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-stuttgart"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Stuttgart', url: '/standorte/stuttgart' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-stuttgart"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/stuttgart',
          city: 'Stuttgart',
          country: localBiz.country,
          areaServed: ['Stuttgart','Baden-Württemberg'],
          lat: 48.775846,
          lon: 9.182932,
          serviceName: 'Photovoltaik Installation Stuttgart',
          serviceDescription: 'Planung & Installation von PV Systemen für Stuttgart – Hanglagen & Teilverschattung optimiert.'
        })}
      />
      <JsonLd
        id="ld-faq-stuttgart"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Stuttgart</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Effiziente Planung für variable Dachgeometrien & Hanglagen.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Stuttgart</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/karlsruhe">Photovoltaik Karlsruhe</a></li><li><a className="text-blue-600 underline" href="/standorte/mannheim">Photovoltaik Mannheim</a></li><li><a className="text-blue-600 underline" href="/standorte/ulm">Photovoltaik Ulm</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1180 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 940–1070 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Hoher Eigenverbrauch durch E-Mobilitätspotenzial</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 4–7 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Hanglagen & differenzierte Dachneigungen</li></ul></div></section>
    </main>
  );
}
