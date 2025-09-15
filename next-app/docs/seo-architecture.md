# SEO / AEO / GAIO Architektur

## Komponenten Übersicht
| Ebene | Zweck | Implementierung |
|-------|-------|-----------------|
| Metadata Factory | Einheitliche Titles, Canonicals | `src/lib/seo/metadata.ts` |
| JSON-LD Builder | Strukturierte Daten modular | `src/lib/seo/jsonld.ts` |
| GAIO Blocks | AI Overview Signals (Takeaways/QA) | `src/components/gaio/*` |
| KPI Scripts | Baseline & Coverage | `scripts/seo/*` |

## Unterstützte Schema Typen
- Organization / WebSite (Root Layout)
- OfferCatalog / Offer + AggregateOffer (Pricing)
- FAQPage (Pricing, erweiterbar)
- LocalBusiness (Contact)
- BreadcrumbList (alle Kernseiten)
- HowTo (Ablauf Pricing)

## Erweiterter OfferCatalog
`offersJsonLd` unterstützt:
- Preisrange (`minPrice`/`maxPrice` / AggregateOffer low/highPrice)
- Warranty (WarrantyPromise + ISO Duration)
- Kapazität (kWp), Payback, Kategorie als `additionalProperty`

## GAIO Signale
Ziel: Optimierung für AI Overviews / Answer Engines. Komponenten liefern:
- `KeyTakeaways`: Kompakte Kernlisten (max. 5) mit semantischer Struktur
- `QA`: Frage/Antwort Blöcke mit Short Answer + optionaler Long Answer

## KPI & Qualität
Scripts:
- `lighthouse-baseline.mjs`: Performance & Core Web Vitals (Fallback wenn kein Chrome)
- `kpi-dashboard.mjs`: Aggregiert Structured Data Coverage + Lighthouse
- `ci-threshold-gate.mjs`: Bricht CI bei Metrik Unterschreitung ab
- `pagespeed-fallback.mjs`: Optionaler Remote Fallback (PageSpeed API)
- `structured-data-validator.mjs`: Simpler Extraktor & Basis-Checks
- `kpi-orchestrator.mjs`: Orchestriert Build → Server → KPI Dashboard → Threshold Gate

### Orchestrator Nutzung
```bash
cd next-app
npm run kpi:orchestrate
```
Ablauf:
1. Optionaler Build (wenn `.next` fehlt oder `FORCE_BUILD=1`)
2. Freier Port Scan (ab 3010)
3. Start `next start`
4. Set `KPI_BASE` → KPI Dashboard
5. Threshold Gate Auswertung (Exit Code bestimmt CI Status)
6. Stop Server

Exit Codes:
- 0: Alle Schwellen + Coverage OK
- 1: Nur Warnungen (fehlende einzelne Metriken, keine harten Abweichungen)
- 2: Harte Verletzung (z.B. LCP > Threshold, zu wenige Schema Typen)

## Erweiterungspunkte
| Bereich | Nächster Schritt |
|---------|------------------|
| Internationalisierung | hreflang Umsetzung & locale-spezifische Sitemaps |
| Content Semantik | Article, BlogPosting, HowTo Ausweitung |
| Performance | Real Lighthouse mit installiertem Chromium in CI |
| GAIO | Programmatic FAQ Expansion + Answer Evidence Mapping |
| Monitoring | Historisierung (Zeitreihe) der KPI JSONs |

## CI Empfehlungen
1. `npm run build` (oder `next build`)
2. Server starten → KPI Dashboard Script (mit laufendem Server) → Threshold Gate
3. Playwright Tests (inkl. GAIO & strukturierte Daten Checks)
4. Optional: PageSpeed API für Prod URLs (Nightly)

## Datenqualität
- Minimierung von Schema-Duplikaten via zentraler Builder
- Atomic Changes: Jede Erweiterung (z.B. neues Schema) mit Test + KPI Diff

---
Stand: Architektur stabil. Fokus nächste Iteration: echte Performance Metriken & Internationalisierung.## SEO / GEO / AEO Architektur

Dieser Überblick dokumentiert die implementierte Struktur zur Such- & AI-Antwort-Optimierung (SEO, Local/GEO Signals, AI Overview / AEO) der Next.js App.

### Ziele
- Maximale strukturelle Interpretierbarkeit (Schema.org JSON-LD)
- Stabile, kanonische Metadaten (Titel, Beschreibung, Canonical)
- AI Overview / generative Antwort-Freundlichkeit (prägnante extrahierbare Blöcke)
- Monitoring & Metriken (Lighthouse, strukturierte Daten Abdeckung)

### Komponenten
1. Metadata Factory (`buildMetadata`)
   - Konsistente Titel- und OpenGraph/Twitter-Ausleitung
   - Kanonische URL via `canonicalPath`
   - Robots Flags zentral steuerbar

