import React, { useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { breadcrumbLD, faqLD, pillarServiceLD, articleLD } from '@/utils/structuredData';
import { computeWordCountFromNode } from '@/utils/wordCount';

export default function Stromspeicher() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
  const path = '/stromspeicher';
  const breadcrumb = breadcrumbLD([
    { name: 'Start', item: origin + '/' },
    { name: 'Stromspeicher', item: origin + path }
  ]);
  const faq = faqLD([
    { q: 'Welche Speicher-Technologie ist 2025 empfehlenswert?', a: 'LiFePO4 bietet hohe Sicherheit, lange Lebensdauer (>6.000 Zyklen) und stabile Performance.' },
    { q: 'Wie groß sollte der Speicher sein?', a: 'Heuristik: 60–80% des täglichen Verbrauchs; Feintuning durch Monitoring nach 3–6 Monaten.' },
    { q: 'Verlängert ein Speicher die Amortisationszeit?', a: 'Kurzfristig geringfügig, langfristig senkt höhere Eigenverbrauchsquote die effektiven Stromkosten.' }
  ]);
  const service = pillarServiceLD({ name: 'Stromspeicher & Energiemanagement', description: 'Analyse, Dimensionierung und Integration langlebiger LiFePO4 Speicher', origin });
  // Dynamische Wortanzahl
  const articleRef = useRef(null);
  const [wordCount, setWordCount] = useState(1150);
  useEffect(() => {
    if (articleRef.current) {
      const wc = computeWordCountFromNode(articleRef.current);
      if (wc && Math.abs(wc - wordCount) > 15) setWordCount(wc);
    }
  }, []);
  const published = '2025-09-04T10:00:00.000Z';
  const modified = new Date().toISOString();
  // Article JSON-LD dynamisch erzeugen
  const article = articleLD({
    title: 'Stromspeicher 2025 – LiFePO4 vs NMC, Dimensionierung & ROI',
    description: 'Stromspeicher 2025: LiFePO4 vs NMC, Zyklenfestigkeit, ideale Dimensionierung, Wirtschaftlichkeit & ROI Strategien für nachhaltige Autarkie im Haushalt.',
    author: 'ZOE Redaktion',
    datePublished: published,
    dateModified: modified,
    slug: path,
    origin,
    wordCount
  });

  return (
    <div className="bg-white">
      <Helmet>
        <title>Stromspeicher 2025 – LiFePO4 vs NMC, Dimensionierung & ROI</title>
        <meta name="description" content="Stromspeicher 2025: LiFePO4 vs NMC, Zyklenfestigkeit, ideale Dimensionierung, Wirtschaftlichkeit & ROI Strategien für nachhaltige Autarkie im Haushalt." />
        <meta property="og:title" content="Stromspeicher 2025 – LiFePO4 vs NMC, Dimensionierung & ROI" />
        <meta property="og:description" content="Stromspeicher 2025: LiFePO4 vs NMC, Zyklenfestigkeit, ideale Dimensionierung, Wirtschaftlichkeit & ROI Strategien für nachhaltige Autarkie im Haushalt." />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={origin + path} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
        <script type="application/ld+json">{JSON.stringify(service)}</script>
        <script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      </Helmet>
      <article className="pro-container py-16" id="main-content" ref={articleRef}>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Speicher & Autarkie</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight">Stromspeicher 2025: Technologien & Wirtschaftlichkeit</h1>
          <p className="mt-6 text-lg text-neutral-600">Diese Seite erklärt die relevanten Speicherchemien, dimensioniert wirtschaftlich sinnvolle Kapazitäten und zeigt, wie intelligente Steuerung Ihren Eigenverbrauch stabil erhöht – Grundlage für echte Unabhängigkeit.</p>
        </header>
        <section className="mt-12 prose prose-neutral max-w-none">
          <h2>1. Zellchemien im Überblick</h2>
          <p>LiFePO4 dominiert 2025 den Residential Markt: hohe thermische Stabilität, &gt;6.000 Zyklen bei 80% DoD und keine Kobalt-Abhängigkeit. NMC/NCA finden sich weiterhin in Bestands- oder Hochleistungsanwendungen mit enger Temperaturführung. LTO bleibt eine Nische (Kosten pro kWh hoch, dafür extreme Zyklen &gt;10.000). Für Privathaushalte schlägt das Sicherheits- & Lebensdauerprofil von LiFePO4 meist den etwas höheren spezifischen Energiegehalt anderer Chemien.</p>
          <h2>2. Zyklen, Nutzungstiefe & Alterung</h2>
          <p>Die reale Lebensdauer ergibt sich aus einem Zusammenspiel von Nutzungstiefe (Depth of Discharge), Temperaturfenster, C-Rate und Kalenderalterung. Moderate Lade-/Entladeraten (&lt;0,5C) und Temperaturmanagement (Vermeidung dauerhafter &gt;35°C) halten Kapazitätsverlust im einstelligen Prozentbereich innerhalb der ersten 5 Jahre.</p>
          <h2>3. Dimensionierungslogik</h2>
          <p>Eine praxisnahe Formel: <strong>Speicher-kWh ≈ Jahresverbrauch (kWh) × 0,8 / 365 × 1,2</strong> (Faktor 1,2 für saisonale Varianz). Ergänzend werden Lastspitzen (Abendkochen, Wärmepumpe, E-Auto) qualitativ betrachtet. Überdimensionierung führt zu hohen „unangetasteten“ Kapazitätsreserven und verschiebt Payback nach hinten.</p>
          <h2>4. Wirtschaftliche Bewertung</h2>
          <p>Der Speicher wandelt Überschussstrom mit Roundtrip-Effizienzen von 88–94% in netzbezugssenkende Energie. Effektiv ersetzen Sie teuren Haushaltsstrom (0,34–0,42 €/kWh) statt ihn für niedrige Einspeisevergütung (≈0,08 €/kWh) abzugeben. Der Mehrwert steigt mit Spread und Verbrauchsstruktur. Eine <a href="/rechner" className="underline decoration-dotted">individuelle Simulation</a> quantifiziert diesen Vorteil belastbarer.</p>
          <h2>5. Integration & Steuerung</h2>
          <p>Hybrid-Wechselrichter minimieren Wandlungsverluste und ermöglichen Notstrom (Inselbetrieb) oder Ersatzstrom (priorisierte Lastkreise). Intelligente Steuerlogik priorisiert: (1) Grundlast decken, (2) Peak Shaving, (3) vorbereitende Ladung vor Schlechtwetterfenstern. Schnittstellen (REST/MQTT) öffnen Pfade für dynamische Tarife & Prognosemodelle.</p>
          <h2>6. Sicherheitsaspekte</h2>
          <p>Zertifizierungen (z.B. VDE-AR-E 2510-50), integrierte Zellüberwachung (BMS) und Brandschutz-Trennschalter reduzieren Restrisiken. Installation: freie Luftzirkulation, Abstand zu brennbaren Materialien & separater Stromkreis für kritische Verbraucher.</p>
          <h2>7. Interner Kontext & Weiterführende Inhalte</h2>
          <p>Vertiefung zu <a href="/photovoltaik-kosten" className="underline decoration-dotted">Kosten & ROI</a>, <a href="/finanzierung-foerderung" className="underline decoration-dotted">Förderungen</a> sowie <a href="/service" className="underline decoration-dotted">Wartung / Service Differenzierung</a>. Synergie: Optimal dimensionierter Speicher plus effiziente <a href="/technologie" className="underline decoration-dotted">Systemtechnologie</a> stabilisiert Amortisationspfade.</p>
          <h2>8. FAQ Kurzüberblick</h2>
          <p>Die kompakten Antworten (siehe strukturierte FAQ) adressieren wiederkehrende Kernfragen – längere Deep Dives erfolgen in kommenden Unterartikeln (Lastprofilmessung, Wärmepumpe + PV + Speicher Triangulation).</p>
          <h2>9. Fazit</h2>
          <p>Ein sauber dimensionierter LiFePO4 Speicher verschiebt Ihre Anlage von „hoher Ersparnis tagsüber“ zu <strong>planbarer Jahresenergie-Kostenreduktion</strong>. Wirtschaftliche Kennzahl bleibt: zusätzliche Eigenverbrauchskilowattstunde Kosten vs. vermiedener Netzpreis. Jede Optimierung (Lastverschiebung, intelligente Steuerung) drückt diesen Quotienten weiter nach unten.</p>
        </section>
        <footer className="mt-16 border-t pt-8 text-sm text-neutral-500">Aktualisiert: {new Date().toISOString().substring(0,10)} – Nächste Erweiterung: Vergleichstabelle Chemien & Roundtrip Effizienz Kurven.</footer>
      </article>
    </div>
  );
}
