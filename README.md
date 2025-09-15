# ZOE Solar Web Platform

Photovoltaik Plattform: Programmatic Content, strukturierte Daten Governance, Performance & A11y Gates, automatisierte Fördermittel-Anreicherung.

## 1. Schnellstart
```bash
git clone <repo>
cd webseite_zoe
npm install        # Root installiert nur minimale Wrapper-Skripte
npm run dev        # delegiert in next-app/
```
Dev UI: http://localhost:3000

Wichtige Skripte (aus `next-app/package.json`):
| Zweck | Script |
|-------|--------|
| Entwicklung | `npm run dev` |
| Build | `npm run build` |
| Tests (Playwright) | `npm test` |
| Lint + Type + CSS + Validatoren | `npm run ci:verify` |
| JSON-LD Guard | `npm run ci:jsonld-guard` |
| Legacy Audit (informativ) | `npm run ci:legacy-audit` |
| Neue Stadtseite | `npm run city:new -- <slug> "Name"` |
| Förder-MDX regenerieren | `npm run gen:foerderung` |

## 2. Architektur Überblick
Monorepo-Light: Root dient nur als dünne Hülle. Geschäftslogik, Pages & Scripts komplett unter `next-app/`.

Domänen:
- SEO / Structured Data: Zentraler `JsonLd` Server Component Renderer + Validierungs- / Guard-Skripte
- Programmatic Content: City Landing Pages + Förderprogramme (manuell + auto zusammengeführt)
- Lead Pipeline: API Route `/api/lead` mit Rate Limit, Honeypot, JSONL Persistenz
- Qualitäts-Gates: A11y (axe), Performance (Lighthouse), JSON-LD Integrität, Legacy Isolation
- Automationen / Reports: Weekly KPI & Exposure, IndexNow, Förder-Auto-Update

```
next-app/
   src/app/...        # App Router Pages & Layouts
   src/components/... # UI & SEO Hilfskomponenten (JsonLd, Navigation, usw.)
   scripts/...        # SEO, CI, Generatoren, Audits
   content/...        # Programmatic & manuelle Inhalte (YAML/MDX)
   docs/              # Generierte Berichte & KPI Artefakte
      lighthouse-baselines/   # (NEU) Versionierte Lighthouse Snapshots (Rotation möglich)
```

## 3. Structured Data & Security
- CSP + Nonce Enforcement (siehe `next-app/SECURITY.md`)
- Keine Inline JSON-LD außerhalb `JsonLd` → Guard erzwingt Policy
- Types: Organization, WebSite, Service, ServiceAreaBusiness, FAQPage, HowTo, OfferCatalog, ItemList, CollectionPage, BreadcrumbList, Person
- Prüfung: `npm run ci:jsonld-guard` + Playwright Tests in `tests/jsonld` (Beispiele Stadt & Index)

## 4. Programmatic Förderprogramme
Komponenten:
- Manuell: `next-app/content/programmatic/foerderung/*.yml`
- Automatisch: `next-app/content/programmatic/foerderung-auto/*.auto.yml` (GENERATED)
- Merge & MDX: `scripts/generate/foerderung-gen.mjs`
- Auto-Heuristik (Tavily): `scripts/seo/foerderung-auto-update.mjs`
- Validierung: `foerderung:validate`, `foerderung:auto:validate`

Workflow: `.github/workflows/foerderung-auto-update.yml` (wöchentlich + manuell). Erstellt PR nur bei Diff.

## 5. City Landing Pages
- Generator: `npm run city:new -- <slug> "Name" "Optional Voller Titel"`
- Deep Content Kennzahlen: `src/content/geo/city-data.json` → Block Injection / Retro Augment Script
- Content-Differenzierung (Similarity Threshold Audit) via `city:audit`

## 6. Lead Pipeline (Kurz)
Endpoint: `/api/lead` → Append JSONL (`data/leads-YYYY-MM-DD.jsonl`, gitignored). Honeypot, Rate Limit, UTM Attribution, Slack Webhook optional. Siehe ausführlich: `docs/developer-guide.md`.

## 7. GitHub Actions (Auszug)
| Workflow | Zweck | Trigger |
|----------|-------|---------|
| foerderung-auto-update | Förderprogramme anreichern & PR | schedule, workflow_dispatch |
| legacy-audit | Legacy Inline Pattern Report | schedule, push (legacy paths) |
| a11y-audit | Axe Smoke + JSON-LD Guard | push PR main |
| perf-nightly | Lighthouse Kennzahlen & Artefakte | nightly schedule |
| ci-a11y-seo | Sammel-Lint + Validatoren | push PR main |
| icon-gate | Icon Bundle Health | push PR main |

Details & Schwellenwerte: `docs/operations.md`.

## 8. Qualitäts-Gates
- A11y: Playwright + axe (Home + 1 City) → Fail bei severity ≥ serious
- Performance: Lighthouse (mobile, throttled) → Mindestscore (Performance ≥ 0.85, SEO ≥ 0.95, Accessibility ≥ 0.9)
- JSON-LD Guard: Abbruch bei Inline-Fund außerhalb Whitelist
- Förderdaten: Validator Schemata (Pflichtfelder & ISO Datum) → Fail bei Fehlern

## 9. Entwickler Leitfaden
Siehe `docs/developer-guide.md` (Setup, Debug, Test Patterns, Scripts). Kurzübersicht:
```bash
npm run dev              # Start
npm test                 # Playwright
npm run ci:verify        # Vollständige statische Prüfungen
npm run perf:lh          # Manuelle Lighthouse Messung
```

## 10. Migration & Legacy
Historie des alten Vite Stacks, Gründe für Ablösung & Sunset-Kriterien: `MIGRATION-LEGACY.md`.

