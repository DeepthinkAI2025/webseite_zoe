import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Nürnberg – Planung & Montage',
  description: 'PV Umsetzung in Nürnberg: Planung, Installation, Speicher & Monitoring.',
  canonicalPath: '/standorte/nuernberg'
});

export default function NuernbergStandortPage(){
  const usp = ['Lokale Strahlungsdaten Nutzung', 'String Design Optimierung', 'Hybrid Speicher', 'Qualitätsprotokolle'];
  const faqs = [
    { q:'Erträge?', a:'Ca. 930–1080 kWh/kWp p.a.' },
    { q:'Speicher ja/nein?', a:'Economics abhängig Lastprofil – Szenarienanalyse.' },
    { q:'Montage Dauer?', a:'1–2 Tage Standard.' },
    { q:'Netzprozess?', a:'Unterstützung inkl. Unterlagen.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-nuernberg"
        data={breadcrumbJsonLd([
          {name:'Start',url:'/'},{name:'Standorte',url:'/standorte'},{name:'Nürnberg',url:'/standorte/nuernberg'}
        ])}
      />
      <JsonLd
        id="ld-servicearea-nuernberg"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/nuernberg',
          city: 'Nürnberg',
            country: localBiz.country,
          areaServed: ['Nürnberg','Franken'],
          lat: 49.452103,
          lon: 11.076665,
          serviceName: 'Photovoltaik Installation Nürnberg',
          serviceDescription: 'Planung & Installation wirtschaftlicher PV & Speicher Systeme in Nürnberg.'
        })}
      />
      <JsonLd
        id="ld-faq-nuernberg"
        data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}})) }}
      />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Nürnberg</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Wirtschaftliche PV & Speicherlösungen mit dokumentierter Qualität.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Nürnberg</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1160 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 935–1060 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Solide Einstrahlung – Speicher 7–9 kWh</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 4–6 Wochen</li><li><strong>Verschattungsrisiko:</strong> low</li><li><strong>Dachmix:</strong> Steildächer überwiegend frei</li></ul></div></section>
    </main>
  );
}
