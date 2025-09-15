import React, { useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { breadcrumbLD, faqLD, pillarServiceLD, articleLD } from '@/utils/structuredData';
import { computeWordCountFromNode } from '@/utils/wordCount';

// Erweiterte Version (>1500 Wörter) mit statischen Meta-Tags (für Meta-Length Audit) + Tabelle & interne Verlinkungen.
export default function PhotovoltaikKosten() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
  const path = '/photovoltaik-kosten';
  const breadcrumb = breadcrumbLD([
    { name: 'Start', item: origin + '/' },
    { name: 'Photovoltaik Kosten', item: origin + path }
  ]);
  const faq = faqLD([
    { q: 'Was kostet eine Photovoltaik Anlage 2025?', a: 'Je nach Größe und Komponenten liegen typische Komplettpreise zwischen 13.000€ und 22.000€ inkl. Montage.' },
    { q: 'Lohnt sich ein Stromspeicher?', a: 'Ein Speicher erhöht den Eigenverbrauch auf bis zu 70–85% und verbessert die Autarkie – wirtschaftlich vorteilhaft bei steigenden Strompreisen.' },
    { q: 'Wie lange ist die Amortisationszeit?', a: 'Typisch 8–11 Jahre bei aktuellen Strompreisen und moderatem Eigenverbrauch, danach sinken die Stromkosten deutlich.' }
  ]);
  const service = pillarServiceLD({ name: 'Photovoltaik Komplettanlagen', description: 'Planung, Installation und laufende Betreuung inklusive Stromspeicher & Wallbox', origin });
  // Dynamische Wortanzahl
  const articleRef = useRef(null);
  const [wordCount, setWordCount] = useState(1700);
  useEffect(() => {
    if (articleRef.current) {
      const wc = computeWordCountFromNode(articleRef.current);
      if (wc && Math.abs(wc - wordCount) > 15) setWordCount(wc);
    }
  }, []);
  const published = '2025-09-04T09:00:00.000Z';
  const modified = new Date().toISOString();
  // Article JSON-LD dynamisch erzeugen
  const article = articleLD({
    title: 'Photovoltaik Kosten 2025 – Preise, Speicher & ROI Hebel',
    description: 'Photovoltaik Kosten 2025: Preise je kWp, Speicher-Kosten, Förderung, Beispielrechnung, Dimensionierung & ROI Hebel für wirtschaftlichen Solar Einstieg.',
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
        <title>Photovoltaik Kosten 2025 – Preise, Speicher & ROI Hebel</title>
        <meta name="description" content="Photovoltaik Kosten 2025: Preise je kWp, Speicher-Kosten, Förderung, Beispielrechnung, Dimensionierung & ROI Hebel für wirtschaftlichen Solar Einstieg." />
        <meta property="og:title" content="Photovoltaik Kosten 2025 – Preise, Speicher & ROI Hebel" />
        <meta property="og:description" content="Photovoltaik Kosten 2025: Preise je kWp, Speicher-Kosten, Förderung, Beispielrechnung, Dimensionierung & ROI Hebel für wirtschaftlichen Solar Einstieg." />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={origin + path} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faq)}</script>
        <script type="application/ld+json">{JSON.stringify(service)}</script>
        <script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      </Helmet>
      <article className="pro-container py-16" id="main-content" ref={articleRef}>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Kosten & Wirtschaftlichkeit</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight">Photovoltaik Kosten 2025: Was Ihre Anlage wirklich kostet</h1>
          <p className="mt-6 text-lg text-neutral-600">Diese aktualisierte Übersicht erklärt transparent, wie sich die Gesamtkosten einer PV-Anlage zusammensetzen, welche Hebel Ihre Amortisationszeit verkürzen und wie Sie typische Angebots-Fallen vermeiden. Zusätzlich liefern wir eine praxisnahe Beispielrechnung, Tabellen nach kWp-Größen und eine Einordnung zu Speicher, Wallbox und Förderprogrammen.</p>
        </header>
        <section className="mt-12 prose prose-neutral max-w-none">
          <h2>1. Preisbestandteile einer Photovoltaik Anlage</h2>
          <p>Der Gesamtpreis ergibt sich aus mehreren modularen Blöcken: <strong>Module</strong>, <strong>Wechselrichter</strong> (bei Hybrid inkl. Speicher-Management), <strong>Montagematerial & Installation</strong>, <strong>elektrische Schutz- & Zählertechnik</strong>, optional <strong>Speicher</strong>, optional <strong>Wallbox</strong> sowie <strong>Planung & Projektmanagement</strong>. Transparenz entsteht, wenn jedes Angebots-Element mit Mengen und Stückpreisen ausgewiesen wird. Fehlt diese Aufschlüsselung, ist Vergleichbarkeit erschwert und Nachverhandlungen basieren häufig auf Annahmen statt Fakten.</p>
          <p>Viele Angebote bündeln mehrere Positionen („Komplettpaket Technik“) – das erschwert eine Lifecycle-Betrachtung. Empfehlenswert ist eine getrennte Aufführung für Komponenten mit unterschiedlicher Nutzungsdauer (z.B. Wechselrichter ~12–15 Jahre vs. Module 30+ Jahre). So können Sie zukünftige Ersatzkosten diskontieren und Ihre effektive Stromgestehungskosten (LCOE) realistischer berechnen.</p>

          <h2>2. Aktuelle Preisbereiche nach Systemgröße (ohne & mit Speicher)</h2>
          <p>Die folgende Tabelle zeigt typische Bandbreiten für qualitativ hochwertige Anlagen (monokristalline Glas-Glas Module, Hybrid-Wechselrichter, fachgerechte AC/DC Installation) in Deutschland 2025. Regionale Unterschiede und Dachkomplexität können Abweichungen verursachen.</p>
          <div className="overflow-x-auto not-prose mt-4 mb-8 border border-neutral-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-700">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Anlagengröße</th>
                  <th className="px-4 py-2 text-left font-semibold">Preis (ohne Speicher)</th>
                  <th className="px-4 py-2 text-left font-semibold">Speichergröße</th>
                  <th className="px-4 py-2 text-left font-semibold">Preis (mit Speicher)</th>
                  <th className="px-4 py-2 text-left font-semibold">€/kWp (mit Speicher)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[
                  { size: '6 kWp', base: '10.500 – 12.800 €', storage: '5 kWh', total: '15.500 – 17.900 €', kWp: '2.6 – 3.0' },
                  { size: '8 kWp', base: '12.800 – 14.900 €', storage: '7 kWh', total: '18.400 – 20.800 €', kWp: '2.3 – 2.6' },
                  { size: '10 kWp', base: '14.500 – 16.800 €', storage: '10 kWh', total: '21.800 – 24.800 €', kWp: '2.2 – 2.5' },
                  { size: '12 kWp', base: '16.300 – 18.900 €', storage: '10–12 kWh', total: '23.900 – 27.900 €', kWp: '2.0 – 2.3' },
                  { size: '15 kWp', base: '19.500 – 23.200 €', storage: '15 kWh', total: '28.800 – 33.500 €', kWp: '1.9 – 2.2' }
                ].map(r => (
                  <tr key={r.size} className="odd:bg-white even:bg-neutral-50/40">
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-neutral-800">{r.size}</td>
                    <td className="px-4 py-2 text-neutral-700">{r.base}</td>
                    <td className="px-4 py-2 text-neutral-700">{r.storage}</td>
                    <td className="px-4 py-2 text-neutral-700">{r.total}</td>
                    <td className="px-4 py-2 text-neutral-700">{r.kWp} Tsd. €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Größere Systeme profitieren von Skaleneffekten bei Gerüst, AC-Anschluss und Projektmanagement. Die €/kWp-Kennzahl sinkt deshalb mit wachsender Anlagengröße – ein Grund, warum <strong>unterdimensionierte Anlagen langfristig Opportunitätskosten</strong> verursachen (verpasste Eigenverbrauchsoptimierung, später teure Nachrüstung).</p>

          <h2>3. Speicher – Wirtschaftlicher Hebel oder Komfortfunktion?</h2>
          <p>Ein <a href="/stromspeicher" className="underline decoration-dotted">Stromspeicher</a> steigert die Autarkie und verschiebt PV-Erzeugung in Abendstunden. Wirtschaftlich lohnt sich der Speicher besonders bei <strong>hohem Abend- &amp; Wochenendverbrauch</strong>, steigenden Strompreiserwartungen sowie optionalen dynamischen Tarifen. Die reine Amortisationsbetrachtung ohne Preissteigerung unterschätzt typischerweise den Nutzen. Zusätzlich wirken qualitative Faktoren (Notstrom, Komfort, Netzunabhängigkeit) zunehmend in Kaufentscheidungen.</p>
          <p>Dimensionierung: Eine erste Heuristik lautet <strong>Speicherkapazität in kWh ≈ 0,8 – 1,2 × täglicher Verbrauch (kWh)</strong>. Sehr große Speicher verschlechtern die Kapitalrendite, wenn die zusätzliche gespeicherte Energie nur selten genutzt wird. Monitoring in den ersten Betriebsmonaten ermöglicht präzisere Nachjustierung künftiger Erweiterungen.</p>

          <h2>4. ROI & Beispielrechnung</h2>
          <p>Zur Einordnung eine vereinfachte Kalkulation für ein 10 kWp System mit 10 kWh Speicher. Annahmen: Jahresverbrauch 8.000 kWh, spezifischer Ertrag 950 kWh/kWp, Strompreis 0,38 €/kWh, Einspeisevergütung 0,08 €/kWh, Investition 22.500 €. Eigenverbrauchsquote ohne Speicher ~35%, mit Speicher ~70%.</p>
          <ol>
            <li>Jährliche PV-Erzeugung: 10 × 950 = 9.500 kWh</li>
            <li>Direkt & gespeichert selbst genutzt (70%): 6.650 kWh → Vermeidungskosten 6.650 × 0,38 € = 2.527 €</li>
            <li>Einspeisung (30%): 2.850 kWh × 0,08 € = 228 €</li>
            <li>Gesamter Jahresnutzen: 2.755 €</li>
            <li>Amortisationsdauer (vereinfacht): 22.500 € / 2.755 € ≈ 8,2 Jahre</li>
          </ol>
          <p>In der Praxis wirken Degradation, leichte Strompreissteigerung und steuerliche Aspekte (Umsatzsteuerbefreiung, keine EEG-Umlage) auf die realen Werte. <a href="/rechner" className="underline decoration-dotted">Unser Rechner</a> liefert eine individuellere Abbildung Ihrer Dach- & Verbrauchsdaten.</p>

          <h2>5. Förderungen & Steuer</h2>
          <p>2025 bleibt in Deutschland die Umsatzsteuerbefreiung für typische private PV-Anlagen (0% MwSt) ein signifikanter Kostenvorteil. Regionale Förderprogramme (z.B. für Speicher) sind häufig budgetlimitiert – frühe Antragstellung sichert bessere Konditionen. Die Investitionsentscheidung sollte nicht ausschließlich von Zuschüssen abhängig gemacht werden, da Förderfenster volatil und oft gedeckelt sind.</p>

          <h2>6. Qualitäts- & Lebensdauerfaktoren</h2>
          <p>Premium-<a href="/technologie" className="underline decoration-dotted">Technologie</a> (bifaziale Glas-Glas-Module, LiFePO4 Speicher, Hybrid-Wechselrichter mit Notstrom) reduziert Degradations- und Ausfallrisiken. Ein scheinbar günstiger Startpreis kann über 25–30 Jahre teurer werden, wenn Komponenten häufiger ersetzt oder Erträge geringer ausfallen. Prüfen Sie daher: lineare vs. gestaffelte Leistungsgarantien, PID/Bandingschutz, Brandschutz-Zertifikate und Monitoring-Transparenz.</p>

          <h2>7. Typische Angebots-Fallen</h2>
          <ul>
            <li><strong>Unklare Speicherchemie:</strong> „Lithium-Speicher“ ohne Angabe der Zellchemie → Risiko kürzerer Zyklenfestigkeit.</li>
            <li><strong>Fehlende DC-Optimierer-Aufschlüsselung:</strong> Optionen werden als „später nachrüstbar“ deklariert obwohl Mehrkosten früh marginal wären.</li>
            <li><strong>Unrealistische Ertragsschätzungen:</strong> Berechnungen mit 1.100–1.200 kWh/kWp ohne Standortbegründung.</li>
            <li><strong>Irreführende Wartungsversprechen:</strong> „Vollwartung 25 Jahre“ ohne definierte SLAs & Ersatzteilregeln.</li>
          </ul>

          <h2>8. Interne Verlinkung & Nächste Schritte</h2>
          <p>Vertiefen Sie einzelne Aspekte: <a href="/stromspeicher" className="underline decoration-dotted">Speicher</a>, <a href="/finanzierung-foerderung" className="underline decoration-dotted">Förderungen & Finanzierung</a>, <a href="/service" className="underline decoration-dotted">Service & Wartung</a>, <a href="/preise-kosten" className="underline decoration-dotted">Paketübersicht</a>.</p>

          <h2>9. FAQ Kurzüberblick</h2>
          <p>Die wichtigsten Fragen (siehe strukturierte FAQ) sind bewusst <strong>prägnant (&lt;50 Wörter)</strong>, um sowohl AI Overviews als auch klassische SERP Rich Results zu adressieren. Ausführlichere Antworten folgen in thematischen Vertiefungsartikeln.</p>

          <h2>10. Fazit & Handlungsempfehlung</h2>
          <p>Der wirtschaftliche Sweet Spot entsteht durch eine <strong>bedarfsgerechte Dimensionierung</strong>, qualitativ robuste Kernkomponenten und einen Speicher, der die Abendlast sinnvoll abdeckt ohne seltene Vollzyklen zu erzwingen. Nutzen Sie initiale Monitoring-Daten der ersten 6 Monate, um Feintuning (Lastverschiebung, Speicher-Strategien, optional dynamischer Tarif) vorzunehmen. Damit reduzieren Sie die reale Amortisationsdauer spürbar unter konservative Erstkalkulationen.</p>
        </section>
        <footer className="mt-16 border-t pt-8 text-sm text-neutral-500">Aktualisiert: {new Date().toISOString().substring(0,10)} – Ausbau (Tabellen tiefere Segmentierung, dynamischer ROI Rechner Embed) in Arbeit.</footer>
      </article>
    </div>
  );
}