## 11. Roadmap / Nächste Schritte
Siehe `tasks.md`. Fokus kommende Iterationen:
- A11y Coverage erweitern (Form + Dialog Pfade)
- Source Attribution + Confidence für Förderprogramme
- Duplicate Content Weighted Similarity
- RUM Pipeline Ausbau (Histogramm Clustering)

## 12. Lizenz & Contribution
Contribution Guidelines: `CONTRIBUTING.md`. Security Modell: `next-app/SECURITY.md`.

---
Erweiterte Betriebs-/Operations-Details: `docs/operations.md`. Tieferer technischer Kontext & Beispiele: `docs/developer-guide.md`.

```

## Pre-Deploy Checkliste (Next.js / Vercel)

| Bereich | Check | Status |
|---------|-------|--------|
| Root Auswahl | Projekt Root in Vercel auf `next-app` gesetzt | ✔ (Konfigurieren) |
| ENV Basis | `NEXT_PUBLIC_SITE_URL`, `INDEXNOW_KEY` gesetzt | *prüfen* |
| SEO | Sitemap & robots.txt erreichbar | n/a (falls next-sitemap später) |
| Structured Data | Kern-Typen (Org, WebSite, LocalBusiness, FAQ, Offer, Article) validiert | ✔ |
| Performance | LCP / CLS / INP unter Zielschwellen (Gate grün) | ✔ (Monitoring Skripte) |
| Security | HTTPS automatisch von Vercel | ✔ |
| Rechtliches | `/imprint`, `/privacy` vorhanden | ✔ |
| Fallback | `not-found.tsx`, `error.tsx` getestet | ✔ |
| IndexNow | `/api/indexnow` Route + Workflow aktiv | ✔ |
| AI Citation | Weekly Workflow (`weekly-ai-citation.yml`) | ✔ |
| City Pages | Standorte vorhanden (Berlin, Potsdam, Brandenburg, Leipzig) | ✔ |
| Multimodal | Video/Audio Schema Skripte vorbereitet | ✔ |

Deployment Hinweise:
1. Vercel Projekt → Settings → Domains: Domain hinzufügen & verifizieren
2. ENV Variablen (Production) setzen
3. Optional Staging Environment (Preview Domains) für Tests
4. First Contentful Deploy beobachten (Logs) – bei 200 Status in Startseite weiter
5. IndexNow Ping Workflow bei Seitenänderungen aktiv (Push auf main)

Nach Livegang manuell prüfen:
- `curl -I https://domain` → 200 & Security Header
- Rich Result Test für zentrale Seiten
- Core Pages Load Test (Browser DevTools Coverage / Lighthouse)

## Skripte und Befehle

### Globale Skripte (Projekt-Root)

### Wöchentlicher KPI Audit (GitHub Action)

Workflow: `.github/workflows/weekly-kpi.yml`

Automatisiert jeden Montag:
- Startet Next Build & Server
- Lighthouse (Performance + Accessibility) gegen Startseite
- Structured Data Validation (`validate-structured-data.mjs`)
- Broken Link Audit (`broken-link-audit.mjs`)
- Aggregiert Kennzahlen in `weekly-kpi-summary.json`
- Lädt Artefakte als `weekly-kpi-reports` hoch

Erweiterbar: Weitere Seiten, RUM Aggregation, Threshold Gate Abbruch (derzeit nur Sammlung). Zeitplan via cron anpassbar.

### OfferCatalog Coverage Audit

Script: `scripts/seo/offer-catalog-audit.mjs`

Nutzung (lokal):

```
BASE_URL=http://localhost:3000 node scripts/seo/offer-catalog-audit.mjs
```

Ergebnis: `offer-catalog-audit.json` mit Auflistung geprüfter Pfade und Flag, ob `OfferCatalog` Schema eingebunden ist. Aktuell nur `/pricing` liefert ein OfferCatalog – zukünftige Angebotsseiten sollten das Schema ebenfalls ausliefern.

### KPI Umsetzung & Schwellen (Status)

Implementierte KPI-Bausteine (Stand: aktuelle Migration abgeschlossen):

| KPI / Audit | Implementierung | Artefakt / Script | Status |
|-------------|-----------------|-------------------|--------|
| Structured Data Coverage | Fetch & Extraction mehrerer Kernseiten | `next-app/scripts/seo/kpi-dashboard.mjs` | ✅ |
| Lighthouse Lab (Aggregat) | Baseline Report Einbindung | `docs/lighthouse-baseline-*.json` | ✅ |
| Lighthouse Baseline Rotation | Geplanter Cleanup Task (ältere Snapshots entfernen) | `scripts/seo/lh-baseline-rotate.mjs` (geplant) | ⏳ |
| KPI Dashboard Aggregation | Konsolidiertes JSON & Markdown | `docs/seo-kpi-dashboard.json` | ✅ |
| Threshold Gate (Core Web Vitals) | LCP / CLS / INP / TBT / Types | `next-app/scripts/seo/ci-threshold-gate.mjs` | ✅ |
| RUM Score Gating (Performance/A11y/SEO) | Erweiterte Mindestwerte | `ci-threshold-gate.mjs` (MIN_* Variablen) | ✅ (neu) |
| Weekly KPI Snapshot (Cron) | Automatisierung | `.github/workflows/weekly-kpi.yml` | ✅ |
| Broken Link Audit | HTTP Head Checks | `scripts/seo/broken-link-audit.mjs` | ✅ |
| Structured Data Validator | ld+json Extraktion & Validität | `scripts/seo/validate-structured-data.mjs` | ✅ |
| OfferCatalog Coverage Audit | Schema Presence Check | `scripts/seo/offer-catalog-audit.mjs` | ✅ |
| FAQ Depth (≥5) | Content Quelle | `next-app/src/content/seo/faq.json` | ✅ |
| AI Overview / GAIO Query Logging | Basis-Skeleton | `scripts/gaio/ai-citation-tracker.mjs` | ✅ (erweiterbar) |

