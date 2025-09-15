import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = buildMetadata({
  title: 'Solar Wissen Hub',
  description: 'Technische und wirtschaftliche Grundlagen zu Photovoltaik: Module, Wechselrichter, Speicher, Effizienz, Lebensdauer & Wartung.',
  canonicalPath: '/wissen'
});

export default function WissenHubPage(){
  const faq = faqJsonLd([
    { q: 'Was beeinflusst die Lebensdauer von PV Modulen?', a: 'Qualität der Verkapselung, thermische Zyklen, UV Stabilität und Feuchtigkeitsmanagement sind Hauptfaktoren.' },
    { q: 'Wie wählt man einen Wechselrichter aus?', a: 'String-Design, MPP Spannungsfenster, Teillastwirkungsgrad und Schattenmanagement sind entscheidend.' }
  ]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd id="ld-breadcrumb-wissen" data={breadcrumbJsonLd([{ name:'Start', url:'/' }, { name:'Wissen', url:'/wissen' }])} />
      <JsonLd id="ld-faq-wissen" data={faq} />
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Solar Wissen Hub</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Kuratiertes technisches Fundament für fundierte Photovoltaik-Entscheidungen. Modular erweiterbar – Fokus Effizienz & Langlebigkeit.</p>
      </header>
      <section className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-semibold text-lg mb-3">Grundlagen</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>Funktionsprinzip Photovoltaik</li>
            <li>Modultechnologien (Mono, HJT, TOPCon)</li>
            <li>Degradation & Performance Ratio</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Systemdesign</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>String Auslegung & Verschattung</li>
            <li>Wechselrichter Effizienzpfade</li>
            <li>Speicherintegration & Hybrid</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Betrieb & Monitoring</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>Leistungsmessung / KPIs</li>
            <li>Präventive Wartung</li>
            <li>Langzeit Degradationsanalyse</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
