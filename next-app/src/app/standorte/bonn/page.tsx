import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Bonn – Planung & Montage',
  description: 'PV Umsetzung Bonn: Planung, Installation, Speicher & Monitoring Übergabe.',
  canonicalPath: '/standorte/bonn'
});

export default function BonnStandortPage(){
  const usp = ['String Layout Optimierung', 'Speicher Wirtschaftlichkeit', 'Netzprozess Dokumentation', 'Monitoring Alerts'];
  const faqs = [
    { q:'Erträge?', a:'Ca. 920–1050 kWh/kWp p.a.' },
    { q:'Speicher Pflicht?', a:'Optional, abhängig Verbrauchsverteilung.' },
    { q:'Dauer?', a:'6–9 Wochen Gesamtprojekt.' },
    { q:'Qualitätssicherung?', a:'Checklisten & Messprotokolle.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-bonn"
        data={breadcrumbJsonLd([
          {name:'Start',url:'/'},
          {name:'Standorte',url:'/standorte'},
          {name:'Bonn',url:'/standorte/bonn'}
        ])}
      />
      <JsonLd
        id="ld-servicearea-bonn"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/bonn',
          city: 'Bonn',
          country: localBiz.country,
          areaServed: ['Bonn','Nordrhein-Westfalen'],
          lat: 50.73743,
          lon: 7.098206,
          serviceName: 'Photovoltaik Installation Bonn',
          serviceDescription: 'PV Komplettservice & Speicher in Bonn.'
        })}
      />
      <JsonLd
        id="ld-faq-bonn"
        data={{
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Bonn</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Modulare PV & Speicherlösungen mit Fokus auf Eigenverbrauch.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Bonn</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/koeln">Photovoltaik Koeln</a></li><li><a className="text-blue-600 underline" href="/standorte/duesseldorf">Photovoltaik Duesseldorf</a></li><li><a className="text-blue-600 underline" href="/standorte/essen">Photovoltaik Essen</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1100 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 900–1010 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Pendler + Abendlast → Speicher 7 kWh</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 5–8 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Steildächer mit Gaubenanteil</li></ul></div></section>
    </main>
  );
}