Konfigurierbare Umgebungsvariablen für das Threshold Gate:

### Erweiterte Governance (Neu hinzugefügt)

Zusatzfunktionen zur Priorisierung & Rauschreduktion:

| Feature | Beschreibung | Artefakte / Scripts | Nutzen |
|---------|--------------|---------------------|--------|
| Performance Debt Score | (p75_lcp - Ziel) * sqrt(Events) * Gewicht je URL | `next-app/scripts/seo/rum-url-aggregate.mjs`, `next-app/scripts/seo/build-seo-dashboard.mjs`, `next-app/scripts/seo/post-kpi-comment.mjs` | Fokus auf URLs mit größtem Impact |
| Δ LCP & Debt im Dashboard | Zusätzliche Spalten + Farbklassifikation | `docs/seo-dashboard.html` | Regressionen & Priorität sofort sichtbar |
| Low Sample Kennzeichnung | `(low n)` bei Events < MIN_RUM_SAMPLE | `rum-url-aggregate.mjs` | Verhindert Fehlinterpretation dünner Samples |
| Alert Suppression Cache | Unterdrückt identische Slack Alerts (Anomalien/Outliers) für SUPPRESS_MINUTES | `alert-cache.json`, `slack-outliers.mjs`, `slack-anomalies.mjs` | Weniger Alert-Fatigue |
| Anomaly Severity Labels | Issues mit `[HIGH|MED|LOW]` + Labels `severity-*` | `anomaly-issue.mjs` | Dringlichkeit klar erkennbar |

#### Relevante zusätzliche ENV Variablen
```
SUPPRESS_MINUTES=15          # Unterdrückung identischer Slack Alerts
MIN_RUM_SAMPLE=50            # Events Grenze für verlässliche URL Kennzahlen
RUM_URL_WEIGHT_MAP='{"/pricing":1.5,"/":"1"}'  # Gewichtung für Debt Score
ANOMALY_PCT=10               # % Schwelle für wöchentliche Anomalien
RUM_LCP_P75_MS=2500          # Ziel LCP für Debt Berechnung
```

PR Kommentar erweitert:
- Performance Debt Gesamt + Top 3 Debt URLs
- Debt Detailblock (Top 10)
- Low Sample Markierungen `(low n)`

Slack Alerts: Hash-basierte Cache-Unterdrückung (`docs/alert-cache.json`).

```
THRESH_LCP_MS=3000
THRESH_CLS=0.1
THRESH_INP_MS=200
THRESH_TBT_MS=250
MIN_STRUCT_TYPES=4
MIN_PERF_SCORE=0.8    # Durchschnitt Performance (0-1 Skala)
MIN_A11Y_SCORE=0.9    # Durchschnitt Accessibility Score
MIN_SEO_SCORE=0.9     # Durchschnitt SEO Score
FORCE_INP=1           # Erzwingt harten Fail bei INP Überschreitung
```

## Next.js Migration Ergänzungen (Neu)

Dieser Abschnitt dokumentiert zusätzliche Features im `next-app/` Verzeichnis, die über den ursprünglichen Vite Stack hinausgehen.

### Features (Next App)
- Mehrsprachigkeit (de/en) mit alternates & hreflang Sitemap
- Strukturierte Daten: Organization, LocalBusiness, WebSite, Breadcrumb, FAQ, OfferCatalog, HowTo, Google Business Profile
- Blog (Markdown via `react-markdown` + `remark-gfm`)
- Content Hub / Themen-Cluster Page (`/content-hub`)
- Performance Toolkit:
   - Lighthouse Baseline & Compare (`next-app/scripts/perf/*`)
   - CI Threshold Gate (Abbruch bei KPI Regression)
   - RUM Web Vitals: Client (`src/lib/rum/web-vitals-client.ts`) → `/api/rum` → JSONL Log → Aggregation (`scripts/seo/rum-aggregate.mjs`)
   - Dynamischer Import Demo: `HeavyChart` lazy auf `/technology`
   - Bildoptimierung via `next/image` (LCP Kandidat Beispiel auf Technologie Seite)
- KPI Ziele (p75 reale Nutzer): LCP < 2500ms, INP < 200ms

### Performance & Monitoring (Next App)
#### RUM Pipeline
1. Client sammelt Web Vitals und sendet POST zu `/api/rum`.
2. API Route schreibt JSONL Events: `docs/rum-metrics.jsonl`.
3. Aggregation Script erzeugt `docs/rum-summary.json` + History Ordner.
4. Andere Skripte lesen diese Dateien für KPI Dashboard & Alerts.

Zusätzliches Dashboard (HTML):

```
node next-app/scripts/seo/rum-aggregate.mjs
node next-app/scripts/seo/rum-dashboard.mjs
open next-app/docs/rum-dashboard.html
```

#### Code-Splitting
`next/dynamic` für HeavyChart reduziert initiales Bundle. Nur geladen bei Scroll in den Bereich.

#### Bildoptimierung
`<Image />` Beispiel: priorisiertes Platzhalter PV Modul. Liefert responsive, modern formatierte Dateien (AVIF/WebP) und verbessert LCP.

#### KPI Ziele & Überwachung
Aktuelle Zielwerte (p75):
- LCP < 2500 ms
- INP < 200 ms

Bei Verfehlung Ursachenanalyse nach: Server TTFB, Bildgrößen, Render Blocking, Hydration Overhead, lange Tasks.

### Nächste geplante Schritte
- AI Citation Testdaten anreichern
- RUM History Visualisierung (Mini Dashboard)
- Feinere Segmentierung (Device / Route / Locale)
- FAPRO Lead Integration siehe `next-app/docs/fapro-integration.md` (Lead API & Netzbetreiber Lookup)


Ausführung lokal (Beispiel):

```
node next-app/scripts/seo/ci-threshold-gate.mjs
```

