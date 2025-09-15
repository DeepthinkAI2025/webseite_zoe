import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Potsdam – Planung & Montage',
  description: 'PV Lösungen für Potsdam: Effiziente Dachflächennutzung, Speicherintegration & Netzbetreiber Abstimmung für nachhaltige Eigenversorgung.',
  canonicalPath: '/standorte/potsdam'
});

export default function PotsdamStandortPage(){
  const usp = [
    'Optimierung für begrenzte Dachflächen',
    'Hybrid Speicher für abendliche Lastspitzen',
    'Saubere Dokumentation & Netzmeldung',
    'Monitoring & Performance Auswertung'
  ];
  const faqs = [
    { q: 'Welche typische kWp Größe?', a: 'In vielen EFH Projekten 7–12 kWp – Abhängig von Dachausrichtung & Jahresverbrauch.' },
    { q: 'Sind Optimierer nötig?', a: 'Nur bei relevanter Teilverschattung oder komplexen Modulfeldern – sonst vermeidbare Komplexität.' },
    { q: 'Speicher Dimensionierung?', a: 'Meist 1–1.2 kWh pro 1000 kWh Jahresverbrauch als Startwert, Feintuning nach Lastprofil.' },
    { q: 'Wie schnell Umsetzung?', a: 'Material & Planung i.d.R. 2–3 Wochen, Montage 1–2 Tage.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-potsdam"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Potsdam', url: '/standorte/potsdam' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-potsdam"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/potsdam',
          city: 'Potsdam',
          country: localBiz.country,
          areaServed: ['Potsdam','Brandenburg'],
          lat: 52.390569,
          lon: 13.064473,
          serviceName: 'Photovoltaik Installation Potsdam',
          serviceDescription: 'Planung & Installation von Photovoltaik Anlagen und Speichersystemen in Potsdam & Region.'
        })}
      />
      <JsonLd
        id="ld-faq-potsdam"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Potsdam</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Effiziente Planung, modulare Speicherintegration & transparente Umsetzung für langfristig stabile Solarerträge.</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">USP</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ Potsdam</h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          {faqs.map(f => (
            <div key={f.q}>
              <dt className="font-medium">{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/berlin">Photovoltaik Berlin</a></li><li><a className="text-blue-600 underline" href="/standorte/brandenburg">Photovoltaik Brandenburg</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1140 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 920–1040 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Eigenheime mit Tageslast – 5–8 kWh Speicher oft optimal</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> Relativ zügig (3–6 Wochen)</li><li><strong>Verschattungsrisiko:</strong> low</li><li><strong>Dachmix:</strong> Sattel- & Walmdächer überwiegen</li></ul></div></section>
    </main>
  );
}