2. JSON-LD Builder (`src/lib/seo/jsonld.ts`)
   - `organizationJsonLd()` + `websiteJsonLd()` global in `app/layout.tsx`
   - `breadcrumbJsonLd(items)` jede Seite für Pfad-Kontext
   - `offersJsonLd(bundles)` Produkt-/Preisangebote (Pricing)
   - `faqJsonLd(items)` Teilmenge FAQs (Pricing)
   - `localBusinessJsonLd()` Vertrauens-/Geo-Signale (Contact)

3. GAIO Komponenten (`src/components/gaio`)
   - `KeyTakeaways`: Stichpunktartige Kernaussagen (Extrahierbarkeit durch Listenstruktur)
   - `QA`: Frage-Antwort Block, Kurzantwort via `data-answer-short` Attribut
   - Markierung durch `data-gaio-block` für automatisches Crawling / spätere Evaluierung

4. Inhalte / Datenquellen
   - `src/content/seo/faq.json` strukturierte FAQ Items (künftig erweiterbar)
   - `content/seo/gaio-queries.json` priorisierte Query-Liste für Monitoring

5. Automationsskripte (`scripts/seo/`)
   - `structured-data-validator.mjs`: Ruft Seiten ab, extrahiert alle `<script type="application/ld+json">`, prüft Grundstruktur
   - `ai-overview-logging.mjs`: Stub für Query→Result Snapshot (später SERP & AI Antwort Erfassung)
   - `lighthouse-baseline.mjs`: Performance & SEO Baseline (Fallback wenn Chrome fehlt)

### Monitoring Pipeline (Ist-Stand)
| Bereich | Werkzeug | Output |
|---------|----------|--------|
| Structured Data Präsenz | structured-data-validator | JSON-Auszug & Konsole | 
| Lighthouse KPIs | lighthouse-baseline | Snapshot JSON (Performance/SEO/Accessibility + Kernmetriken) |
| GAIO Block Coverage | Playwright Test `gaio-pricing.spec.ts` | Test-Report |

### Erweiterung Geplant
- PageSpeed API Fallback Skript (Remote Messung ohne lokalen Chrome)
- Erweiterte Offer-Daten (PreisRange, Warranty, Brand Referenzen)
- FAQ Vollabdeckung + eigene Seite mit `FAQPage`
- Potentiell `HowTo` oder `EnergyProduction` (Custom) JSON-LD für Installationsleitfaden
- Automatischer CI-Job: Bei PR -> Lighthouse + Schema-Validator -> Threshold Gate
- Citation Tracking (SERP / AI) – separate Sammlung & Verlauf

### Implementierungsrichtlinien
1. Jede neue Seite:
   - `export const metadata = buildMetadata({ title, description, canonicalPath })`
   - Breadcrumb JSON-LD mit vollständiger Pfadkette
2. Kommerziell oder transaktional relevante Seiten:
   - Prüfen ob Offers / Product / FAQ Segmente sinnvoll
3. Vertrauens-/Kontaktseiten:
   - `localBusinessJsonLd` + strukturierte Kontaktdaten
4. AI Overview Relevanz steigern:
   - Prägnante Listen (max 5 Bullet Kernpunkte)
   - Direkt beantwortete W-Fragen mit Kurzantwort <= ~160 Zeichen
5. Performance / Core Web Vitals:
   - Kritische CSS Pfade (separat vorhandenes Tooling) + LCP Element früh bereitstellen

### Nutzung der Skripte
Lighthouse Baseline (mit installiertem Chromium):
```
CHROME_PATH=$(which chromium) node scripts/seo/lighthouse-baseline.mjs --base http://localhost:3000 --paths / /pricing /technology /contact
```

Structured Data Validierung:
```
node scripts/seo/structured-data-validator.mjs --base http://localhost:3000
```

AI Overview Logging (Stub):
```
node scripts/seo/ai-overview-logging.mjs
```

### Daten Extraktion für Auswertung
Aus den Lighthouse JSON Snapshots die Keys:
```
categories.performance.score
audits.largest-contentful-paint.numericValue
audits.cumulative-layout-shift.numericValue
```
In vereinheitlichte `docs/kpi-history.json` (geplant) anhängen – später Visualisierung.

### Qualitätssicherung
- Playwright Tests prüfen Grundstruktur (GAIO + JSON-LD Typen) auf Pricing
- Erweiterung: Weitere Tests für Contact (LocalBusiness) & Technologie (Breadcrumb + Metadata)

### Nächste High-Impact Schritte (Prior Vorschlag)
1. PageSpeed Remote Fallback Skript
2. Erweiterte Offer Attributierung
3. Vollständige FAQ / eigene FAQ Seite
4. CI Integration mit Threshold Gate (Performance >= 0.85, SEO >= 0.95)
5. Citation Tracking MVP

---
Stand: Automatischer Export am {DATUM_PLACEHOLDER}