import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section } from '@/components/ui/Section';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { QA } from '@/components/gaio/QA';
import UpdatedBadge from '@/components/UpdatedBadge';

export const metadata: Metadata = buildMetadata({
  title: 'Solar Technologie & Komponenten – Effizienz & Qualität',
  description: 'Übersicht über unsere Photovoltaik-Technologie: Hochleistungsmodule, Hybrid-Wechselrichter, Speicher & Monitoring – ausgelegt auf Effizienz und Langlebigkeit.',
  canonicalPath: '/technology'
});

// Lazy Component jetzt über Client Wrapper (HeavyChartClient) eingebunden
import { HeavyChartClient } from '@/components/perf/HeavyChartClient';

export default function TechnologyPage() {
  const cards = [
    { title: 'Module', desc: 'Hocheffiziente monokristalline Halbzellen mit >21% ' +
        '<dfn id="term-wirkungsgrad" title="Verhältnis aus abgegebener elektrischer Leistung zur eingestrahlten Solarleistung unter STC">Wirkungsgrad</dfn>' +
        ' und linearem Leistungsversprechen.' },
    { title: 'Wechselrichter', desc: 'Hybrid-fähige Geräte mit optimiertem ' +
        '<dfn id="term-mpp" title="Maximum Power Point Tracking – kontinuierliche Nachführung des optimalen Arbeitspunktes">MPP-Tracking</dfn>' +
        ' & Update-fähiger Firmware.' },
    { title: 'Speicher', desc: 'Lithium-Eisenphosphat (' +
        '<dfn id="term-lifepo4" title="Lithium-Eisenphosphat – thermisch stabile Lithium-Zellchemie mit hoher Sicherheit">LiFePO₄</dfn>' +
        ') mit hoher ' +
        '<dfn id="term-zyklenfestigkeit" title="Anzahl Voll-Lade/Entlade-Zyklen bis Kapazität auf definierten Zielwert (z.B. 80%) fällt">Zyklenfestigkeit</dfn>' +
        ' und sicherem Batteriemanagement.' }
  ];
  return (
    <div className="bg-white">
      <JsonLd
        id="ld-breadcrumb-technology"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Technologie', url: '/technology' }
        ])}
      />
      <Section className="text-center border-b border-neutral-200" width="default">
        <div className="inline-block text-xs font-semibold tracking-wide uppercase text-neutral-600 mb-4">Technologie 2025</div>
  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">Technologie für nachhaltige Leistung</h1>
  <div className="mt-4 flex justify-center"><UpdatedBadge date={new Date()} /></div>
  <p className="mt-6 text-lg text-neutral-600 max-w-3xl mx-auto">Premium-Module, intelligente <dfn title="Kombinierter PV- und Batterie-Wechselrichter in einem Gerät">Hybrid‑Wechselrichter</dfn> und skalierbare Speicherlösungen – konservativ ausgelegt für reale Erträge statt theoretischer Spitzenwerte.</p>
      </Section>
      <Section width="wide" className="pt-8">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {cards.map(c => (
            <Card key={c.title} padding="md" className="h-full">
              <CardTitle>{c.title}</CardTitle>
              <CardContent className="mt-2">{c.desc}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 bg-neutral-50 border rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-2">Messkonzept & Netzanschluss</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">Technische Komponenten entfalten ihren Nutzen erst mit sauberem <strong>Mess- & Schaltkonzept</strong> (PV, Speicher, Wallbox, Wärmepumpe). Ablauf, Bearbeitungszeiten und typische Verzögerungsfaktoren haben wir im Leitfaden zusammengefasst: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. FAQ zur Zählersetzung & Unterlagen: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ Netzanschluss</a>.</p>
        </div>
        <figure className="rounded-lg border bg-neutral-50 p-4 flex flex-col md:flex-row items-center gap-6">
          <Image
            src="/solar-module-placeholder.svg"
            alt="Illustration eines Photovoltaik Moduls"
            width={400}
            height={260}
            priority
            className="h-auto w-[260px] md:w-[320px] lg:w-[400px] object-contain"
          />
          <figcaption className="text-sm text-neutral-600 max-w-prose">
            Beispiel für ein optimiertes Bild via <code>next/image</code> mit automatischer Größenanpassung & lazy Loading (außer <code>priority</code> gesetzt). Ersetzt statische <code>&lt;img&gt;</code> Tags und reduziert LCP durch effizientes Laden und Serving (AVIF/WebP falls unterstützt).
          </figcaption>
        </figure>
      </Section>
      <Section width="default" className="py-14 border-t">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Technologie Fragen</h2>
        <div className="grid gap-8 md:grid-cols-2" data-gaio-block="qa-group" aria-label="Fragen zu Technologie">
          <QA headingLevel={3} question="Warum LiFePO₄ Speicher?" answer="Hohe Zyklenfestigkeit, thermische Stabilität und sicherheitsorientiertes Zellchemiedesign für langlebige Systeme." longAnswer={<p><dfn title="Lithium-Eisenphosphat Zellchemie" id="gloss-lifepo4">LiFePO₄</dfn> bietet {'>'}6000 <dfn title="Vollständige Lade/Entlade Sequenzen" id="gloss-zyklen">Zyklen</dfn> bei moderater <dfn title="Kapazitätsabnahme über die Lebensdauer" id="gloss-degradation">Degradation</dfn> und reduziert thermisches Durchgeh-Risiko gegenüber NMC/NCA bei stationären Anwendungen.</p>} />
          <QA headingLevel={3} question="Welche Modulgeneration nutzt ihr?" answer="Aktuell bifaciale oder monofaciale Mono-PERC / TOPCon Module mit >21% Wirkungsgrad." longAnswer={<p>Fokus liegt auf stabilem <dfn title="Leistungsänderung pro °C Temperaturänderung" id="gloss-tempkoeff">Temperaturkoeffizienten</dfn>, <dfn title="Potential Induced / Light & Thermal Induced Degradation" id="gloss-pid">PID/TID</dfn>-resistentem Design und langfristigen linearen Leistungsgarantien.</p>} />
          <QA headingLevel={3} question="Hybrid-Wechselrichter Vorteil?" answer="Kombiniert PV, Speicher & teils Backup in einem Gerät – reduziert Wandlungsverluste & Komplexität." longAnswer={<p>Ein Gerät vereinfacht Installation, ermöglicht schnellere Umschaltzeiten und verringert Verkabelungsaufwand gegenüber getrennter DC/AC Kopplung.</p>} />
          <QA headingLevel={3} question="Wie validiert ihr Ertrag?" answer="Initiale Produktionssimulation + laufendes Monitoring & Abgleich gegen Sollkennlinien." longAnswer={<p>Datenpunkte (<dfn title="Strom/Spannungs Kennlinie einer PV-String Messung" id="gloss-iv">I/V Verhalten</dfn>, Einstrahlung, Temperatur) erlauben Abweichungsanalyse und frühzeitige Identifikation fehlerhafter Strings.</p>} />
        </div>
      </Section>
      <Section width="default" className="py-14 border-t" aria-labelledby="glossar-heading">
        <h2 id="glossar-heading" className="text-2xl font-bold tracking-tight mb-6">Glossar Photovoltaik</h2>
        <dl className="space-y-6 text-sm leading-relaxed text-neutral-700">
          <div>
            <dt className="font-semibold">Wirkungsgrad</dt>
            <dd id="def-wirkungsgrad">Verhältnis zwischen nutzbarer abgegebener elektrischer Leistung und eingestrahlter Solarleistung unter Standard-Test-Bedingungen (STC).</dd>
          </div>
          <div>
            <dt className="font-semibold">MPP-Tracking</dt>
            <dd>Maximum Power Point Tracking – kontinuierliche Regelung, damit das Modul/der String am optimalen Arbeitspunkt (Strom/Spannung) betrieben wird.</dd>
          </div>
            <div>
            <dt className="font-semibold">LiFePO₄</dt>
            <dd>Lithium-Eisenphosphat Zellchemie: hohe thermische Stabilität, viele Zyklen, geringer Brand- und Durchgeh-Risiko im stationären Einsatz.</dd>
          </div>
          <div>
            <dt className="font-semibold">Zyklenfestigkeit</dt>
            <dd>Anzahl vollständiger Lade/Entlade-Vorgänge bis eine definierte Restkapazität (z.B. 80%) erreicht wird.</dd>
          </div>
          <div>
            <dt className="font-semibold">Degradation</dt>
            <dd>Langfristige Leistungs- oder Kapazitätsabnahme eines PV-Moduls oder Speichers über die Betriebsjahre.</dd>
          </div>
          <div>
            <dt className="font-semibold">Temperaturkoeffizient</dt>
            <dd>Prozentuale Leistungsänderung eines Moduls pro °C Abweichung von der Referenztemperatur (typisch 25°C).</dd>
          </div>
          <div>
            <dt className="font-semibold">PID / TID</dt>
            <dd>Potential Induced Degradation / Light & Thermal Induced Degradation – Effekte, die Modulleistung über Zeit verringern können.</dd>
          </div>
          <div>
            <dt className="font-semibold">TOPCon</dt>
            <dd>Tunnel Oxide Passivated Contact – Zelltechnologie mit verbessertem Ladungsträgerdurchsatz und höherem Wirkungsgradpotenzial.</dd>
          </div>
          <div>
            <dt className="font-semibold">I/V Verhalten</dt>
            <dd>Strom-Spannungs-Kennlinie eines PV-Strings oder Moduls; Grundlage zur Bewertung von Abweichungen und Fehlern.</dd>
          </div>
        </dl>
      </Section>
      <Section width="default" className="py-14 border-t" aria-labelledby="perf-demo-heading">
        <h2 id="perf-demo-heading" className="text-2xl font-bold tracking-tight mb-6">Performance Demo (Lazy Loaded)</h2>
        <p className="text-neutral-600 mb-4 max-w-2xl">Das folgende Diagramm wird nur geladen, wenn der Nutzer diesen Bereich erreicht. Dies reduziert das anfängliche JavaScript Bundle und verbessert Time-to-Interactive. Beispiel für <code>next/dynamic</code> & Code-Splitting.</p>
        <div className="border rounded-lg p-6 bg-neutral-50">
          <HeavyChartClient />
        </div>
      </Section>
    </div>
  );
}