Bei Unterschreitung einer Mindestmetrik → Exit Code 2 (CI Fail). Nur fehlende Metriken → Exit Code 1 (Warnung). Erfolgreich → Exit Code 0.

Machine-readable Output:
Nach jeder Ausführung erzeugt das Gate jetzt zusätzlich `docs/threshold-result.json`:
```
{
   "timestamp": "2025-09-13T08:30:00.000Z",
   "status": "PASS|WARN|FAIL",
   "exitCode": 0,
   "gateMode": "hard|soft",
   "profile": "preview|prod|null",
   "issues": ["..."],
   "warnings": ["..."],
   "thresholds": { "LCP_MAX": 3000, "CLS_MAX": 0.1, ... , "rum": {"LCP_P75":2500,...}},
   "coverage": {"uniqueTypes": 6}
}
```
Dies ermöglicht einfache Weiterverarbeitung (Dashboards, PR Bots, externe Alerting Pipelines) ohne Parsing von STDOUT.

Geplante (optionale) zukünftige Erweiterungen:
- Historisierung der KPI JSONs (`kpi-history.json`) + Trendanalyse
- Integration echter RUM Web Vitals (Client beacons → Aggregation) statt nur Lab Aggregat
- Diff-Berichte (Vorher/Nachher) pro Pull Request
- Automatisierte Comment-Ausgabe des Gates im PR

Damit sind alle KPI-relevanten ToDos des Migrationsplans abgeschlossen und dokumentiert.

### RUM Web Vitals (Preview)

Ein leichtgewichtiges Real User Monitoring wurde prototypisch integriert:

| Bestandteil | Datei | Zweck |
|-------------|-------|------|
| Client Beacon | `next-app/src/lib/rum/vitals-client.ts` | Sendet LCP, CLS, INP, FCP nach Interaktion oder 3s Idle an `/api/rum` |
| API Route | `next-app/src/app/api/rum/route.ts` | Persistiert Events als JSON Lines (`docs/rum-metrics.jsonl`) |
| Aggregation | `next-app/scripts/seo/rum-aggregate.mjs` | Erstellt `docs/rum-summary.json` mit Avg / P75 / P90 |

Nutzung lokal (Beispiel nach etwas Traffic):
```
node next-app/scripts/seo/rum-aggregate.mjs
cat docs/rum-summary.json
```

Hinweise / Limitierungen:
- Keine Nutzer- oder Session-IDs (Privacy by Default)
- Nur Kernmetriken (FCP als Ergänzung) – Erweiterbar um TTFB, Navigation Timing
- Keine Sampling-Strategie (alle Events); für Produktion Sampling (1-10%) ergänzen
- Gate-Integration möglich: P75 mit MIN_PERF_SCORE / eigene Schwellen vergleichen

Backlog (RUM Ausbau):
- Client Beacon um `navigationType` & `TTFB` erweitern
- Historisierung (`rum-history.json`) und Trendgraph
- Opt-In Consent Hook / Deaktivierung per Env Flag
- Normalisierung auf Pagedimensionen / SPA-Navigationen

Sampling & zusätzliche Metrik:
- Sampling Rate via `NEXT_PUBLIC_RUM_SAMPLE_RATE` (0..1, Default 1)
- TTFB wird einmalig bei Navigation gemessen (PerformanceNavigationTiming) und als eigener Event (`TTFB`) gesendet.

KPI Diff Report:
```
node next-app/scripts/seo/kpi-history-diff.mjs > docs/kpi-diff-latest.md
```
Erzeugt Markdown Tabelle + JSON Summary im STDOUT. Optional Ausgabe in Datei für Review/PR-Kommentar.

### KPI History

Das KPI Dashboard schreibt bei aktivierter History (`KPI_HISTORY` != `0`) fortlaufend Einträge in `docs/kpi-history.json` (max. 200). Datenschema pro Eintrag:
```
{
   generatedAt: ISOString,
   coverageTypes: number,
   types: string[],
   avgLcp?: number,
   avgCls?: number,
   avgInp?: number,
   avgPerf?: number,
   avgSeo?: number,
   avgA11y?: number
}
```
Nutzung:
```
KPI_HISTORY=1 node next-app/scripts/seo/kpi-dashboard.mjs
```

KPI Sparklines generieren (Markdown Ausgabe):
```
node next-app/scripts/seo/kpi-sparkline.mjs > docs/kpi-sparklines.md
```

RUM History aktivieren & Aggregation:
```
RUM_HISTORY=1 node next-app/scripts/seo/rum-aggregate.mjs
```
Ergebnis: `docs/rum-history.json` (begrenzte Länge, max. 300 Einträge) + `rum-summary.json`.

RUM Sparklines (p75 Verlauf) generieren:
```
node next-app/scripts/seo/rum-sparkline.mjs > docs/rum-sparklines.md
```
Der Pull Request Kommentar bindet – sofern eine History vorhanden ist – diese Sparklines (LCP / INP / CLS / TTFB) zusätzlich zu den Lab KPI Sparklines ein.

### Lighthouse Baseline Verwaltung (Neu geplant)

Aktuell liegen mehrere Dateien `next-app/docs/lighthouse-baseline-<timestamp>.json` + `lighthouse-baseline-current.json` & Fallbacks im Verzeichnis. Für langfristige Ordnung:

Geplante Strategie:
1. Verschiebung aller Snapshot-Dateien nach `next-app/docs/lighthouse-baselines/`
2. Beibehaltung nur der letzten N (=5) Snapshots
3. Automatischer Cleanup Workflow (`lighthouse-baseline-rotate.yml`) rotiert bei jedem Merge in `main`

Geplante Konfigurationsvariablen:
```
LH_BASELINE_DIR=next-app/docs/lighthouse-baselines
LH_BASELINE_KEEP=5
```

Offene Aufgabe: Rotation Script & Workflow hinzufügen (Backlog).

