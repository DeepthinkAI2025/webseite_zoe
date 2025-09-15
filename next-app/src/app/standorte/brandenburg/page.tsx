import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Brandenburg – Planung & Montage',
  description: 'Regionale Photovoltaik Lösungen für Brandenburg: Einfamilienhäuser, Landwirtschaft & Gewerbe – Planung, Installation, Speicher & Monitoring.',
  canonicalPath: '/standorte/brandenburg'
});

export default function BrandenburgStandortPage(){
  const serviceDescription = `In Brandenburg stehen häufig Dachflächen mit sehr guter Ausrichtung und freiem Horizont zur Verfügung – wir optimieren Stringdesign & Speichergröße für hohe Eigenverbrauchsquote und wirtschaftliche Amortisation.`;
  const usp = [
    'Erfahrung in ländlichen Niederspannungsnetzen',
    'Wirtschaftlichkeits- & Autarkie Optimierung',
    'Speicher Skalierung für Wärmepumpen-Integration',
    'Transparente Fördermittel Beratung'
  ];
  const faqs = [
    { q: 'Welche typische Anlagengröße in EFH Projekten?', a: 'Zwischen 8 und 15 kWp – abhängig von Jahresverbrauch (Wärmepumpe / E-Mobilität) & Dachfläche.' },
    { q: 'Lohnt sich ein Speicher?', a: 'Ja, bei hohem Abend-/Morgenverbrauch oder E-Fahrzeug; Dimensionierung anhand Lastprofil Analyse.' },
    { q: 'Benötige ich Anmeldung beim Netzbetreiber?', a: 'Ja – wir übernehmen Formulare, technische Datenblätter & Inbetriebnahmeprotokoll.' },
    { q: 'Wie schnell ist Umsetzung?', a: 'Planung & Materialdisposition meist innerhalb 2–4 Wochen, Montage 1–2 Tage.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-brandenburg"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Brandenburg', url: '/standorte/brandenburg' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-brandenburg"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/brandenburg',
          city: 'Brandenburg',
          country: localBiz.country,
          areaServed: ['Brandenburg','Brandenburg (Bundesland)'],
          lat: 52.412528,
          lon: 12.531644,
          serviceName: 'Photovoltaik Installation Brandenburg',
          serviceDescription: 'PV & Speicher Projekte in Brandenburg an der Havel und umliegenden Regionen.'
        })}
      />
      <JsonLd
        id="ld-faq-brandenburg"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Brandenburg</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">{serviceDescription}</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">Leistungen</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
          <li>Dach- & Verschattungsanalyse</li>
          <li>Modul & Wechselrichter Auslegung</li>
          <li>Speicher & Hybrid Integration</li>
          <li>Wallbox Vorbereitung & Lastmanagement</li>
          <li>Netzbetreiber Anmeldung & Zählerwesen</li>
          <li>Monitoring & Performance Tracking</li>
        </ul>
      </section>
      <section className="mt-12 bg-neutral-50 border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-2">Netzanschluss & Anmeldung</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Zeiten & Portalübersicht für Netzbetreiber Anmeldung sowie typische Unterlagen findest du hier: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. Häufige Verzögerungsgründe: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ Abschnitt</a>.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Regionale Vorteile</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Viele Dächer in Brandenburg ermöglichen hohe kWp Leistung pro kWp Invest dank geringerer Verschattung. Kombination mit Wärmepumpe & E-Mobilität steigert Eigenverbrauch und reduziert Netzbezug.</p>
        <p className="text-sm text-neutral-700 mt-4 leading-relaxed">Landwirtschaftliche Betriebe profitieren von Lastverschiebung (Kälte, Lüftung, Fütterung) und optionaler Direktvermarktung größerer Dachanlagen.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ Brandenburg</h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          {faqs.map(f => (
            <div key={f.q}>
              <dt className="font-medium">{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/berlin">Photovoltaik Berlin</a></li><li><a className="text-blue-600 underline" href="/standorte/potsdam">Photovoltaik Potsdam</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1150 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 930–1050 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Ländlich: Größere Dachflächen → Speicher 8–12 kWh</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> Bearbeitung variiert regional 4–9 Wochen</li><li><strong>Verschattungsrisiko:</strong> low</li><li><strong>Dachmix:</strong> Weitläufige Sattel-/Scheunendächer</li></ul></div></section>
    </main>
  );
}
