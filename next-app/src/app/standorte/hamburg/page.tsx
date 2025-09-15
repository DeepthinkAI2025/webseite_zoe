import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Hamburg – Planung & Montage',
  description: 'PV Lösungen für Hamburg: Effiziente Nutzung begrenzter Dachflächen, Speicherintegration und Netzbetreiber Abstimmung.',
  canonicalPath: '/standorte/hamburg'
});

export default function HamburgStandortPage(){
  const usp = [
    'Optimierung bei teilverschatteten Stadtdächern',
    'Hybrid Speicher für Abend-/Morgenlast',
    'Saubere Netzbetreiber Dokumentation',
    'Monitoring & Performance Tracking'
  ];
  const faqs = [
    { q: 'Welche typische kWh Erträge?', a: 'In Hamburg ca. 850–980 kWh/kWp p.a. abhängig von Neigung & Verschattung.' },
    { q: 'Lohnt sich Speicher?', a: 'Ja bei höherem Abendverbrauch / Wärmepumpe – modulare Erweiterung möglich.' },
    { q: 'Genehmigung nötig?', a: 'Meist nein – Ausnahme bei Sonderdächern / Denkmalschutz.' },
    { q: 'Wie lange Umsetzung?', a: 'Planung & Material 2–4 Wochen, Montage 1–2 Tage.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-hamburg"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' }, { name: 'Standorte', url: '/standorte' }, { name: 'Hamburg', url: '/standorte/hamburg' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-hamburg"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/hamburg',
          city: 'Hamburg',
          country: localBiz.country,
          areaServed: ['Hamburg','Norddeutschland'],
          lat: 53.551086,
          lon: 9.993682,
          serviceName: 'Photovoltaik Installation Hamburg',
          serviceDescription: 'PV Planung & Installation für Hamburg mit Fokus auf teilverschattete Stadtdächer & Speicherintegration.'
        })}
      />
      <JsonLd
        id="ld-faq-hamburg"
        data={{
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Hamburg</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Effiziente Planung für norddeutsche Wetterbedingungen & teilverschattete Stadt- und Hinterhofdächer.</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">USP</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul>
      </section>
      <section className="mt-12 bg-neutral-50 border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-2">Netzanschluss & Anmeldung</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Bearbeitungszeiten & Prozess-Schritte für Anmeldung, Speicher & Wallbox findest du im Leitfaden: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. Häufige Verzögerungsursachen: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ Abschnitt</a>.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ Hamburg</h2>
        <dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl>
      </section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/bremen">Photovoltaik Bremen</a></li><li><a className="text-blue-600 underline" href="/standorte/luebeck">Photovoltaik Luebeck</a></li><li><a className="text-blue-600 underline" href="/standorte/kiel">Photovoltaik Kiel</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1050 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 880–990 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Wetterwechsel → Speicher glättet Erträge</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> Teilweise länger (6–10 Wochen)</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Backstein-Dächer, teils Mansard</li></ul></div></section>
    </main>
  );
}
