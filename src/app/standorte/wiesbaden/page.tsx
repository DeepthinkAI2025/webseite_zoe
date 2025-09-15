import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/seo/jsonld';
import localBiz from '@/content/geo/localbusiness.json';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaik Installation Wiesbaden – Planung & Montage',
  description: 'Regionale Planung, Installation & Wartung von Photovoltaik Anlagen – angepasst an lokale Dach- & Netzbetreiber-Strukturen.',
  canonicalPath: '/standorte/wiesbaden'
});

export default function WiesbadenStandortPage(){
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Start', url: '/' },
        { name: 'Standorte', url: '/standorte' },
        { name: 'Wiesbaden', url: '/standorte/wiesbaden' }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd({
        name: localBiz.name,
        url: 'https://www.zoe-solar.de/standorte/wiesbaden',
        email: localBiz.email,
        phone: localBiz.phone,
        street: localBiz.street,
        postalCode: localBiz.postalCode,
        city: 'Wiesbaden',
        country: localBiz.country,
        openingHours: localBiz.openingHours,
        latitude: localBiz.latitude,
        longitude: localBiz.longitude,
        priceRange: localBiz.priceRange,
        sameAs: localBiz.sameAs,
        areaServed: ['Wiesbaden']
      })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }) }} />
      <header className="text-center mb-10">
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation Wiesbaden</h1>
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
    </main>
  );
}
