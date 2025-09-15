import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Düsseldorf – Planung & Montage',
  description: 'PV Systeme Düsseldorf: Effiziente Planung, Speicherintegration & dokumentierte Qualitätsprozesse.',
  canonicalPath: '/standorte/duesseldorf'
});

export default function DuesseldorfStandortPage(){
  const usp = ['Stadtnahe Dachoptimierung', 'Last-/Ertragsszenarien', 'Hybrid Speicher & Wallbox Vorbereitung', 'Monitoring & Performance Alerts'];
  const faqs = [
    { q: 'Erträge Düsseldorf?', a: 'Etwa 920–1050 kWh/kWp p.a. Dachabhängig.' },
    { q: 'Speicher direkt?', a: 'Bei höherem Abendverbrauch sinnvoll – sonst modulare Nachrüstung.' },
    { q: 'Montage Fenster?', a: '1–2 Tage Standardanlage.' },
    { q: 'Netzprozess?', a: 'Begleitung inkl. Unterlagen & Inbetriebnahme Protokoll.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-duesseldorf"
        data={breadcrumbJsonLd([
          { name:'Start', url:'/' },
          { name:'Standorte', url:'/standorte' },
          { name:'Düsseldorf', url:'/standorte/duesseldorf' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-duesseldorf"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/duesseldorf',
          city: 'Düsseldorf',
          country: localBiz.country,
          areaServed: ['Düsseldorf','NRW'],
          lat: 51.227741,
          lon: 6.773456,
          serviceName: 'Photovoltaik Installation Düsseldorf',
          serviceDescription: 'Planung & Umsetzung skalierbarer PV & Speicher Systeme in Düsseldorf.'
        })}
      />
      <JsonLd
        id="ld-faq-duesseldorf"
        data={{
          '@context':'https://schema.org',
          '@type':'FAQPage',
          mainEntity: faqs.map(f => ({'@type':'Question', name:f.q, acceptedAnswer:{'@type':'Answer', text:f.a}}))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Düsseldorf</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Skalierbare PV & Speicherlösungen für nachhaltige Eigenversorgung.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Düsseldorf</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/koeln">Photovoltaik Koeln</a></li><li><a className="text-blue-600 underline" href="/standorte/essen">Photovoltaik Essen</a></li><li><a className="text-blue-600 underline" href="/standorte/bonn">Photovoltaik Bonn</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1100 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 900–1020 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Abendlast & Wärmepumpen-Trend → Speicher sinnvoll</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 5–8 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Reihenstruktur, mittlere Verschattung</li></ul></div></section>
    </main>
  );
}
