import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Mannheim – Planung & Montage',
  description: 'PV Lösungen Mannheim: Planung, Installation, Speicher & Monitoring.',
  canonicalPath: '/standorte/mannheim'
});

export default function MannheimStandortPage(){
  const usp = ['Hohe Eigenverbrauchsquote Fokus', 'Speicher & Lastmanagement', 'Qualitätskontrollpunkte', 'Monitoring KPI'];
  const faqs = [
    { q:'Ertragsbandbreite?', a:'Ca. 950–1100 kWh/kWp p.a.' },
    { q:'Speicher Dimension?', a:'Szenarien 1–1.2 kWh / 1000 kWh Verbrauch.' },
    { q:'Montage Dauer?', a:'1–2 Tage Systemgröße abhängig.' },
    { q:'Netzbetreiber Prozess?', a:'Unterstützung bis Inbetriebnahme.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-standort-mannheim" data={breadcrumbJsonLd([{name:'Start',url:'/'},{name:'Standorte',url:'/standorte'},{name:'Mannheim',url:'/standorte/mannheim'}])} />
      <JsonLd id="ld-servicearea-mannheim" data={cityServiceJsonLd({
        name: localBiz.name,
        url:'https://www.zoe-solar.de/standorte/mannheim',
        city:'Mannheim',
        country: localBiz.country,
        areaServed:['Mannheim','Baden-Württemberg','Rhein-Neckar'],
        lat: 49.487459,
        lon: 8.466039,
        serviceName: 'Photovoltaik Installation Mannheim',
        serviceDescription: 'Wirtschaftlichkeitsorientierte Photovoltaik & Speicher Umsetzung in Mannheim.'
      })} />
      <JsonLd id="ld-faq-mannheim" data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}})) }} />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Mannheim</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Wirtschaftlichkeitsorientierte PV Umsetzung.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Mannheim</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/heidelberg">Photovoltaik Heidelberg</a></li><li><a className="text-blue-600 underline" href="/standorte/karlsruhe">Photovoltaik Karlsruhe</a></li><li><a className="text-blue-600 underline" href="/standorte/stuttgart">Photovoltaik Stuttgart</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1190 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 950–1080 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Gute Strahlung + Gewerbe Dächer</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 4–6 Wochen</li><li><strong>Verschattungsrisiko:</strong> low</li><li><strong>Dachmix:</strong> Industrie-/Flachdächer & Wohnmix</li></ul></div></section>
    </main>
  );
}
