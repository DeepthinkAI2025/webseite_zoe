import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Impressum – ZOE Solar',
  description: 'Gesetzliche Anbieterkennzeichnung & Kontaktangaben von ZOE Solar.',
  canonicalPath: '/imprint'
});

export default function ImprintPage(){
  return (
    <main className="prose dark:prose-invert mx-auto max-w-3xl px-6 py-12">
      <h1>Impressum</h1>
      <p><strong>Anbieter:</strong><br/>ZOE Solar GmbH<br/>Beispielstraße 12<br/>12345 Berlin<br/>Deutschland</p>
      <p><strong>Kontakt:</strong><br/>Telefon: +49 (0)30 000000<br/>E-Mail: service@zoe-solar.de</p>
      <p><strong>Geschäftsführung:</strong><br/>Vorname Nachname</p>
      <p><strong>Registereintrag:</strong><br/>Amtsgericht Berlin HRB 000000</p>
      <p><strong>Umsatzsteuer-ID:</strong><br/>DE000000000</p>
      <h2>Haftungshinweis</h2>
      <p>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr.</p>
      <h2>Externe Links</h2>
      <p>Verlinkte externe Inhalte wurden zum Zeitpunkt der Verlinkung geprüft. Auf deren aktuelle Gestaltung haben wir keinen Einfluss.</p>
      <h2>Urheberrecht</h2>
      <p>Alle Texte, Bilder und sonstige Inhalte unterliegen dem deutschen Urheberrecht. Nutzung nur nach schriftlicher Genehmigung.</p>
      <h2>Bildnachweise</h2>
      <p>Eigene Produktionen oder lizensierte Stockmaterialien. Ggf. gesonderte Kennzeichnung direkt am Bild.</p>
      <p className="text-sm text-neutral-500 mt-8">(Platzhalter – bitte rechtlich prüfen & vervollständigen)</p>
    </main>
  );
}
