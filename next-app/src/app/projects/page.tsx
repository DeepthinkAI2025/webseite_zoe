import type { Metadata } from 'next';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/Section';
import { QA } from '@/components/gaio/QA';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  title: 'Referenzen & Projekte',
  description: 'Ausgewählte Photovoltaik-Projekte von ZOE Solar – Dachanlagen, Speicherintegration und Wallbox-Konzepte.',
  canonicalPath: '/projects'
});

const demoProjects = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `PV-Anlage ${i + 1}`,
  size: `${6 + i * 2} kWp`,
  type: i % 2 === 0 ? 'Einfamilienhaus' : 'Gewerbe',
  status: 'In Betrieb'
}));

export default function ProjectsPage() {
  return (
    <div>
      <JsonLd
        id="ld-breadcrumb-projects"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Projekte', url: '/projects' }
        ])}
      />
      <Section width="default" className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Referenzen & Projekte</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">Ein Auszug realisierter oder in Umsetzung befindlicher Photovoltaik- und Speicherprojekte. Ausführliche Fallstudien folgen.</p>
      </Section>
      <Section width="wide" className="pt-0">
        <h2 className="sr-only">Projektliste (Platzhalter)</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoProjects.map(p => (
            <Card key={p.id} padding="md">
              <CardTitle>{p.title}</CardTitle>
              <CardContent className="mt-2">
                <dl className="text-xs space-y-1 text-muted-foreground">
                  <div><dt className="inline font-medium text-neutral-700">Anlagengröße:</dt> <dd className="inline">{p.size}</dd></div>
                  <div><dt className="inline font-medium text-neutral-700">Typ:</dt> <dd className="inline">{p.type}</dd></div>
                  <div><dt className="inline font-medium text-neutral-700">Status:</dt> <dd className="inline">{p.status}</dd></div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed">Beschreibung & Fotodokumentation folgen nach Migration der Medien-Pipeline.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <Section width="default" className="py-12 border-t">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Fragen zu Referenzen</h2>
        <div className="grid gap-8 md:grid-cols-2" data-gaio-block="qa-group" aria-label="Fragen zu Referenzen">
          <QA headingLevel={3} question="Sind echte Projektdaten verfügbar?" answer="Ja – detaillierte Fallstudien (Ertrag, Autarkie, Komponenten) werden nach Medienmigration veröffentlicht." longAnswer={<p>Rohdaten liegen bereits intern vor (Ertrags-Monitoring & Parametrik). Veröffentlichung erfolgt DSGVO-konform in anonymisierter Form.</p>} />
          <QA headingLevel={3} question="Welche Größen realisiert ihr?" answer="Typisch 6–30 kWp Residential, bis 100 kWp Gewerbe – darüber projektspezifische Prüfung." longAnswer={<p>Ab {'>'}30 kWp steigen Anforderungen an Statik & Netzanschluss. Wir begleiten Auswahl von WR-Topologien und Lastmanagement.</p>} />
          <QA headingLevel={3} question="Übernehmt ihr Repowering?" answer="Ja – Bestandsanlagen Analyse & Upgrade (WR, Speicher, Monitoring) nach Wirtschaftlichkeitsprüfung." longAnswer={<p>Wir prüfen String-Layouts, Degradation, WR-Wirkungsgrad & potenzielle Speicherintegration zur Lebensdauer- und Ertragsoptimierung.</p>} />
          <QA headingLevel={3} question="Wie werden Qualitätsdaten gesichert?" answer="Strukturierte Checklisten und stichprobenhafte Thermografie / Performance-Abgleich." longAnswer={<p>Thermografie und IV-Kurve (sofern sinnvoll) unterstützen bei Früherkennung von Hotspots & Mismatch-Verlusten.</p>} />
        </div>
      </Section>
    </div>
  );
}
