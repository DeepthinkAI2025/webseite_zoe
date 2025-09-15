import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Impressum – ZOE Solar',
  description: 'Anbieterkennzeichnung & rechtliche Pflichtangaben von ZOE Solar.',
  canonicalPath: '/impressum'
});

export default function ImpressumPage(){
  return (
    <main className="prose dark:prose-invert mx-auto max-w-3xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-impressum"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Impressum', url: '/impressum' }
        ])}
      />
      <h1>Impressum</h1>
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        ZOE Solar<br />
        Kurfürstenstraße 124<br />
        10785 Berlin<br />
        Inhaber: Jeremy Markus Schulze
      </p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href="mailto:service@zoe-solar.de">service@zoe-solar.de</a><br />Telefon: +49 (noch nicht veröffentlicht)</p>
      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE325514610</p>
      <h2>Installateur & Betriebsnummern</h2>
      <p>Installateur-Nr: 0080-32174<br />Betriebsnummer: 134514</p>
      <h2>Haftung für Inhalte</h2>
      <p>Wir erstellen die Inhalte dieser Seiten mit größter Sorgfalt. Für die Richtigkeit, Vollständigkeit und Aktualität können wir jedoch keine Gewähr übernehmen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben unberührt.</p>
      <h2>Haftung für Links</h2>
      <p>Externe Links werden zum Zeitpunkt der Verlinkung geprüft. Auf nachträgliche Änderungen haben wir keinen Einfluss. Bei Bekanntwerden rechtswidriger Inhalte entfernen wir entsprechende Links unverzüglich.</p>
      <h2>Urheberrecht</h2>
      <p>Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Vervielfältigung, Bearbeitung und Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.</p>
      <p className="text-sm text-neutral-500 mt-8">Hinweis: Platzhalter – finale anwaltliche Durchsicht empfohlen.</p>
    </main>
  );
}
