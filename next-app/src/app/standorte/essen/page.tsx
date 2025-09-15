import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Essen – Planung & Montage',
  description: 'PV Umsetzung Essen: Urban geeichte String Planung & Speicherintegration.',
  canonicalPath: '/standorte/essen'
});

export default function EssenStandortPage(){
  const usp = ['String Optimierung Mischverschattung', 'Modulare Speicher', 'Netzprozess & Dokumentation', 'Monitoring KPI'];
  const faqs = [
    { q:'Ertragsrange?', a:'Ca. 900–1020 kWh/kWp p.a.' },
    { q:'Speicher Entscheidung?', a:'Lastprofil & Szenarienberechnung.' },
    { q:'Installationszeit?', a:'1–2 Tage.' },
    { q:'Regulatorik?', a:'Unterstützung Förder-/Mehrwertsteuer Aspekte.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-essen"
        data={breadcrumbJsonLd([
          {name:'Start',url:'/'},
          {name:'Standorte',url:'/standorte'},
          {name:'Essen',url:'/standorte/essen'}
        ])}
      />
      <JsonLd
        id="ld-servicearea-essen"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url:'https://www.zoe-solar.de/standorte/essen',
          city:'Essen',
          country: localBiz.country,
          areaServed:['Essen','Ruhrgebiet'],
          lat: 51.455643,
          lon: 7.011555,
          serviceName: 'Photovoltaik Installation Essen',
          serviceDescription: 'PV Planung & Installation in Essen – urbane Dächer & Mischverschattung optimiert.'
        })}
      />
      <JsonLd
        id="ld-faq-essen"
        data={{
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Essen</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Effiziente PV & Speicherlösungen für urbane Dächer.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Essen</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/dortmund">Photovoltaik Dortmund</a></li><li><a className="text-blue-600 underline" href="/standorte/duesseldorf">Photovoltaik Duesseldorf</a></li><li><a className="text-blue-600 underline" href="/standorte/koeln">Photovoltaik Koeln</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1080 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 890–1000 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Lastverschiebung wegen Berufspendlern</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 6–9 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Dichte Bebauung, Gauben</li></ul></div></section>
    </main>
  );
}