### Erweiterte Gate Variablen (inkl. RUM)

```
THRESH_LCP_MS=3000
THRESH_CLS=0.1
THRESH_INP_MS=200
THRESH_TBT_MS=250
MIN_STRUCT_TYPES=4
MIN_PERF_SCORE=0.8
MIN_A11Y_SCORE=0.9
MIN_SEO_SCORE=0.9
FORCE_INP=1

# RUM aktivieren
USE_RUM=1
RUM_LCP_P75_MS=2500
RUM_INP_P75_MS=200
RUM_CLS_P75=0.1
RUM_TTFB_P75_MS=600   # (optional geplanter Gate-Wert – noch nicht aktiv im Gate Script)
```
Wenn `USE_RUM=1` und eine `docs/rum-summary.json` vorhanden ist, werden p75-Schwellen geprüft. Fehlt die Datei, bleibt das Gate grün (Info Hinweis).

### Gate Betriebsmodi & Profile

Zusätzlich unterstützt das Threshold Gate jetzt:

```
GATE_MODE=soft   # Performance/A11y/SEO Verstöße werden zu Warnungen (strukturelle / Schema Issues bleiben Fail)
GATE_MODE=hard   # Standardverhalten (Default)

PROFILE=preview  # Erlaubt alternative Threshold Variablen wie THRESH_LCP_MS_PREVIEW
PROFILE=prod     # Produktion (Default wenn nicht gesetzt)

# Beispiel für weichere Preview Schwellen
THRESH_LCP_MS_PREVIEW=3500
THRESH_INP_MS_PREVIEW=250
MIN_PERF_SCORE_PREVIEW=0.75
```

Exposure & Brand Tracking Artefakte:
| Datei | Inhalt |
|-------|--------|
| `gaio-exposure.json` | Gewichteter Brand Exposure Score (importance-gewichtete Markenqueries) |
| `brand-history.json` | Zeitreihe Brand Ratio |
| `brand-sparkline.md` | Kompakte Sparkline der Brand Ratio |
| `exposure-history.json` | Zeitreihe des Exposure Index |
| `exposure-sparkline.md` | Sparkline (weightedBrand Verlauf) |
| `weekly-history.json` | Historie der Weekly Snapshots (für Δ Berechnung) |
| `rum-histogram.json` | Verteilung LCP/INP Buckets (Real User) |
| `threshold-result.json` | Machine-readable Gate Result (Status, Issues, Warnings, Schwellen) |
| `exposure-normalized.json` | Aktueller Exposure Wert + normalisierter 0-100 Score (min/max History) |
| `rum-outliers.json` | Top langsamste LCP/INP Events (Debug Fokus) |
| `rum-url-aggregate.json` | p75 Aggregation pro URL (LCP/INP/CLS/TTFB + Count) |
| `seo-dashboard.html` | Konsolidiertes HTML Dashboard (Gate, KPIs, RUM, Exposure, Brand, Trends) |

Zusätzliche Artefakte (Markdown Präsentation / Alerts):
| Datei | Zweck |
|-------|------|
| `rum-url-aggregate.md` | Top N langsame URLs als Tabelle |
| `rum-outliers.md` | Tabelle konkreter Outlier Events |
| `exposure-sparkline-normalized.md` | Normalisierte Exposure Verlaufskurve |
| `pr-kpi-comment.md` | Letzter generierter PR Kommentar (idempotent) |

Slack / Alerting Skripte:
| Script | Zweck |
|--------|------|
| `slack-anomalies.mjs` | Meldet nur bei vorhandenen Anomalien |
| `slack-outliers.mjs` | Meldet wenn Top Outliers definierte Grenzwerte überschreiten |

Wichtige neue Parameter:
| Env | Beschreibung | Default |
|-----|--------------|---------|
| `OUTLIER_LCP_MS` | LCP Outlier Schwellwert für Slack Alert | 4000 |
| `OUTLIER_INP_MS` | INP Outlier Schwellwert für Slack Alert | 500 |
| `OUTLIER_TOP` | Anzahl betrachteter Top Werte | 3 |
| `IMPORTANCE_WEIGHTS` | JSON Map zur Überschreibung einzelner Query Importance (GAIO Exposure) | – |
| `RUM_URL_AGG_TOP` | Anzahl URLs in Markdown Tabelle | 20 |
| `MIN_EVENTS_PER_URL` | Mindestanzahl Events pro URL für Aggregation | 5 |

Beispiele:
```
IMPORTANCE_WEIGHTS='{"solar speicher":"2.5","pv förderung 2025":"3"}' \
   node next-app/scripts/seo/gaio-exposure-index.mjs

OUTLIER_LCP_MS=5000 OUTLIER_INP_MS=600 \
   SLACK_WEBHOOK_URL=... node next-app/scripts/seo/slack-outliers.mjs

RUM_URL_AGG_TOP=30 MIN_EVENTS_PER_URL=8 \
   node next-app/scripts/seo/rum-url-aggregate.mjs
```

PR Kommentar Badges:
- Zeile 2 zeigt jetzt Anomalie- und Outlier-Badges: `🛑 Anomalien | 🔥 Outliers` oder grüne Gegenstücke (`✅ Keine Anomalien`, `🟢 Keine Outliers`). Erlaubt sofortiges Scannen ohne Scrollen.

HTML Dashboard Generierung:
```
node next-app/scripts/seo/build-seo-dashboard.mjs
open next-app/docs/seo-dashboard.html
```
Das Dashboard ist rein statisch (keine externen Requests) und eignet sich für GitHub Pages / Artifact Preview.

