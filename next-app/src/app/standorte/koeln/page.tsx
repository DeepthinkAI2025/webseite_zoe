import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Köln – Planung & Montage',
  description: 'PV Systeme für Köln: Urbanes Lastprofil, Speicherintegration & optimierte Auslegung für Mischverschattung.',
  canonicalPath: '/standorte/koeln'
});

export default function KoelnStandortPage(){
  const usp = ['Urban Verschattungsausgleich', 'Skalierbare Speicheroptionen', 'Saubere Netzprozess Abwicklung', 'Monitoring & KPI Auswertung'];
  const faqs = [
    { q: 'Ertragsrange?', a: 'Ca. 900–1050 kWh/kWp p.a. je nach Dach & Verschattung.' },
    { q: 'Optimierer nötig?', a: 'Nur bei signifikanter Teilverschattung – sonst unnötige Komplexität.' },
    { q: 'Speicher Startgröße?', a: 'Abhängig Lastprofil – typ. 5–10 kWh Residential.' },
    { q: 'Netz Freigabe Dauer?', a: 'Variiert – 2–6 Wochen üblich, wir begleiten Dokumentation.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-koeln"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Köln', url: '/standorte/koeln' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-koeln"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/koeln',
          city: 'Köln',
          country: localBiz.country,
          areaServed: ['Köln','NRW'],
          lat: 50.937531,
          lon: 6.960279,
          serviceName: 'Photovoltaik Installation Köln',
          serviceDescription: 'Planung & Installation urban optimierter Photovoltaik Systeme in Köln inkl. Speicher & Netzprozesse.'
        })}
      />
      <JsonLd
        id="ld-faq-koeln"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Köln</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Optimierte Auslegung für urbane Dächer & Lastprofile – wirtschaftlich skalierbar.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Köln</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/duesseldorf">Photovoltaik Duesseldorf</a></li><li><a className="text-blue-600 underline" href="/standorte/bonn">Photovoltaik Bonn</a></li><li><a className="text-blue-600 underline" href="/standorte/essen">Photovoltaik Essen</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1090 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 900–1010 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Abendspitzen → 6–9 kWh Speicher gängig</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 5–8 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Reihenhaus-Strukturen, teils Verschattung</li></ul></div></section>
    </main>
  );
}
