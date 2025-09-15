import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function HomeFaq(){
  const faqs = [
    { q: 'Wie realistisch sind die Ertragsprognosen?', a: 'Wir rechnen konservativ mit Standortdaten und Verbrauchsprofil. Abweichungen besprechen wir transparent – keine Luftschlösser.' },
    { q: 'Wie schnell geht die Montage?', a: 'Nach Freigabe terminieren wir. Vor Ort dauert es meist 1–2 Tage, inkl. Einweisung. Sauber & pünktlich.' },
    { q: 'Welche Förderungen sind möglich?', a: 'Wir prüfen passende Programme, übernehmen die Beantragung und rechnen sie im Angebot ein – ohne Mehraufwand für Sie. Details im Guide „Förderung ohne Stress“.' },
    { q: 'Muss ich vorab zahlen?', a: 'Nein, die Zahlungsmodalitäten sind fair gestaffelt und schriftlich geregelt. Keine versteckten Kosten.' },
    { q: 'Wie läuft die Anmeldung beim Netzbetreiber?', a: 'Wir übernehmen Antrag, Kommunikation und Inbetriebsetzungsprotokolle – Sie müssen nichts tun.' },
    { q: 'Wie wird die Anlage gewartet?', a: 'Monitoring, Sichtprüfung, optionaler Wartungsplan – skalierbar nach Bedarf. Alles inklusive.' },
  ];
  return (
    <div className="pro-container text-[17px] md:text-[18px] leading-relaxed content-lg">
      <Helmet>
  <title>Solar FAQ 2025 Vorschau – Häufige Fragen & Antworten DE</title>
  <meta name="description" content="Solar FAQ Vorschau 2025: Fragen zu Ertrag Kosten Förderung Installation Anmeldung Speicher Wartung Garantie Planung Wirtschaftlichkeit – komplette Seite öffnen." />
      </Helmet>
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 text-center">Häufige Fragen</h2>
      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {faqs.map(f => (
          <div key={f.q} className="rounded-2xl border border-neutral-200 p-6 bg-white hover-lift">
            <div className="font-semibold text-neutral-900 text-lg">{f.q}</div>
            <p className="mt-2 text-base text-neutral-700 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