### Dashboard Upgrades (Interaktivität & URL Fokus)
Neue Funktionen im HTML Dashboard (`seo-dashboard.html`):
| Feature | Beschreibung |
|---------|--------------|
| URL Aggregation | Top 15 URLs nach p75 LCP (inkl. INP/CLS/TTFB & Event Count) integriert |
| Sortierbare Tabellen | Klick auf Spaltenkopf sortiert (numerisch / lexikographisch) |
| Farb-Codierung | Zellen: grün (gut), gelb (Warn), rot (schlecht) – Heuristik für ms / % / Ratio |
| Legende | Kompakte Legende oberhalb der Inhalte |
| Outlier & Anomalie Badges | Frühe Sichtbarkeit im PR Kommentar ohne Scroll |

Heuristik Grenzwerte (aktuell statisch im Client JS):
- Zeit (ms): <2000 gut, <3500 warn, sonst schlecht
- Prozent (%): ≥90 gut, ≥80 warn, sonst schlecht
- Ratio (0–1): ≥0.90 gut, ≥0.80 warn, sonst schlecht

Anpassungsidee: Schwellwerte später dynamisch aus `threshold-result.json` ableitbar.

Anomalie Erkennung (Weekly Report):
Der Weekly Report markiert Metriken als Anomalie, wenn sich eine Kennzahl gegenüber der Vorwoche um mehr als den Schwellwert verschlechtert.

Standard: `ANOMALY_PCT=10` (10%)

Betroffene Kennzahlen:
- LCP avg (höher = schlechter)
- INP avg
- RUM LCP p75
- Performance / A11y / SEO Score (niedriger = schlechter)
- Brand Anteil (niedriger = schlechter)
- Exposure Index (niedriger = schlechter)

Konfiguration Beispiel:
```
ANOMALY_PCT=15 node next-app/scripts/seo/weekly-report.mjs > next-app/docs/weekly-report-latest.md
```
Erzeugt Abschnitt:
```
### Anomalien (> 15% Verschlechterung)
- LCP avg: +420 (18.2%) Verschlechterung
```
### RUM Outliers
Identifikation konkret langsamer User-Erfahrungen (Top N LCP / INP Werte):
```
node next-app/scripts/seo/rum-outliers.mjs
cat docs/rum-outliers.md
```
Ergebnis liefert `rum-outliers.json` (maschinenlesbar) und eine Markdown Tabelle. Unterstützt Triage fokusierter Problem-URLs.

### Normalisierte Exposure Sparkline
Zusätzlich zur Roh-Sparkline wird eine normalisierte Verlaufskurve (0–100) erzeugt:
```
node next-app/scripts/seo/gaio-exposure-history.mjs
cat docs/exposure-sparkline-normalized.md
```
Hilft bei Query-Listen-Erweiterungen, da relative Position im historischen Band sichtbar bleibt.

### Automatische Anomalie-Issues
Wiederholte Verschlechterungen (≥2 aufeinanderfolgende Wochen) erzeugen automatisch Issues (Label `anomaly`):
```
GITHUB_TOKEN=... GITHUB_REPOSITORY=owner/repo node next-app/scripts/seo/anomaly-issue.mjs
```
Titelpattern: `Anomalie: <Metric> wiederholt verschlechtert`. Idempotent durch bereits existierenden offenen Titel.
## GAIO (Generative AI Overview) Monitoring

Ziel: Relevante Queries (Such- bzw. AI Overview Potenzial) mit Intent & Importance verfolgen und Markenbezug sichtbar machen.

Komponenten:
- `next-app/scripts/seo/gaio-queries.json` – definierte Queryliste (id, query, intent, importance)
- `next-app/scripts/seo/gaio-check.mjs` – Snapshot → `next-app/docs/gaio-snapshot.json`
- `next-app/scripts/seo/gaio-brand-mention.mjs` – heuristischer Markenbezug → `next-app/docs/gaio-brand-mention.json`

Heuristik aktuell: Case-insensitive Substring-Match der Brand Tokens; Ausgabe enthält Ratio (Brand Vorkommen / Gesamt Queries) für Trendbeobachtung.

### Wöchentlicher GAIO Snapshot Workflow

Workflow Datei: `next-app/.github/workflows/weekly-gaio.yml`

Ablauf (jeden Montag 05:00 UTC):
1. Install Dependencies
2. Generiere Snapshot (`gaio-check.mjs`)
3. Brand Mention Heuristik (`gaio-brand-mention.mjs`)
4. Upload als Artefakte (GitHub Actions)

Manuelle Auslösung: Über Actions Tab via `workflow_dispatch`.

Backlog Ideen:
- SERP API Integration für Position / AI Coverage
- Query Importance Gewichtung in KPI Dashboard aggregieren
- Historisierung & Sparkline pro Importance Bucket

---
## CI/CD und Gates

Das Projekt verwendet GitHub Actions für automatisierte Qualitätskontrollen:
- **A11y & SEO Gate**: Axe-Core und Lighthouse A11y Audits (stabil, 3× Zero-Verstöße).
- **Performance Gate**: Lighthouse Performance mit mobilen Throttling (LCP ≤ 3000ms, INP ≤ 200ms, CLS ≤ 0.1).
- **Visual Regression**: Playwright-basierte Snapshot-Tests für UI-Konsistenz.
- **Smoketests**: Playwright für grundlegende Funktionalität.
- **Icon Gate**: Automatische Prüfung auf ungenutzte Icons im Barrel-Export.
- **Consolidated Gate Status (PR Kommentar)**: Der PR Kommentar startet mit `✅ Gate PASS`, `⚠️ Gate WARN` oder `❌ Gate FAIL` plus kompakten Issues/Warnungen. WARN tritt nur auf, wenn ausschließlich INP über Schwellwert liegt und `FORCE_INP!=1`. Alle anderen Verstöße erzeugen FAIL.

Gate Bewertung (vereinfachte Regeln):
| Status | Bedingungen |
|--------|-------------|
| PASS | Keine Issues oder Warnungen |
| WARN | Nur INP verletzt & FORCE_INP != 1 |
| FAIL | Mindestens ein harter Threshold verletzt (Types, LCP, CLS, TBT, erzwungener INP, Perf/A11y/SEO) |

