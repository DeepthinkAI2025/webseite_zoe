import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Leipzig – Planung & Montage',
  description: 'Skalierbare Photovoltaik Lösungen für Leipzig: Stadtnahe Dächer, Gewerbe & Hybrid Speicher – Planung, Installation & Monitoring.',
  canonicalPath: '/standorte/leipzig'
});

export default function LeipzigStandortPage(){
  const usp = [
    'Optimierte Lösungen für urbane Dachformen',
    'Hybrid Speicher & Lastmanagement',
    'Schnelle Projektanbahnung & Netzprozess',
    'Monitoring mit Performance Kennzahlen'
  ];
  const faqs = [
    { q: 'Ab wann lohnt sich eine PV Anlage?', a: 'Bereits ab ~3.000 kWh Jahresverbrauch, höherer Nutzen mit E-Mobilität oder Wärmepumpe.' },
    { q: 'Welche Ertragsprognose ist realistisch?', a: 'Standort- & dachabhängig typ. 900–1050 kWh/kWp p.a. bei passender Ausrichtung.' },
    { q: 'Kann ich später erweitern?', a: 'Ja – Skalierung über zusätzliche Strings / Speichererweiterung möglich (planerische Reserven berücksichtigen).'},
    { q: 'Wie lange dauert Montage?', a: '1–2 Tage für typische Residential Systeme, plus Netzbetreiber Freigabe.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-leipzig"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Leipzig', url: '/standorte/leipzig' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-leipzig"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/leipzig',
          city: 'Leipzig',
          country: localBiz.country,
          areaServed: ['Leipzig','Sachsen'],
          lat: 51.339695,
          lon: 12.373075,
          serviceName: 'Photovoltaik Installation Leipzig',
          serviceDescription: 'Skalierbare Photovoltaik & Speicherlösungen für Leipzig.'
        })}
      />
      <JsonLd
        id="ld-faq-leipzig"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Leipzig</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Skalierbare PV & Speicherlösungen für nachhaltige Eigenversorgung und planbare Amortisation.</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">USP</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ Leipzig</h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          {faqs.map(f => (
            <div key={f.q}>
              <dt className="font-medium">{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/dresden">Photovoltaik Dresden</a></li><li><a className="text-blue-600 underline" href="/standorte/jena">Photovoltaik Jena</a></li><li><a className="text-blue-600 underline" href="/standorte/magdeburg">Photovoltaik Magdeburg</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1120 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 900–1030 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Stetige Grundlast → Speicher 6–8 kWh</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> 5–8 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Altbau + Neubau Mischstruktur</li></ul></div></section>
    </main>
  );
}
