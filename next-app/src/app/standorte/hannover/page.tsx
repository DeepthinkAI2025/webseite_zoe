import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Hannover – Planung & Montage',
  description: 'Regionale PV Planung & Installation Hannover – optimierte Auslegung & Speicherintegration.',
  canonicalPath: '/standorte/hannover'
});

export default function HannoverStandortPage(){
  const usp = ['Effiziente Dachanalyse', 'Hybrid Speicher Optionen', 'Netzprozess Begleitung', 'Monitoring Übergabe'];
  const faqs = [
    { q:'Ertragsrange?', a:'Ca. 900–1030 kWh/kWp p.a.' },
    { q:'Speicher modular?', a:'Ja – skalierbar je nach Verbrauch.' },
    { q:'Optimierer notwendig?', a:'Nur bei Teilverschattung.' },
    { q:'Timeline?', a:'6–9 Wochen gesamt.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-hannover"
        data={breadcrumbJsonLd([
          {name:'Start',url:'/'},
          {name:'Standorte',url:'/standorte'},
          {name:'Hannover',url:'/standorte/hannover'}
        ])}
      />
      <JsonLd
        id="ld-servicearea-hannover"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url:'https://www.zoe-solar.de/standorte/hannover',
          city:'Hannover',
          country: localBiz.country,
          areaServed:['Hannover','Niedersachsen'],
          lat: 52.375892,
          lon: 9.73201,
          serviceName: 'Photovoltaik Installation Hannover',
          serviceDescription: 'PV & Speicher Lösungen für Hannover mit modularer Skalierung.'
        })}
      />
      <JsonLd
        id="ld-faq-hannover"
        data={{
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Hannover</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Solide Ertragsplanung & modulare Speicherintegration.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Hannover</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1065 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 880–995 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Wechselhafte Bewölkung → Speicher glättet Tagesprofil</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 6–9 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Reihen- & Mehrfamilienstrukturen</li></ul></div></section>
    </main>
  );
}
