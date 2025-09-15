import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Bremen – Planung & Montage',
  description: 'PV Umsetzung Bremen: Effiziente Planung für norddeutsche Wetterbedingungen.',
  canonicalPath: '/standorte/bremen'
});

export default function BremenStandortPage(){
  const usp = ['Robuste Komponenten Auswahl', 'Verschattungsanalyse', 'Speicher & Wallbox Integration', 'Monitoring'];
  const faqs = [
    { q:'Erträge?', a:'Ca. 850–970 kWh/kWp p.a.' },
    { q:'Speicher sinnvoll?', a:'Bei >30% Abendlast oder E-Auto geplant.' },
    { q:'Optimierer Einsatz?', a:'Selektiv bei Teilverschattung.' },
    { q:'Zeit bis Inbetriebnahme?', a:'6–9 Wochen üblich.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-bremen"
        data={breadcrumbJsonLd([
          { name:'Start', url:'/' },
          { name:'Standorte', url:'/standorte' },
          { name:'Bremen', url:'/standorte/bremen' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-bremen"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url:'https://www.zoe-solar.de/standorte/bremen',
          city:'Bremen',
          country: localBiz.country,
          areaServed:['Bremen','Norddeutschland'],
          lat: 53.079296,
          lon: 8.801694,
          serviceName: 'Photovoltaik Installation Bremen',
          serviceDescription: 'PV Planung & Installation für Bremen – robuste Umsetzung für norddeutsches Klima.'
        })}
      />
      <JsonLd
        id="ld-faq-bremen"
        data={{
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Bremen</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Effiziente Planung & robuste Umsetzung für norddeutsches Klima.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Bremen</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/hamburg">Photovoltaik Hamburg</a></li><li><a className="text-blue-600 underline" href="/standorte/rostock">Photovoltaik Rostock</a></li><li><a className="text-blue-600 underline" href="/standorte/kiel">Photovoltaik Kiel</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1030 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 860–970 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Höhere Bewölkung – Speicher puffert Ertragsschwankung</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 6–9 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Ziegel Dächer, teils Gauben</li></ul></div></section>
    </main>
  );
}
