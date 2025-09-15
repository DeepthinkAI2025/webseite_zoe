import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = buildMetadata({
  title: 'Wirtschaftlichkeit & ROI',
  description: 'Analyse von LCOE, Amortisationszeit, Cashflow, Autarkiegrad & Speichereffekt – Fundament für belastbare Investitionsentscheidungen.',
  canonicalPath: '/wirtschaftlichkeit'
});

export default function WirtschaftlichkeitPage(){
  const faq = faqJsonLd([
    { q: 'Was ist LCOE bei PV?', a: 'Levelized Cost of Energy: Langfristige durchschnittliche Stromgestehungskosten; Quotient aus abgezinsten Gesamtkosten und erzeugter Energie.' },
    { q: 'Wie beeinflusst Speicher die Amortisation?', a: 'Er erhöht Eigenverbrauch & Autarkie – verlängert initial oft die Amortisationsdauer, verbessert aber Schutz gegen steigende Strompreise.' }
  ]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd id="ld-breadcrumb-wirtschaftlichkeit" data={breadcrumbJsonLd([{ name:'Start', url:'/' }, { name:'Wirtschaftlichkeit', url:'/wirtschaftlichkeit' }])} />
      <JsonLd id="ld-faq-wirtschaftlichkeit" data={faq} />
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Wirtschaftlichkeit & ROI</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Methodische Transparenz für Ertragsprognosen, Kapitalrendite & Optimierungshebel über die Lebensdauer.</p>
      </header>
      <section className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-semibold text-lg mb-3">Kennzahlen</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>LCOE Berechnung</li>
            <li>Amortisationspfad</li>
            <li>IRR / Kapitalrendite</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Einflussfaktoren</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>Moduldegradation</li>
            <li>Energiepreissteigerung</li>
            <li>Speichergröße</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Optimierung</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>Eigenverbrauchsquote</li>
            <li>Lastverschiebung</li>
            <li>Speicher/Ladeprofil</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
