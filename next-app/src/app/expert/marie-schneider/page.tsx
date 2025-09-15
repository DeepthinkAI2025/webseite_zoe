import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, personJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = buildMetadata({
  title: 'Expertin – Marie Schneider (M.Sc. Energie & PV Planung)',
  description: 'Marie Schneider – Photovoltaik Planung & Energiesystem-Optimierung. Fokus: Effizienz, Degradation, Hybrid Speicherstrategien.',
  canonicalPath: '/expert/marie-schneider',
  type: 'article'
});

export default function ExpertMariePage(){
  const person = personJsonLd({
    name: 'Marie Schneider',
    jobTitle: 'Senior PV Planerin',
    description: 'Spezialisiert auf Optimum Layout, Verschattungsanalyse, Speicherkonfiguration & Systemeffizienz.',
    knowsAbout: [
      'Photovoltaik Auslegung',
      'Hybrid Speicher Architekturen',
      'Leistungselektronik',
      'Ertragsprognose Modelle'
    ],
    credentials: ['M.Sc. Regenerative Energiesysteme', 'DIN VDE 0100 Fortbildung'],
    sameAs: ['https://www.linkedin.com/in/marie-schneider-pv']
  });
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <JsonLd id="ld-breadcrumb-expert-marie" data={breadcrumbJsonLd([{ name:'Start', url:'/' }, { name:'Experten', url:'/expert' }, { name:'Marie Schneider', url:'/expert/marie-schneider' }])} />
      <JsonLd id="ld-person-marie" data={person} />
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Marie Schneider – Senior PV Planerin</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl">Planung & Optimierung von Photovoltaik Gesamtsystemen mit Schwerpunkt Effizienz, Ertragsstabilität und sinnvolle Speicherintegration.</p>
      </header>
      <section className="prose prose-neutral max-w-none text-sm">
        <h2>Kompetenzfelder</h2>
        <ul>
          <li>Ertrags- & Verschattungsanalyse (Simulation & Messdatenmodellierung)</li>
          <li>String & Wechselrichter Matching für Wirkungsgradpfad Optimierung</li>
          <li>Speicher Dimensionierung & Lastverschiebungskonzepte</li>
          <li>Performance Ratio Monitoring & Degradationsmodelle</li>
        </ul>
        <h2>Aktuelle Schwerpunkte</h2>
        <p>Evaluierung von TOPCon vs. HJT Modulperformance unter realen Temperaturprofilen; optimierte Lade-/Entladefenster für Hybrid Speicher in Verbindung mit dynamischen Stromtarifen.</p>
        <h2>Publikationen / Beiträge</h2>
        <ul>
          <li>Whitepaper: "Optimierte Speicherarchitektur für 8–15 kWp Hybrid Systeme" (2025)</li>
          <li>Artikel: "Degradation realer Anlagen – Datenbasierte Ansätze"</li>
        </ul>
      </section>
    </main>
  );
}
