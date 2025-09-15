import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '../../../../content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Berlin – Planung & Montage',
  description: 'ZOE Solar in Berlin: Professionelle Planung, Installation & Wartung von Photovoltaik Anlagen inkl. Speicher & Wallbox. Regionale Expertise für nachhaltige Energie.',
  canonicalPath: '/standorte/berlin'
});

export default function BerlinStandortPage(){
  const serviceDescription = `Als regional aktiver Anbieter unterstützen wir Berliner Hausbesitzer und Gewerbe bei der effizienten Umsetzung von PV-Projekten – von der Dachanalyse über Modul- und Wechselrichterauslegung bis zur Anmeldung beim Netzbetreiber.`;
  const usp = [
    'Erfahrung mit Berliner Flachdach & Altbau Gegebenheiten',
    'Hybrid-Wechselrichter & Speicher optimiert für Urban Lastprofile',
    'Schnelle Netzbetreiber-Abstimmung & Dokumentation',
    'Monitoring & Performance Analyse (RUM + Produktionsdaten)'
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-berlin"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Berlin', url: '/standorte/berlin' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-berlin"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/berlin',
          city: 'Berlin',
          country: localBiz.country,
          areaServed: ['Berlin','Brandenburg'],
          lat: 52.520008,
          lon: 13.404954,
          serviceName: 'Photovoltaik Installation Berlin',
          serviceDescription
        })}
      />
      <JsonLd
        id="ld-faq-berlin"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { q: 'Wie lange dauert die Installation?', a: 'Typisch 1–3 Tage Montage + Vorlauf für Netzbetreiber Freigabe (abhängig von Auslastung).' },
            { q: 'Welche Dachtypen sind geeignet?', a: 'Flach-, Sattel-, Pult- und Walmdächer – entscheidend: statische Reserve & Verschattungsgrad.' },
            { q: 'Brauche ich eine Baugenehmigung?', a: 'In den meisten Fällen nein – Ausnahmen bei Denkmalschutz oder signifikanten Fassadenänderungen.' },
            { q: 'Wird die Anlage überwacht?', a: 'Ja – Produktions- & Performance Monitoring zur Früherkennung von Ertragseinbußen (RUM + Soll/Ist Vergleich).' }
          ].map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a }
          }))
        }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Berlin</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">{serviceDescription}</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">Warum ZOE Solar in Berlin?</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
          {usp.map(u => <li key={u}>{u}</li>)}
        </ul>
      </section>
      <section className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-3">Leistungen</h2>
          <ul className="text-sm space-y-2 list-disc pl-5 text-neutral-700">
            <li>Dachanalyse & Verschattungsprüfung</li>
            <li>Modul- & Wechselrichterauslegung</li>
            <li>Hybrid Speicher Integration</li>
            <li>Wallbox & Lastmanagement Vorbereitung</li>
            <li>Netzbetreiber Anmeldung & Dokumentation</li>
            <li>Monitoring & Performance Tracking</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Lokale Fokusthemen</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">Urban typische Herausforderungen wie begrenzte Dachfläche, Denkmalschutz-Aspekte und Verschattungen durch Nachbargebäude adressieren wir durch optimierte Stringplanung, leistungsstarke Halbzellenmodule und ggf. Leistungsoptimierer in Sonderfällen.</p>
          <p className="text-sm text-neutral-700 mt-4 leading-relaxed">Bei Flachdächern setzen wir auf ballastarme Unterkonstruktionen mit optimierten Neigungswinkeln für Jahresertrag & Windsog. Brandschutz- und Wartungsgassen werden projektspezifisch eingeplant.</p>
        </div>
      </section>
      <section className="mt-12 bg-neutral-50 border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-2">Netzanschluss & Anmeldung</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Details zum Ablauf der Netzbetreiber-Anmeldung, typischen Bearbeitungszeiten und Unterlagen findest du in unserem strukturierten Leitfaden: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. FAQ zur Dauer & Zählersetzung: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">siehe FAQ</a>.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ Berlin</h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          <div>
            <dt className="font-medium">Wie lange dauert die Installation?</dt>
            <dd>Typisch 1–3 Tage Montage + Vorlauf für Netzbetreiber Freigabe (abhängig von Auslastung).</dd>
          </div>
          <div>
            <dt className="font-medium">Welche Dachtypen sind geeignet?</dt>
            <dd>Flach-, Sattel-, Pult- und Walmdächer – entscheidend: statische Reserve & Verschattungsgrad.</dd>
          </div>
          <div>
            <dt className="font-medium">Brauche ich eine Baugenehmigung?</dt>
            <dd>In den meisten Fällen nein – Ausnahmen bei Denkmalschutz oder signifikanten Fassadenänderungen.</dd>
          </div>
          <div>
            <dt className="font-medium">Wird die Anlage überwacht?</dt>
            <dd>Ja – Produktions- & Performance Monitoring zur Früherkennung von Ertragseinbußen (RUM + Soll/Ist Vergleich).</dd>
          </div>
        </dl>
      </section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/potsdam">Photovoltaik Potsdam</a></li><li><a className="text-blue-600 underline" href="/standorte/brandenburg">Photovoltaik Brandenburg</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1120 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 900–1020 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Hohe Abendlast → 5–10 kWh Speicher steigert Eigenverbrauch deutlich</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> Netzbetreiber Freigabe ~4–8 Wochen</li><li><strong>Verschattungsrisiko:</strong> medium</li><li><strong>Dachmix:</strong> Flachdachanteil & Altbaudächer mit Aufbauten</li></ul></div></section>
    </main>
  );
}