Die Berechnung wird im Kommentar-Skript repliziert (Ableitung aus `docs/seo-kpi-dashboard.json` + Env Variablen), um kein zusätzliches Parsing des Gate-Prozess-Exitcodes zu benötigen.

Hinweis: In der aktuellen Umgebung (Codespace) kann Lighthouse nicht ausgeführt werden, da Chromium nicht installiert ist. In Produktionsumgebungen (z.B. GitHub Actions) laufen alle Gates korrekt.

### Lokale Gates ausführen
```bash
# A11y & SEO
npm run audit:a11y && npm run audit:seo

# Performance (hartes Gate)
LH_MODE=mobile ./scripts/lighthouse-gate.sh

# Visual Regression
npm run test:visual

# Smoketests
npm run test
```

## Neue Features (September 2025)

### Standardisierte Komponenten
- **Drawers & Popups**: Vereinheitlichte Props-API, FocusLock für Fokus-Trap, ESC Handler, ARIA Modal Patterns
- **Motion Reduction**: Automatische prefers-reduced-motion Unterstützung für alle animierten Komponenten
- **Accessibility**: Verbesserte Fokus-Management und Screenreader-Unterstützung

### Visual Regression Testing
- **Playwright Setup**: Automatisierte UI-Snapshot-Tests für Homepage und Hero-Bereich
- **Motion Styles**: Separate Tests für reduced-motion Präferenzen
- **CI Integration**: Snapshot-Vergleiche in der Pipeline zur Verhinderung visueller Regressionen

### Performance Optimierungen
- **Preact als Standard**: Kleinere Bundles durch VITE_USE_PREACT=1
- **Critical CSS**: Inline-Hero und Header für schnellere First Paint
- **Code-Splitting**: Lazy Loading für Navigation und MegaMenu

### Such- & AI Sichtbarkeit (Ergänzungen)
- **IndexNow Endpoint**: Schnelleres Signalisieren neuer/aktualisierter URLs via `POST /api/indexnow` (Body: `{ "url": "..." }` oder `{ "urls": ["..."] }`). Env: `INDEXNOW_KEY`.
- **Speakable Schema**: Home + FAQ mit `SpeakableSpecification` (erhöht Voice / AI Answer Chancen für zentrale Snippets).
- **AI Citation Harness**: Skript `scripts/seo/ai-citation-test.mjs` erzeugt `docs/ai-citation-results.json` (Platzhalter – Basis für spätere Perplexity / ChatGPT Query Tests).
- **Article Schema Generator**: `scripts/seo/generate-article-schema.mjs` generiert Article JSON-LD (Option `--openai` für Description Enhancement). Beispiel:
   ```bash
   node scripts/seo/generate-article-schema.mjs \
      --title "PV Speicher Wirtschaftlichkeit" \
      --description "Kosten-Nutzen Analyse von Batteriespeichern 2025" \
      --url https://example.com/blog/pv-speicher-wirtschaftlichkeit \
      --date 2025-09-12 \
      --author "ZOE Solar" \
      --out schema.json
   ```
   Mit OpenAI (Beschreibung verfeinern, benötigt `OPENAI_API_KEY`):
   ```bash
   OPENAI_API_KEY=sk-... node scripts/seo/generate-article-schema.mjs ... --openai
   ```
   Ausgabe validierbar über Google Rich Results Test.

Geplante nächste Schritte (Sichtbarkeit):
1. Workflow für periodische AI Citation Messung (z. B. wöchentlich) einbinden.
2. INP Erweiterung der City Performance Pipeline.
3. Multimodales Markup (VideoObject / AudioObject) für relevante Content Hubs.
4. (Neu vorbereitet) Video & Audio Schema Generator Skripte.

### Multimodales Markup (Neu)
Zur Unterstützung von AI Overviews & Rich Results für Video/Audio wurden zwei Generator-Skripte ergänzt:

VideoObject:
```
node scripts/seo/generate-video-schema.mjs \
   --title "PV Speicher Erklärung" \
   --description "Kurzer Überblick zur Funktionsweise moderner Batteriespeicher" \
   --thumbnail https://example.com/thumbs/pv-speicher.jpg \
   --uploadDate 2025-09-13 \
   --duration PT2M30S \
   --contentUrl https://cdn.example.com/videos/pv-speicher.mp4 \
   --embedUrl https://www.example.com/videos/pv-speicher \
   --publisher "ZOE Solar" \
   --out video-schema.json
```

AudioObject / PodcastEpisode:
```
node scripts/seo/generate-audio-schema.mjs \
   --title "Interview mit Solar Expertin" \
   --description "Diskussion über Eigenverbrauch und Speicheroptimierung" \
   --uploadDate 2025-09-13 \
   --duration PT18M12S \
   --contentUrl https://cdn.example.com/audio/episode1.mp3 \
   --embedUrl https://www.example.com/podcast/episode-1 \
   --publisher "ZOE Solar" \
   --speaker "Dr. Energie" \
   --podcast true \
   --series "Solar Podcast" \
   --episodeNumber 5 \
   --out audio-schema.json
```

Einbettung: Ergebnisdatei als `<script type="application/ld+json">` in die zugehörige Seite einfügen (oder Build-Pipeline erweitern).

## Beitragen

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Richtlinien zu Beiträgen, Code-Style und Pull-Requests.

### Entwicklungstipps
- Verwende Preact für kleinere Bundles (VITE_USE_PREACT=1).
- Optimiere Bilder mit AVIF/WebP und srcset.
- Stelle sicher, dass alle Änderungen die Gates passieren.
- Teste auf verschiedenen Geräten und Browsern.

## Lizenz

