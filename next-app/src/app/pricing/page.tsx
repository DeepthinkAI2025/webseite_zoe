import React from 'react';
import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { offersJsonLd, breadcrumbJsonLd, faqJsonLd, howToJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { ComparisonTable } from '@/components/pricing/ComparisonTable';
import faqData from '@/content/seo/faq.json';
import { KeyTakeaways } from '@/components/gaio/KeyTakeaways';
import { QA } from '@/components/gaio/QA';
import UpdatedBadge from '@/components/UpdatedBadge';
// Re-use Legacy UI primitives (temporär) – später in echte Komponenten extrahieren
// Temporärer Minimal-Stand: Legacy Komponenten noch nicht portiert.
// TODO: Icons & UI-Komponenten schrittweise nach `src/components` migrieren.

// Vereinfachter MetricsBar Platzhalter (Legacy Komponente noch nicht extrahiert)
function MetricsBar({ metrics }: { metrics: { label: string; value: string }[] }) {
  return (
    <div className="border-t border-b border-neutral-200 bg-neutral-50 py-6">
      <div className="pro-container grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {metrics.map(m => (
          <div key={m.label} className="space-y-1">
            <div className="text-sm text-neutral-500">{m.label}</div>
            <div className="text-lg font-semibold text-neutral-800">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = buildMetadata({
  title: 'Solaranlagen Preise 2025 – Festpreise & Förderung DE',
  description: 'Solaranlage Preise 2025: Ab 18.900€ inkl. Förderung – Festpreise, 25 Jahre Garantie, TÜV zertifiziert, Pakete & Beratung anfragen – fair vergleichen.',
  canonicalPath: '/pricing'
});

export default function PricingPage() {
  const bundles = [
    { id:'pv-basic', title:'Solar Basic', desc:'Einstieg mit Fokus auf schnelle Amortisation', price:'€18.900', minPrice:'€18.900', maxPrice:'€22.500', capacityKwp:8, paybackYears:10, warrantyYears:25, category:'Residential', efficiencyClass:'A', description:'Solaranlage Basis-Konfiguration bis ca. 8 kWp für kosteneffizienten Start.' },
    { id:'pv-storage', title:'Solar Komplett', desc:'Unabhängigkeits-Paket mit Speicher', price:'€24.900', minPrice:'€24.900', maxPrice:'€29.500', capacityKwp:10, paybackYears:9, warrantyYears:25, category:'Residential', efficiencyClass:'A+', description:'PV Paket inkl. Speicher für höhere Autarkie & Lastverschiebung.' },
    { id:'pv-premium', title:'Solar Premium', desc:'Maximale Zukunftssicherheit & Monitoring', price:'€32.900', minPrice:'€32.900', maxPrice:'€39.000', capacityKwp:14, paybackYears:8.5, warrantyYears:30, category:'Residential', efficiencyClass:'A++', description:'Erweiterte Premium-Konfiguration mit höherer Leistung & langfristiger Garantie.' }
  ];

  const howTo = howToJsonLd({
    name: 'In 5 Schritten zur eigenen Solaranlage',
    description: 'Von der Analyse bis zur Inbetriebnahme – strukturierter Projektablauf für Ihre PV-Anlage.',
    steps: [
      { name: '1. Bedarf & Analyse', text: 'Kurzer Remote-Check: Dach, Verbrauch, Ziele – wir erstellen eine erste Abschätzung.' },
      { name: '2. Technisches Vor-Design', text: 'String-Layout, Komponentenwahl (Module, WR, Speicher) & Förderfähigkeit prüfen.' },
      { name: '3. Verbindliches Festpreis-Angebot', text: 'Transparenter Leistungsumfang – Reservierung der Komponenten nach Freigabe.' },
      { name: '4. Installation & Anmeldung', text: 'Montage durch zertifizierte Teams, Netzbetreiber-Anmeldung & Dokumentation.' },
      { name: '5. Übergabe & Monitoring', text: 'Inbetriebnahme, Einweisung, Performance-Monitoring & Garantieunterlagen.' }
    ]
  });

  return (
    <div className="bg-white">
      <JsonLd id="ld-offers" data={offersJsonLd(bundles)} />
      <JsonLd id="ld-faq-pricing" data={faqJsonLd((faqData as Array<{ q: string; a: string }>).slice(0,3))} />
      <JsonLd id="ld-breadcrumb-pricing" data={breadcrumbJsonLd([
        { name: 'Start', url: '/' },
        { name: 'Preise', url: '/pricing' }
      ])} />
      <JsonLd id="ld-howto-pricing" data={howTo} />
      <Section className="text-center border-b border-neutral-200" width="default">
        <div className="inline-block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-4">Preisstruktur 2025</div>
  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">Transparente Solarpakete mit Festpreis</h1>
  <div className="mt-4 flex justify-center"><UpdatedBadge date={new Date()} /></div>
        <p className="mt-6 text-lg text-neutral-600 max-w-3xl mx-auto">Keine Überraschungen: konservative Auslegung, 25 Jahre Garantie und modulare Erweiterbarkeit. Wählen Sie den passenden Start – skalieren Sie später.</p>
        <div className="mt-10 text-left max-w-3xl mx-auto space-y-10">
          <KeyTakeaways
            items={[
              'Festpreise mit klar definiertem Leistungsumfang',
              'Amortisation häufig in 9–11 Jahren erreichbar',
              'Speicher optional zur Autarkie-Steigerung',
              'Skalierbar: später erweiterbar',
              '25 Jahre Leistungsgarantie (Module)'
            ]}
          />
          <div className="space-y-8" aria-label="Häufige Kernfragen (Kurzform)">
            <QA
              question="Was kostet eine typische Anlage?"
              answer="Viele Eigenheim-Anlagen liegen 2025 zwischen 18k–24k € inkl. Montage (10 kWp Range)."
              longAnswer={<p>Preis hängt von Dachform, Komponentenwahl (Modul / Speicher) und elektrischer Einbindung ab. Förderung & Steuer können Effektivkosten senken.</p>}
            />
            <QA
              question="Lohnt sich ein Speicher direkt?"
              answer="Wenn Nachtverbrauch & Lastverschiebung relevant sind, steigt Autarkie & Eigenverbrauch sichtbar."
              longAnswer={<p>Speicher lohnt bei höherem Nachtprofil oder E‑Mobilität. Sonst kann Nachrüstung später erfolgen – System modular planen.</p>}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild>
            <Link href="/contact">Beratung anfordern</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Ersparnis prüfen</Link>
          </Button>
        </div>
      </Section>

      <MetricsBar metrics={[{label:'Ø Amortisation',value:'9–11 J.'},{label:'Termintreue',value:'96%'},{label:'Garantie',value:'25 J.'},{label:'Kunden',value:'2.500+'}]} />

      <Section width="wide" className="pt-8">
        <div className="grid md:grid-cols-3 gap-8">
          {bundles.map(b => (
            <Card key={b.id} padding="md" className="h-full flex flex-col">
              <CardTitle>{b.title}</CardTitle>
              <CardContent className="mt-2 flex-grow">
                <p className="text-sm text-neutral-600 leading-relaxed">{b.desc}</p>
                <div className="mt-4 text-neutral-900 font-semibold">{b.price}</div>
              </CardContent>
              <div className="mt-4">
                <Button asChild size="sm" className="w-full">
                  <Link href={`/contact?bundle=${b.id}`}>Anfragen</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section width="default" className="py-16 border-t border-neutral-200">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-8">Direkter Paketvergleich</h2>
        <ComparisonTable bundles={bundles} />
      </Section>

      <Section width="default" className="py-12 border-t border-neutral-200">
        <div className="bg-neutral-50 border rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Netzanschluss & Zeitpuffer</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">Die tatsächliche Realisierungszeit einer Anlage hängt nicht nur von Montagekapazität ab, sondern wesentlich von der <strong>Netzbetreiber-Freigabe & Zählersetzung</strong>. Typische Bearbeitungsfenster liegen regional bei 4–12 Wochen. Details & Portale: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. Häufige Verzögerungsquellen: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ</a>.</p>
          <p className="text-xs text-neutral-500 mt-3">Tipp: Frühzeitige, vollständige Unterlagen (Stringplan, Datenblätter, Messkonzept) reduzieren Projekt-End-zu-End Dauer spürbar.</p>
        </div>
      </Section>

      <Section width="default" className="py-16 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-6">Ablauf – von Anfrage bis Inbetriebnahme</h2>
          <ol className="space-y-6 counter-decimal pl-4 [counter-reset:step]">
            {(howTo.step as Array<{ position: number; name: string; text: string }>).map(step => (
              <li key={step.position} className="relative pl-10 group">
                <span className="absolute left-0 top-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm">{step.position}</span>
                <h3 className="font-semibold text-neutral-800 leading-snug">{step.name.replace(/^\d+\.\s?/, '')}</h3>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </div>
  );
}
