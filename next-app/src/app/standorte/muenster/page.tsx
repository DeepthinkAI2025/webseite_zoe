import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Münster – Planung & Montage',
  description: 'PV Umsetzung Münster: Planung, Installation, Speicher & Monitoring.',
  canonicalPath: '/standorte/muenster'
});

export default function MuensterStandortPage(){
  const usp = ['Dachflächenausnutzung', 'Speicher & Wallbox Vorbereitung', 'Netzprozess Support', 'KPI Monitoring'];
  const faqs = [
    { q:'Erträge?', a:'Ca. 880–1000 kWh/kWp p.a.' },
    { q:'Speicher Empfehlung?', a:'Lastprofil Analyse – modulare Nachrüstbarkeit.' },
    { q:'Montage Dauer?', a:'1–2 Tage.' },
    { q:'Wirtschaftlichkeit?', a:'Autarkie & Amortisationsszenarien bereitgestellt.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-muenster"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Münster', url: '/standorte/muenster' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-muenster"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/muenster',
          city: 'Münster',
          country: localBiz.country,
          areaServed: ['Münster','Nordrhein-Westfalen'],
          lat: 51.960665,
          lon: 7.626135,
          serviceName: 'Photovoltaik Installation Münster',
          serviceDescription: 'PV & Speicher Lösungen für Münster.'
        })}
      />
      <JsonLd
        id="ld-faq-muenster"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Münster</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Planung & Umsetzung für nachhaltige Eigenstromnutzung.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Münster</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1045 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 870–980 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Wechselhaftes Wetter – Speicher 6–8 kWh stabilisiert</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 6–9 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Reihenhäuser + Vegetation</li></ul></div></section>
    </main>
  );
}