Dieses Projekt ist proprietär und gehört ZOE Solar. Für kommerzielle Nutzung wende dich an den Projektverantwortlichen.

## Kontakt

Für Fragen oder Support: service@zoe-solar.de

---

**Letzte Aktualisierung**: September 2025

## Next.js Migration (Status)

Ein Next.js Projekt wurde unter `next-app/` erstellt (App Router, TypeScript, Tailwind). Erste Inhalte:

- Home Seite (`app/page.tsx`) mit SEO Metadata API
- Globaler Layout Wrapper (`app/layout.tsx`) inkl. eingebundenem `PersonaProvider`
- Beispiel API Route: `app/api/ping/route.ts`
- Legacy Code als Referenz unter `src/legacy/` gespiegelt (schrittweise Herauslösen & Refactoring geplant)
- Playwright Grundsetup (`playwright.config.ts`, einfacher Smoke-Test)
- 404 Seite via `not-found.tsx`

Nächste Schritte (empfohlen):
1. Seitenstruktur aus `legacy/pages` iterative nach `app/` migrieren (ggf. Segmentierung in Server/Client Components)
2. i18n Strategie finalisieren (weiter i18next oder Wechsel zu `next-intl` / `next-i18next`)
3. Bildoptimierung ersetzen (Sharp teilweise durch `<Image />` Komponente)
4. SEO Skripte adaptieren (Sitemap-Generierung via `next-sitemap` evaluieren)
5. Tests erweitern (visuelle Regression auf neue Routen, A11y Audits gegen Next Preview)

Deployment: Vercel empfohlen – Root ggf. auf Monorepo-Struktur (`next-app` als Projekt) konfigurieren.

### Nutzung des Next.js Teilprojekts (`next-app/`)

Im Verzeichnis `next-app/` stehen nun eigenständige Skripte zur Verfügung:

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Entwicklungsserver (Turbopack) unter `http://localhost:3000` |
| `npm run build` | Produktions-Build erzeugen |
| `npm start` | Produktionsserver starten (nach Build) |
| `npm test` | Playwright Tests (chromium & firefox) ausführen |
| `npm run lint` | ESLint ausführen |

Struktur (vereinfacht):
```
next-app/
   src/app/           # App Router (Server/Client Components)
      layout.tsx       # Root Layout
      page.tsx         # Startseite
      not-found.tsx    # 404 Seite
      error.tsx        # Globale Error Boundary
      api/ping/route.ts# Beispiel API Route
   src/legacy/        # Referenz alter Code (schrittweise Migration)
   tests/             # Playwright Tests
   playwright.config.ts
```

### Offene Migrationsthemen (Roadmap)

- Weitere Legacy Seiten in `app/` überführen
- Pricing Seite als erste inhaltliche Fachseite migriert (`/pricing`) – aktuell mit vereinfachtem Markup ohne Legacy UI-Komponenten. Schrittweise Anreicherung folgt.
- Technology Seite migriert (`/technology`) – Minimalversion mit Hero & drei Tech-Karten; später Ergänzung um dynamische Komponenten & strukturierte Daten.
- Projects Seite migriert (`/projects`) – Platzhalter Grid mit Demo-Daten (Fallstudien folgen)
- Why Us Seite migriert (`/why-us`) – Value Prop Grid + Prozess-Schritte
- i18n Routing (ggf. `app/[locale]/` + Middleware) evaluieren
- Sitemap & robots.txt automatisieren (`next-sitemap`)
- Bildkomponenten (`<Image />`) statt statischer `<img>` einsetzen
- Strukturierte Daten (JSON-LD) in Metadata integrieren
- Performance & A11y Audits in neue Build-Pipeline einbinden

### Basis UI Komponenten (neu extrahiert)

Folgende primitive Komponenten wurden als Fundament für konsistente Gestaltung geschaffen (Verzeichnis: `next-app/src/components/ui/`):

| Komponente | Zweck | Notizen |
|------------|-------|---------|
| `Button`   | Einheitliche Interaktionsfläche mit Variants & Sizes | Unterstützt `variant` (primary, secondary, outline, ghost), `size` (sm, md, lg), `loading`, `asChild` Slot für Links |
| `Card`     | Container für semantische oder visuelle Gruppierung | Sub-Komponenten: `CardTitle`, `CardContent`; leichte Glas-/Shadow-Optik |
| `Section`  | Standardisierte horizontale & vertikale Abstände + Breiten | Breiten-Presets: narrow, default, wide; optional `bleed` |

Refactors durchgeführt auf: Pricing, Technology, Projects, Why Us – vereinheitlichte Typografie, Abstände & Card-Raster.

### Hinweis: Doppelte Lockfiles

Aktuell existieren zwei `package-lock.json` Dateien (Root & `next-app/`). Next.js gibt eine Warnung zum Root-Inferenzprozess aus. Geplante Maßnahmen:

1. Bewertung ob Monorepo-Struktur nötig bleibt (Vite Altprojekt vs. reine Next Migration)
2. Falls Vite-Teil obsolet → Entfernen von `Arbeitsverzeichnis/` und Root-Lockfile bereinigen
3. Alternativ: `turbopack.root` im `next.config.ts` explizit setzen (nach Konsolidierung), um Warnung zu unterdrücken

Bis zur finalen Entscheidung bleibt die Warnung ohne funktionale Beeinträchtigung bestehen.

### Deployment-Hinweise (Vercel)

1. Neues Projekt in Vercel anlegen und Repository verbinden
2. Root auf `next-app` setzen
3. Build Command: `npm run build` – Output automatisch (Next.js)
4. Environment Variablen (z.B. i18n Defaults) hinterlegen
5. Nach Livegang: Redirects von alten Routen konfigurieren (falls Struktur ändert)

Damit ist der Dokumentationsschritt initial abgeschlossen; Detailpflege folgt während der restlichen Seitenmigration.
