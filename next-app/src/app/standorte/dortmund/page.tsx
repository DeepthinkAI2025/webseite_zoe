import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Dortmund – Planung & Montage',
  description: 'PV & Speicher Dortmund: Planung, Installation & Monitoring mit Qualitätssicherung.',
  canonicalPath: '/standorte/dortmund'
});

export default function DortmundStandortPage(){
  const usp = ['Verschattungsoptimierte Strings', 'Hybrid Speicher Integration', 'Netzprozess Support', 'Performance Tracking'];
  const faqs = [
    { q:'Erträge?', a:'Ca. 900–1030 kWh/kWp p.a.' },
    { q:'Speicher Timing?', a:'Direkt bei hoher Abendlast sinnvoll.' },
    { q:'Montage Fenster?', a:'1–2 Tage + Netz.' },
    { q:'Wirtschaftlichkeitsmodell?', a:'Szenarien mit Autarkie & Amortisation.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-standort-dortmund" data={breadcrumbJsonLd([{name:'Start',url:'/'},{name:'Standorte',url:'/standorte'},{name:'Dortmund',url:'/standorte/dortmund'}])} />
      <JsonLd id="ld-servicearea-dortmund" data={cityServiceJsonLd({
        name: localBiz.name,
        url:'https://www.zoe-solar.de/standorte/dortmund',
        city:'Dortmund',
        country: localBiz.country,
        areaServed:['Dortmund','Ruhrgebiet'],
        lat: 51.513587,
        lon: 7.465298,
        serviceName: 'Photovoltaik Installation Dortmund',
        serviceDescription: 'Planung & Installation skalierbarer PV & Speicher Systeme in Dortmund.'
      })} />
      <JsonLd id="ld-faq-dortmund" data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}})) }} />
      <header className="text-center mb-10"><h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Dortmund</h1><p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Skalierbare PV Lösung mit dokumentierter Qualität.</p></header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Dortmund</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/essen">Photovoltaik Essen</a></li><li><a className="text-blue-600 underline" href="/standorte/duesseldorf">Photovoltaik Duesseldorf</a></li><li><a className="text-blue-600 underline" href="/standorte/koeln">Photovoltaik Koeln</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1090 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 900–1010 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Familienprofile → Speicher 6–8 kWh</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 6–9 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Reihenhäuser mit Nachbarverschattung</li></ul></div></section>
    </main>
  );
}
