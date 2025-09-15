import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Dresden – Planung & Montage',
  description: 'PV & Speicher Dresden: Planung, Installation & Performance Tracking.',
  canonicalPath: '/standorte/dresden'
});

export default function DresdenStandortPage(){
  const usp = ['Eigenverbrauch Optimierung', 'Modulare Speicher', 'String & Verschattungsanalyse', 'Monitoring Alerts'];
  const faqs = [
    { q:'Erträge?', a:'Ca. 930–1080 kWh/kWp p.a.' },
    { q:'Speicher später?', a:'Ja – modulare Nachrüstung möglich.' },
    { q:'Montage Zeit?', a:'1–2 Tage plus Netzfreigabe.' },
    { q:'Wirtschaftlichkeit?', a:'Szenarienrechnung inklusive Autarkie & Amortisation.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-dresden"
        data={breadcrumbJsonLd([{name:'Start',url:'/'},{name:'Standorte',url:'/standorte'},{name:'Dresden',url:'/standorte/dresden'}])}
      />
      <JsonLd
        id="ld-servicearea-dresden"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url:'https://www.zoe-solar.de/standorte/dresden',
          city:'Dresden',
          country: localBiz.country,
          areaServed:['Dresden','Sachsen'],
          lat: 51.050407,
          lon: 13.737262,
          serviceName: 'Photovoltaik Installation Dresden',
          serviceDescription: 'Planung & Installation von PV & Speicher in Dresden.'
        })}
      />
      <JsonLd
        id="ld-faq-dresden"
        data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}})) }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Dresden</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Skalierbare PV & Speicher für nachhaltige Eigenversorgung.</p>
      </header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ Dresden</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/leipzig">Photovoltaik Leipzig</a></li><li><a className="text-blue-600 underline" href="/standorte/jena">Photovoltaik Jena</a></li><li><a className="text-blue-600 underline" href="/standorte/erfurt">Photovoltaik Erfurt</a></li></ul></section>
    
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700">
          <ul className="space-y-2">
            <li><strong>Globalstrahlung:</strong> 1170 kWh/m²</li>
            <li><strong>Spezifischer Ertrag:</strong> 940–1060 kWh/kWp</li>
            <li><strong>Speicher Hinweis:</strong> Guter Ertrag → Speicher erhöht Autarkie auf {'>'}50%</li>
          </ul>
          <ul className="space-y-2">
            <li><strong>Netzanschluss Ablauf:</strong> 4–7 Wochen</li>
            <li><strong>Verschattungsrisiko:</strong> low</li>
            <li><strong>Dachmix:</strong> Steildächer häufig günstig ausgerichtet</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
