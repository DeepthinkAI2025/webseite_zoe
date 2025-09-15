import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heading } from '@/components/ui/heading';
import { Section } from '@/components/ui/section';

export default function Privacy(){
  return (
    <Section size="narrow" padding="normal">
      <Helmet>
  <title>Datenschutz 2025 – Verarbeitung & Schutz bei ZOE Solar</title>
  <meta name="description" content="Datenschutz 2025 bei ZOE Solar: Erhebung, Nutzung & Schutz personenbezogener Daten, Rechtsgrundlagen, Speicherfristen & Rechte – transparente DSGVO Umsetzung." />
        <meta property="og:title" content="Datenschutz ZOE Solar – Verarbeitung & Schutz Ihrer Daten" />
        <meta property="og:description" content="Datenschutzerklärung ZOE Solar: Erhebung, Nutzung & Schutz personenbezogener Daten, Kontakt, Speicherfristen & Grundsätze transparenter Datenverarbeitung kompakt." />
      </Helmet>
      <div className="flow">
  {/* Duplicate meta descriptions entfernt – zentrale Definition oben */}
        <p>Bei Nutzung des Kontaktformulars werden die angegebenen Daten zwecks Bearbeitung der Anfrage gespeichert.</p>
        <p>Weitere Informationen auf Anfrage unter info@zoesolar.de.</p>
      </div>
    </Section>
  );
}
