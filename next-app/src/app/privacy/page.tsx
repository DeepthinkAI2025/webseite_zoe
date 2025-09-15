import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Datenschutz – ZOE Solar',
  description: 'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten bei ZOE Solar.',
  canonicalPath: '/privacy'
});

export default function PrivacyPage(){
  return (
    <main className="prose dark:prose-invert mx-auto max-w-3xl px-6 py-12">
      <h1>Datenschutzerklärung</h1>
      <p>Wir freuen uns über Ihr Interesse an unserem Unternehmen. Der Schutz Ihrer personenbezogenen Daten hat hohe Priorität. Diese Erklärung informiert Sie über Art, Umfang und Zwecke der Verarbeitung personenbezogener Daten beim Besuch dieser Website.</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        ZOE Solar<br />
        Kurfürstenstraße 124<br />
        10785 Berlin<br />
        Inhaber: Jeremy Markus Schulze<br />
        E-Mail: <a href="mailto:service@zoe-solar.de">service@zoe-solar.de</a><br />
        USt-ID: DE325514610<br />
        Installateur-Nr: 0080-32174<br />
        Betriebsnummer: 134514
      </p>

      <h2>2. Server Log-Daten</h2>
      <p>Beim Aufruf der Website verarbeitet das System automatisiert temporär: gekürzte IP-Adresse, Timestamp, angefragte Ressource/URL, User-Agent, Referer (falls übermittelt). Die Speicherung erfolgt zur Absicherung des Betriebs und zur Fehleranalyse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Stabilität & Sicherheit).</p>

      <h2>3. Cookies & Tracking</h2>
      <p>Aktuell setzen wir keine nicht notwendigen oder Marketing Cookies ein. Eine zukünftige anonyme Reichweitenmessung kann ergänzt werden. In diesem Fall wird diese Erklärung aktualisiert und – sofern erforderlich – eine Einwilligung eingeholt.</p>

      <h2>4. Kontakt & Anfrageformulare</h2>
      <p>Bei Nutzung eines Formulars verarbeiten wir die von Ihnen angegebenen Daten (z.B. Name, E-Mail, Nachricht, projektrelevante Eckdaten) ausschließlich zur Bearbeitung Ihrer Anfrage und zur Vorbereitung eines Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie lit. f (Interesse an effizienter Kommunikation).</p>

      <h2>5. Rechtsgrundlagen Übersicht</h2>
      <ul>
        <li>Betrieb & Sicherheit: Art. 6 Abs. 1 lit. f DSGVO</li>
        <li>Anfragen / Angebotserstellung: Art. 6 Abs. 1 lit. b DSGVO</li>
        <li>Ggf. Einwilligungsbasierte Tools zukünftig: Art. 6 Abs. 1 lit. a DSGVO</li>
      </ul>

      <h2>6. Speicherdauer</h2>
      <p>Log-Daten werden i.d.R. binnen 30 Tagen gelöscht bzw. anonymisiert. Anfragedaten löschen wir nach Abschluss des Vorgangs, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen.</p>

      <h2>7. Empfänger / Auftragsverarbeitung</h2>
      <p>Sofern Infrastruktur-/Hosting-Dienstleister eingesetzt werden, erfolgt die Verarbeitung auf Basis von Auftragsverarbeitungsverträgen nach Art. 28 DSGVO. Eine Übermittlung in Drittländer findet aktuell nicht statt.</p>

      <h2>8. Datensicherheit</h2>
      <p>Transportverschlüsselung (HTTPS), gehärtete Build-/Deploy-Pipeline, minimierte Angriffsfläche und regelmäßige Aktualisierung der Systemkomponenten dienen dem Schutz Ihrer Daten.</p>

      <h2>9. Ihre Rechte</h2>
      <p>Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit sowie Beschwerde bei einer zuständigen Aufsichtsbehörde. Sie können erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft widerrufen.</p>

      <h2>10. Änderungen dieser Erklärung</h2>
      <p>Bei Erweiterungen der Website oder regulatorischen Anpassungen aktualisieren wir diese Datenschutzerklärung. Die jeweils aktuelle Fassung finden Sie hier.</p>

      <p className="text-sm text-neutral-500 mt-8">Hinweis: Diese Fassung ersetzt Platzhaltertexte. Endgültige rechtliche Prüfung empfohlen.</p>
    </main>
  );
}
