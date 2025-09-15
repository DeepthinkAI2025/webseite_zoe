import type { Metadata } from 'next';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/Section';
import { QA } from '@/components/gaio/QA';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  title: 'Warum ZOE Solar?',
  description: 'Gründe für ZOE Solar: Systemkompetenz, transparente Preise, Qualitätskomponenten und nachhaltige Energieberatung.',
  canonicalPath: '/why-us'
});

const valueProps = [
  {
    title: 'Systemkompetenz',
    desc: 'Ganzheitliche Betrachtung von Dach, Speicher, Wallbox & Lastprofil – optimal abgestimmte Lösungen statt Stückwerk.'
  },
  {
    title: 'Transparente Preise',
    desc: 'Festpreis-Angebote mit klarer Leistungsbeschreibung – keine versteckten Kosten in späteren Phasen.'
  },
  {
    title: 'Qualitätskomponenten',
    desc: 'Eingesetzte Hersteller mit hoher Effizienz, langlebigen Garantien und solider Ersatzteilversorgung.'
  },
  {
    title: 'Förder & EEG Know-how',
    desc: 'Unterstützung bei Anmeldung, Netzbetreiber, KfW & steuerlicher Einordnung für reibungslose Inbetriebnahme.'
  },
  {
    title: 'Nachhaltigkeit',
    desc: 'Ausrichtung auf CO₂-Reduktion, Lastverschiebung (Peak-Shaving) und smarte Verbrauchsoptimierung.'
  },
  {
    title: 'Planbare Umsetzung',
    desc: 'Strukturierte Projektschritte: Analyse → Planung → Montage → Inbetriebnahme → Monitoring.'
  }
];

export default function WhyUsPage() {
  return (
    <div>
      <JsonLd
        id="ld-breadcrumb-whyus"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Warum wir', url: '/why-us' }
        ])}
      />
      <Section width="default" className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Warum ZOE Solar?</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Unser Anspruch: Technische Exzellenz, kaufmännische Klarheit und nachhaltiger Betrieb für jede PV-Anlage.</p>
      </Section>
      <Section width="wide" className="pt-0">
        <h2 className="sr-only">Wertversprechen</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map(v => (
            <Card key={v.title} padding="md">
              <CardTitle>{v.title}</CardTitle>
              <CardContent className="mt-2">{v.desc}</CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <Section width="default" className="border-t mt-4 pt-10">
        <h2 className="text-xl font-semibold mb-4">Wie geht es weiter?</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Unverbindliche Erstberatung & Bedarfsaufnahme</li>
          <li>Technische & wirtschaftliche Auslegung (Simulation)</li>
          <li>Transparenter Festpreis mit Leistungsumfang</li>
          <li>Montage & Elektrik Koordination</li>
          <li>Netz / Förderung / Steuer Begleitung</li>
          <li>Monitoring & Optimierung</li>
        </ol>
      </Section>
      <Section width="default" className="pt-10 border-t">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Fragen zur Zusammenarbeit</h2>
        <div className="grid gap-8 md:grid-cols-2" data-gaio-block="qa-group" aria-label="Fragen zur Zusammenarbeit">
          <QA headingLevel={3} question="Was unterscheidet euch von reinen Vermittlern?" answer="Wir planen technisch selbst, koordinieren Montage & behalten Systemverantwortung – keine anonyme Weiterleitung." longAnswer={<p>Direkte Verantwortung bedeutet: optimierte String-Layouts, abgestimmte Komponenten & strukturierte Qualitätskontrollen statt reine Lead-Weitergabe.</p>} />
          <QA headingLevel={3} question="Wie transparent sind Preise?" answer="Festpreis mit klarer Leistungsbeschreibung – Änderungsbedarf wird vor Umsetzung abgestimmt." longAnswer={<p>Alle Positionen (Module, WR, Speicher, Montagematerial, Elektrik) werden eindeutig benannt. Zusätzliche Arbeiten erfolgen nur nach schriftlicher Bestätigung.</p>} />
          <QA headingLevel={3} question="Wie geht ihr mit Lieferengpässen um?" answer="Wir führen qualifizierte Alternativen im Freigabeprozess – Austausch nur bei Gleich- oder Höherwertigkeit." longAnswer={<p>Risiko abgesichert durch Komponentenkategorien und Mindestparameter (Wirkungsgrad, Zyklen, Garantie). Dadurch bleiben Ertragsziele stabil.</p>} />
          <QA headingLevel={3} question="Wie erfolgt Monitoring/Übergabe?" answer="Digitale Übergabe inkl. Monitoring-Zugang, Dokumentation & Inbetriebnahmeprotokoll." longAnswer={<p>Nach Abschluss: Prüfprotokolle, Seriennummern, Garantien und Zugangsdaten – Basis für Performance-Analyse & Service.</p>} />
        </div>
      </Section>
    </div>
  );
}
