import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, cityServiceJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Kiel – Planung & Montage',
  description: 'Regionale Planung, Installation & Wartung von Photovoltaik Anlagen – angepasst an lokale Dach- & Netzbetreiber-Strukturen.',
  canonicalPath: '/standorte/kiel'
});

export default function KielStandortPage(){
  const usp = [
    'Regionale Prozess-Erfahrung',
    'Optimierte Speicher & Hybrid Wechselrichter',
    'Netzbetreiber Abstimmung & Dokumentation',
    'Monitoring & Performance Analyse'
  ];
  const faqs = [
    { q: 'Wie lange dauert die Installation?', a: 'Typisch 1–3 Tage Montage, plus Netzbetreiber Freigabe.' },
    { q: 'Welche Dachtypen sind geeignet?', a: 'Flach-, Sattel-, Pult- und weitere – Voraussetzung statische Eignung & geringe Verschattung.' },
    { q: 'Brauche ich eine Baugenehmigung?', a: 'Meist nicht – Ausnahmen bei Denkmalschutz / Sonderfällen.' }
  ];
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-standort-kiel"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' },
          { name: 'Kiel', url: '/standorte/kiel' }
        ])}
      />
      <JsonLd
        id="ld-servicearea-kiel"
        data={cityServiceJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de/standorte/kiel',
          city: 'Kiel',
          country: localBiz.country,
          areaServed: ['Kiel','Schleswig-Holstein'],
          lat: 54.323293,
          lon: 10.122765,
          serviceName: 'Photovoltaik Installation Kiel',
          serviceDescription: 'Planung & Installation von Photovoltaik & Speicher Systemen in Kiel.'
        })}
      />
      <JsonLd
        id="ld-faq-kiel"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        }}
      />
      <header className="text-center mb-10">
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Kiel</h1>
  <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Planung → Installation → Monitoring – wirtschaftlich optimiert für regionale Bedingungen.</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">Leistungen</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
          <li>Dachanalyse & Verschattung</li>
          <li>Auslegung Module & Wechselrichter</li>
          <li>Speicher & Hybrid Systeme</li>
          <li>Wallbox Vorbereitung</li>
          <li>Netzbetreiber Anmeldung</li>
          <li>Monitoring & Performance Tracking</li>
        </ul>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">USP</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul>
      </section>
      <section className="mt-12 bg-neutral-50 border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-2">Netzanschluss & Anmeldung</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Bearbeitungszeiten, Portal Links & typische Verzögerungsfaktoren findest du im Leitfaden: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. FAQ zur Zählersetzung & Unterlagen: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ Netzanschluss</a>.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          {faqs.map(f => (
            <div key={f.q}>
              <dt className="font-medium">{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Weitere Standorte (Region)</h2><ul className="list-disc pl-5 space-y-1 text-sm"><li><a className="text-blue-600 underline" href="/standorte/hamburg">Photovoltaik Hamburg</a></li><li><a className="text-blue-600 underline" href="/standorte/luebeck">Photovoltaik Luebeck</a></li><li><a className="text-blue-600 underline" href="/standorte/rostock">Photovoltaik Rostock</a></li></ul></section>
    
      <section className="mt-12"><h2 className="text-xl font-semibold mb-4">Regionale Kennzahlen & Kontext</h2><div className="grid md:grid-cols-2 gap-6 text-sm text-neutral-700"><ul className="space-y-2"><li><strong>Globalstrahlung:</strong> 1040 kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> 870–980 kWh/kWp</li><li><strong>Speicher Hinweis:</strong> Küstenschwankungen – 6–8 kWh Speicher glättet Last</li></ul><ul className="space-y-2"><li><strong>Netzanschluss Ablauf:</strong> Teilweise wetterbedingte Verzögerungen 6–10 Wochen</li><li><strong>Verschattungsrisiko:</strong> low</li><li><strong>Dachmix:</strong> Flach geneigte Ziegel- & Satteldächer, selten Verschattung</li></ul></div></section>
    </main>
  );
}
