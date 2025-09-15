import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import React from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation München – Planung & Montage',
  description: 'Hocheffiziente Photovoltaik Lösungen für München: Süddächer, Schneelast & Speicherintegration für stabile Eigenversorgung.',
  canonicalPath: '/standorte/muenchen'
});

export default function MuenchenStandortPage(){
  const usp = [
    'Schneelast & Statik Berücksichtigung',
    'Optimierung für Süddach / Ost-West Profile',
    'Hybrid Speicher & Wärmepumpen Synergien',
    'Proaktive Netzbetreiber Koordination'
  ];
  const faqs = [
    { q: 'Erträge München?', a: 'Typisch 950–1100 kWh/kWp p.a. bei geeigneter Ausrichtung und geringer Verschattung.' },
    { q: 'Speichergröße?', a: '1–1.3 kWh je 1000 kWh Verbrauch als Startwert, Feintuning nach Lastgang.' },
    { q: 'Dachneigung optimal?', a: '30–40° sehr effizient – Ost/West flacher möglich für gleichmäßigere Tagesverteilung.' },
    { q: 'Montagedauer?', a: '1–2 Tage Standard EFH System, plus Netz Freigabe.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-muenchen"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' }, { name: 'Standorte', url: '/standorte' }, { name: 'München', url: '/standorte/muenchen' }
        ])}
      />
      <JsonLd id="ld-servicearea-muenchen" data={cityServiceJsonLd({
        name: localBiz.name,
        url: 'https://www.zoe-solar.de/standorte/muenchen',
        city: 'München',
        country: localBiz.country,
        areaServed: ['Bayern'],
        lat: 48.137154,
        lon: 11.576124,
        serviceName: 'Photovoltaik Installation München',
        serviceDescription: 'Regionale Planung & Installation von PV Systemen für München inkl. Speicher & Netzkoordination.'
      })} />
      <JsonLd
        id="ld-faq-muenchen"
        data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faqs.map(f => ({ '@type':'Question', name:f.q, acceptedAnswer:{ '@type':'Answer', text:f.a } })) }}
      />
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation München</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Wirtschaftlichkeitsoptimierte PV & Speicherlösungen unter Berücksichtigung bayerischer Standortfaktoren.</p>
      </header>
      <section><h2 className="text-xl font-semibold mb-4">USP</h2><ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul></section>
      <section className="mt-12 bg-neutral-50 border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-2">Netzanschluss & Anmeldung</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Leitfaden für Bearbeitungszeiten & Zählersetzung: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. Verzögerungsfaktoren & Unterlagenliste: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ</a>.</p>
      </section>
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">FAQ München</h2><dl className="space-y-6 text-sm text-neutral-700">{faqs.map(f => (<div key={f.q}><dt className="font-medium">{f.q}</dt><dd>{f.a}</dd></div>))}</dl></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/augsburg">Photovoltaik Augsburg</a></li><li><a className="text-blue-600 underline" href="/standorte/regensburg">Photovoltaik Regensburg</a></li><li><a className="text-blue-600 underline" href="/standorte/ingolstadt">Photovoltaik Ingolstadt</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1200 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 950–1080 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Gute Strahlung – Speicher erhöht Autarkie</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> Stabil 4–7 Wochen</li><li><strong>Verschattungsrisiko:</strong> low</li><li><strong>Dachmix:</strong> Steildächer mit Südausrichtung häufig</li></ul></div></section>
    </main>
  );
}
