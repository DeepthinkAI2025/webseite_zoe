import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Frankfurt – Planung & Montage',
  description: 'PV & Speicher Frankfurt: Wirtschaftlichkeitsanalyse, Netzbetreiber Koordination & Monitoring Übergabe.',
  canonicalPath: '/standorte/frankfurt'
});

export default function FrankfurtStandortPage(){
  const usp = ['Schnelle Machbarkeitsanalyse', 'Ertrags-/Last Szenarien', 'Dokumentierte Qualitätsprozesse', 'Monitoring & Performance KPI'];
  const faqs = [
    { q: 'Ertragsbandbreite?', a: 'Ca. 950–1080 kWh/kWp p.a. bei günstiger Ausrichtung.' },
    { q: 'Wirtschaftlichkeit?', a: 'Amortisation typ. 8–11 Jahre abhängig Strompreis & Speicher.' },
    { q: 'Speicher optional?', a: 'Ja – modulare Nachrüstung möglich, Start wenn Abendverbrauch >30%.' },
    { q: 'Projektdauer?', a: 'Gesamt 6–10 Wochen von Erstkontakt bis Inbetriebnahme (Variablen: Netz / Material).'}
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-standort-frankfurt" data={breadcrumbJsonLd([{ name:'Start', url:'/' },{ name:'Standorte', url:'/standorte' },{ name:'Frankfurt', url:'/standorte/frankfurt' }])} />
      <JsonLd id="ld-servicearea-frankfurt" data={cityServiceJsonLd({
        name: localBiz.name,
        url: 'https://www.zoe-solar.de/standorte/frankfurt',
        city: 'Frankfurt',
        country: localBiz.country,
        areaServed: ['Frankfurt','Rhein-Main'],
        lat: 50.110924,
        lon: 8.682127,
        serviceName: 'Photovoltaik Installation Frankfurt',
        serviceDescription: 'Planung, Installation & Monitoring von Photovoltaik und Speicherlösungen im Raum Frankfurt.'
      })} />
      <JsonLd id="ld-faq-frankfurt" data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faqs.map(f => ({'@type':'Question', name:f.q, acceptedAnswer:{'@type':'Answer', text:f.a}})) }} />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Frankfurt</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Planung, Installation & Monitoring mit Fokus auf ROI & Betriebssicherheit.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Frankfurt</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/darmstadt">Photovoltaik Darmstadt</a></li><li><a className="text-blue-600 underline" href="/standorte/wiesbaden">Photovoltaik Wiesbaden</a></li><li><a className="text-blue-600 underline" href="/standorte/kassel">Photovoltaik Kassel</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1130 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 920–1040 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Büro-/Home-Office Mischprofile → Speicher 7–10 kWh</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 5–8 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Mischung Flach- & Steildach</li></ul></div></section>
    </main>
  );
}
