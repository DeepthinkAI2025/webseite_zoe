import { Metadata } from 'next';
import { LeadQualiForm } from '@/components/forms/LeadQualiForm';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Projektanfrage Photovoltaik – Qualifizierte Einschätzung',
  description: 'Schnelle qualifizierte Ersteinschätzung für Photovoltaik Projekte – Bedarf, Dach, Speicher & Wallbox Optionen einreichen.',
  alternates: { canonical: '/anfrage' }
};

export default function AnfragePage(){
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Photovoltaik Projekt Anfrage',
    areaServed: 'DE',
    potentialAction: {
      '@type': 'SubmitAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://www.zoe-solar.de/api/lead' },
      result: { '@type': 'Thing', name: 'LeadErfasst' },
      name: 'LeadQualifikation'
    }
  };
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <JsonLd id="ld-service-anfrage" data={jsonLd} />
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Projekt Anfrage</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto text-sm">Teile kurz Eckdaten zu Dach, Verbrauch und optional Speicher & Wallbox Interessen. Wir bewerten Wirtschaftlichkeit & technisches Setup und melden uns zeitnah.</p>
      </header>
      <section className="bg-neutral-50 border rounded-md p-6 mb-10">
        <h2 className="text-lg font-semibold mb-2">Was passiert danach?</h2>
        <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
          <li>Validierung Basisdaten & grobe Anlagengröße</li>
          <li>Abschätzung Speichernutzen / Lastprofil Effekt</li>
          <li>Hinweis zu potenziellen Engpässen (Netz / Statik / Verschattung)</li>
          <li>Rückmeldung & ggf. Termin für Detailaufnahme</li>
        </ul>
      </section>
      <LeadQualiForm />
    </main>
  );
}
