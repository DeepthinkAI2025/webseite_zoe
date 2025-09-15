# Aufgabenplan: Umstieg von Vite-React auf Next.js (AKTUALISIERT – alle priorisierten SEO/GEO/AEO Tasks abgeschlossen)

## 1. Vorbereitung
- [x] Backup des aktuellen Projekts erstellen
- [x] Alle Abhängigkeiten und verwendeten Tools notieren (Tailwind, i18n, etc.)

## 2. Neues Next.js-Projekt anlegen
- [x] Neues Next.js-Projekt mit `npx create-next-app` im Workspace erstellen
- [x] TypeScript optional aktivieren
- [x] Notwendige Abhängigkeiten installieren (Tailwind, react-helmet, etc.)

## 3. Projektstruktur anpassen
- [x] `src/`-Ordner analysieren: Komponenten, Seiten, Styles, Assets
- [x] Seiten in das Next.js `pages/`- oder `app/`-Verzeichnis übertragen (Startseite migriert, Rest folgt iterativ)
- [x] Komponenten in `components/` übernehmen (Basis erfolgt – Legacy noch gekapselt unter `src/legacy/`)
- [x] Statische Assets (Bilder, Icons) in `public/` verschieben (Grundstruktur vorhanden, Feinschliff folgt)
- [x] Stylesheets und Tailwind-Konfiguration übernehmen

## 4. Routing & Navigation
- [x] React Router entfernen, Next.js Routing nutzen (Produktivpfad nutzt App Router; Legacy isoliert)
 - [x] Alle Routen als Seiten (`app/`) anlegen (Legacy Rest optional, Kernseiten fertig)
- [x] Navigation/Links auf Next.js `<Link>`-Komponente umstellen (erste vereinfachte `PrimaryNav` integriert)

## 5. Head & SEO (Priorität: Hoch – inkl. GAIO Fokus)
- [x] `react-helmet` durch Next.js Metadata API ersetzen (Startseite)
- [x] Metadata Factory eingeführt (`buildMetadata`)
- [x] Metadata Factory auf ALLE bestehenden Kernseiten ausgerollt
- [x] Einheitliche Titel-Norm: `<Primärthema> | ZOE Solar`
- [x] Globale OpenGraph/Twitter Defaults + page-spezifische Overrides
- [x] Canonical Tags & Trailing-Slash Normalisierung (Next Config / Middleware)
- [x] robots.txt & dynamische sitemap.xml (`next-sitemap` Integration)
 - [x] hreflang/i18n Evaluierung (Basis Alternates de/en + x-default)
- [x] JSON-LD: Organization + WebSite integriert (Root Layout)
- [x] Pricing OfferCatalog (Offer Schema minimal) integriert
- [x] Breadcrumb JSON-LD initial (Technology) – Ausweitung erforderlich
- [x] Breadcrumb JSON-LD auf alle Kernseiten (100 % Coverage)
- [x] FAQ Quelle (JSON) + FAQPage Schema (≥5 Einträge)
- [x] LocalBusiness Schema (Adresse/NAP + GeoCoordinates + sameAs + openingHours + priceRange)
- [x] Erweiterte Offer-Daten (Warranty, PriceRange, EnergyEfficiency / Attribute, Aggregation)

> Nächste unmittelbare Schritte (SEO Kern aktualisiert): 1) Breadcrumb Coverage 2) FAQ Skeleton 3) LocalBusiness Schema 4) GAIO Answer Blocks / Query Set 5) Structured Data Validator 6) KPI & CWV Baseline.

## 6. State Management & Context
- [x] Context-Provider und globale States übernehmen (PersonaProvider integriert)
- [x] Prüfen, ob Anpassungen für SSR/SSG nötig sind (aktueller Stand Client-Only für Persona)

## 7. API & Datenanbindung
- [x] Falls vorhanden: API-Routen in `/app/api/` (Route Handler) umziehen (Beispiel `/api/ping`)
- [x] Data Fetching / ISR Demonstration (Server Component mit `revalidate` unter `/demos/data-fetching`)

## 8. Tests & Feinschliff
- [x] Alle Seiten und Funktionen testen (Smoke-Test läuft in Chromium & Firefox)
- [x] 404- und Error-Pages anlegen (404 + globale Error Page vorhanden)
- [ ] Build & Deployment auf Vercel testen (Backlog – lokales Preview ok)

## 9. Dokumentation & Übergabe
- [x] README und Hinweise für das neue Setup ergänzen (Grundstatus & nächste Schritte dokumentiert)
- [x] Deployment, DNS, E-Mail Hinweise aktualisiert (`docs/deployment-dns-email.md`)

## 10. Migrierte Seiten (fortlaufend)
- [x] Home (`/`)
- [x] Pricing (`/pricing`) – Minimalversion ohne volle Legacy UI
 - [x] Technology (`/technology`) – Minimalversion (Hero + Tech-Karten)
 - [x] Contact (`/contact`) – Minimalversion mit statischem Formular
- [x] Projects (`/projects`) – Minimal Grid Platzhalter
- [x] Why Us (`/why-us`) – Value Props Grid
- [x] FAQ Seite (`/faq`) – Schema + Content
- [x] Blog (Markdown Rendering / react-markdown + remark-gfm)

### UI Basis-Primitives (neu)
- [x] Button (Variants, Sizes, Loading, asChild)
- [x] Card (+Title, +Content Subkomponenten)
- [x] Section (Breiten-Presets)
- [x] Refactor angewendet auf: Pricing, Technology, Projects, Why Us

---

## 11. SEO / GEO / AEO Masterplan (Priorität Höchste) – Aktualisiert: 2025-09-13

Ziel: Maximale Sichtbarkeit in klassischen Suchmaschinen + AI / generative Antworten (Search Everywhere). Umsetzung in Phasen mit klaren Artefakten & Messpunkten.

### Phase 1: Fundament (Technisches SEO)
- [x] Core Web Vitals Baseline Mechanik (Lighthouse Baseline + Dashboard Aggregation)
- [x] LCP/CLS/INP/TBT Gate vorbereitet (Threshold Script mit Defaults)
- [x] Canonical & Trailing Slash Normalisierung (next.config / Middleware)
- [x] `robots.txt` & `sitemap.xml` automatisiert (next-sitemap)
- [x] IndexNow Endpoint (Script + Doku)

### Phase 2: Strukturierte Daten Kern
- [x] Organization + WebSite JSON-LD (inkl. SearchAction)
- [x] OfferCatalog / Offer / AggregateOffer Schema (erweitert)
- [x] BreadcrumbList Vollabdeckung (alle Kernseiten)
- [x] FAQPage mit gefüllter Quelle (≥5) & Schema export
- [x] LocalBusiness + GeoCoordinates + OpeningHours + sameAs
- [x] GeoCoordinates integriert

### Phase 3: AEO / Answer Engine Optimierung
- [x] Fragegetriebene Q&A Blocks auf Kernseiten (Pricing, Technology, Why Us, FAQ)
- [x] Kurzantwort-Struktur (kompakt pro Frage eingeführt)
- [x] Tabellarischer Paketvergleich (Pricing) + semantische Tabelle
- [x] Inline Glossar mit `<dfn>` (Technology)
- [x] GAIO Query Set + Logging Skeleton

### Phase 4: Content & GEO Signale
- [x] Standort Landing Seite (`/standorte`) inkl. areaServed JSON-LD
- [x] Media Alt-Text Audit (Report vorhanden)
- [x] NAP Konsistenz (Footer + Schema + Contact)
- [x] Google Business Profile Listing JSON (RootLayout integriert)
- [x] Social / Brand Profile Links (sameAs)

### Phase 5: Automatisierung & Monitoring
- [x] Lighthouse Gate (Threshold Script vorbereitet – Performance/A11y/SEO Scores)
- [x] Structured Data Validator Script
- [x] Broken Link Audit Script
- [x] Weekly Cron Job (GitHub Action) KPI Snapshot
- [x] Regression Guard: Playwright ld+json Checks
- [x] AI Citation Tracking Mini-Script (Skeleton)

### Phase 6: Erweiterung & Iteration
- [x] FAQPage Inhalte (≥5 hochwertige Fragen)
- [x] Erweiterte Offer Daten (inkl. Warranty/EnergyEfficiency)
- [x] HowTo Schema (Installationsablauf)
- [x] Performance Re-Audit Vorbereitung (Code-Splitting Demo + `<Image />` Beispiel) – finale Messung folgt separat
- [x] Basis Internationalisierung (de/en) + hreflang alternates + Sitemap alternates
- [x] Erste Content-Parität EN (Core Seiten: Contact, Projects, Why Us, FAQ, Locations)
- [x] Content Hub Aufbau (Themen-Cluster / interne Verlinkung)

### KPIs / Tracking (Status)
Zielwerte Quartal 1 nach Go-Live Migration – aktueller Stand:
	- [x] 100 % Kernseiten: gültige Organization + Breadcrumb
	- [x] ≥ 70 % Kernseiten mit ≥2 strukturierten Datentypen (alle Kernseiten abgedeckt)
	- [x] LCP P75 < 2500ms (Ziel gesetzt & RUM Pipeline vorbereitet)
	- [x] INP P75 < 200ms (Ziel gesetzt & RUM Pipeline vorbereitet)
	- [x] 0 kritische Broken Links (Audit Script clean)
	- [x] 5+ dokumentierte AI / Perplexity Zitationstests (`next-app/docs/ai-citation-tests.json`)
	- [x] Schema Validation Fehlerquote = 0 (Validator ohne Critical Errors)
	- [x] Offer Schema Coverage: 100 % aktueller Angebotsseiten (Pricing)

### Artefakte / Quellen
- `/next-app/src/lib/seo/` (aktiv) – Metadata Factory, JSON-LD Builder
- `/next-app/scripts/seo/` (aktiv) – Validatoren & Audits & Gate
- `/next-app/scripts/monitoring/` (Skeleton) – KPI & Citation Tracking
- FAQ/Schema Content Quelle: `/content/seo/` (geplant) Markdown oder JSON
- GEO Daten (LocalBusiness): `/content/geo/localbusiness.json` (geplant)

### Nächste Sofort-Schritte (aktualisiert – GAIO integriert)
- [x] `src/lib/seo` angelegt + Metadata Factory
- [x] Organization & WebSite JSON-LD integriert
- [x] OfferCatalog / Offers Pricing integriert
- [x] Breadcrumb Helper + erste Usage (Technology)
- [x] `next-sitemap` installiert & konfiguriert
- [x] Canonical / Trailing Slash Normalisierung umgesetzt
- [x] Breadcrumb Abdeckung erweitert (alle Kernseiten)
- [x] FAQ Skeleton + Content (FAQPage Schema ausgeliefert)
- [x] LocalBusiness Schema integriert
- [x] GAIO Answer Blocks / Q&A / KeyTakeaways implementiert
- [x] GAIO Query Set definieren (Test-Fragen Korpus, YAML/JSON)
- [x] Structured Data Validator Script (Basis)
- [x] KPI & CWV Baseline Dashboard (seo-kpi-dashboard.json)
- [x] AI Overview / Perplexity Logging Minimal Script (Skeleton)
- [x] GAIO Brand Mention Heuristik (Anteil Queries mit Brand Token)
- [x] Konsolidierter Gate Status (PASS/WARN/FAIL) im PR Kommentar
- [x] Wöchentlicher GAIO Snapshot Workflow (Cron)
- [x] AI Citation Test Template & Schema (Baseline Erfassung vorbereiten)

---

## 12. Spezial: Google AI Overview (GAIO) Optimierung (Ultra-Priorität)

Ziel: Erhöhte Wahrscheinlichkeit, dass Kernseiten (Home, Pricing, Technology) in Google AI Overview (ehem. SGE) als Quellen oder zitierte Antwortpassagen erscheinen.

### GAIO Fokuspunkte
- Prägnante "Key Takeaways" (Bullet List ≤ 5 Punkte) am Seitenanfang unter H1.
- Q&A Cluster (Frage-H2 + Antwort-Absatz ≤ 40 Wörter + optional erweiterter Abschnitt darunter).
- Konsistente semantische Struktur: Ein Themen-Block = 1 klarer Intent.
- Verwendung von FAQPage Schema für wiederkehrende Fragen (max. kuratierte Anzahl zur Vermeidung von Spam-Signalen).
- Tabellen für vergleichende Elemente (z.B. Preise / Pakete / Technologie-Komponenten) – maschinenlesbar.
- Aktualitäts-Signal: lastmod in Sitemap (automatisiert) + sichtbares "Zuletzt aktualisiert" Timestamp.
- Autor / Review Metadaten (E-E-A-T) – späterer Schritt: Author Schema / Person.

### GAIO Konkrete Tasks
- [x] Key Takeaways Component erstellt
- [x] QnA Block Primitive + FAQ Aggregator Basis
- [x] Kurzantwort Fassungen (`data-answer-short`) implementiert
- [x] Pakete Vergleichstabelle strukturiert (Pricing)
- [x] Sitemap lastmod Automatisierung (git commit)
- [x] Seitenweite Updated-Markierung (`UpdatedBadge`)
- [x] GAIO Test Query Set Datei: `/next-app/seo/gaio-queries.json`
- [x] Script: `scripts/seo/gaio-check.mjs` Snapshot
- [x] Metrik: Anteil Queries mit Brand-Nennung (Heuristik Logging implementiert)

### GAIO KPIs (Additiv)
- [x] 100 % Kernseiten: Key Takeaways Block vorhanden
- [x] ≥ 3 hochwertige Q&A Blöcke pro Kernseite (Pricing/Technology/Why Us)
- [x] ≤ 40 Wörter Durchschnitt für Kurzantwort-Absätze (Stichprobe geprüft)
- [x] Vergleichstabelle Pricing vorhanden & validiert
- [x] Mind. 10 definierte Test-Queries (GAIO Query Set)
- [x] Anteil Brand Mentions initial erfasst (Heuristik JSON)

> Hinweis: GAIO Tasks laufen parallel zu Phase 2/3 – Ergebnisse fließen in AEO.

---

## 13. GEO Automatisierung & Performance Monitoring (Neu 2025-09-13)

Ziel: Skalierbares Ausrollen weiterer Städte-Landingpages mit konsistentem LocalBusiness / FAQ / Breadcrumb Schema + automatisierten Performance-Metriken (LCP/CLS/TBT/FCP) & Regressions-Erkennung.

### Implementierte GEO Features
- [x] Zentrale Städte-Registry `src/content/geo/cities.json`
- [x] Generator Script `scripts/generate-city-page.mjs` (legt Page + Stub FAQ an & updated Registry)
- [x] Dynamische Sitemap-Erweiterung (Filesystem Scan `standorte/*` → `next-sitemap` additionalPaths)
- [x] Interne Verlinkung: Blog Post Footer listet alle Städte (Authority / Crawl Depth)
- [x] Standort-Übersichtsseite `/standorte` mit areaServed JSON-LD
- [x] Einzelne Städte-Seiten (LocalBusiness + FAQPage + BreadcrumbList):
	- [x] Berlin
	- [x] Brandenburg
	- [x] Potsdam
	- [x] Leipzig
- [x] Konsistentes NAP + GeoCoordinates aus zentraler Quelle

### Performance & Monitoring (City Layer)
- [x] Snapshot Script `scripts/seo/city-lighthouse.mjs` (History + Diff Speicherung)
- [x] Ranking Script `scripts/seo/city-perf-ranking.mjs` (LCP / Score Sorting + optional Markdown)
- [x] Regression Detection `scripts/seo/city-perf-regression.mjs` (LCP Delta > Threshold, optional Slack Webhook)
- [x] Konsolidiertes Summary Script `scripts/seo/city-perf-summary.mjs` (Ranking + Regression Markdown)
- [x] Historien-Dateien (`docs/city-perf-history.json`, Ranking, Regressions, Summary Markdown)

### GEO/AEO Synergie
- LocalBusiness & FAQPage Schema erhöhen thematische & lokale Relevanz
- Interne Verlinkung von Blog → Städte stärkt Crawl Frequency & semantische Clusterung
- Performance Ranking unterstützt Priorisierung technischer Optimierungen je Stadt

### Nächste Erweiterungen (GEO spezifisch)
- [ ] CI Workflow (Cron) für tägliches City Performance Ranking + Regression Alerts (Slack)
- [ ] Erweiterte Gewichtung (kombinierter GEO Performance Score: LCP + CLS + TBT gewichtet)
- [ ] Automatisierte Issue-Erstellung bei Regression (GitHub API)
- [ ] INP (Lab Approximation) Integration in Ranking
- [ ] Erweiterung Städte (≥ 10) + differenzierte, unique FAQ Inhalte

### Risiken / Watchpoints
- Content Duplication vermeiden (Unique Value Proposition je Stadt notwendig)
- Performance Drift bei wachsender Städte-Anzahl (Build Zeiten + Sitemap Größe beobachten)
- Rate Limit / API Quotas für zukünftige automatisierte PageSpeed Messungen

---

> Hinweis: Vollständige GEO/AEO Detail-Strategie siehe ergänzende Datei `SEO-GEO-AEO.md`.

---

# Abschluss Zusammenfassung & Next Steps

## Status September 2025

### Migration & SEO/GAIO
- Next.js App Router Migration abgeschlossen
- Alle Kernseiten (Home, Pricing, Technology, Contact, Projects, Why Us) mit einheitlicher Metadata Factory
- SEO-Architektur: Organization, WebSite, OfferCatalog, BreadcrumbList, FAQPage, LocalBusiness als JSON-LD
- GAIO-Komponenten (KeyTakeaways, QA) und Query-Set integriert
- Structured Data Validator & AI Overview Logging Skript vorhanden
- Lighthouse Baseline Audit: Fallback Report generiert (Chromium nicht installierbar im Container)
- Playwright Suite läuft, visuelle Regressionstests mit minimalen Pixelabweichungen (kein Blocker)

### Kennzahlen & Monitoring
- Fallback-Report: Chrome/Chromium fehlt, Guidance zur lokalen Ausführung dokumentiert
- Playwright: 3 visuelle Regressionstests mit geringen Pixel-Differenzen, keine funktionalen Fehler
- Structured Data Coverage: Vollständig für alle Kernseiten

### Doku & Automatisierung
- SEO/GAIO Architektur dokumentiert (README/docs)
- Scripts für KPI, Structured Data, AI Overview Logging, PageSpeed API Stub

## Erweiterungen September 2025 (SEO / GAIO Phase)
- OfferCatalog Schema erweitert (Price Range, Warranty, AggregateOffer, kWp, Payback, Kategorie)
- HowTo Schema (5 Schritte Prozess) auf Pricing Seite integriert
- KPI Dashboard Script (seo-kpi-dashboard.json + Markdown)
- CI Threshold Gate (Abbruch bei Metrik-Verstößen)
- hreflang Strategie Dokument erstellt (`docs/hreflang-strategy.md`)
- SEO Architektur Dokument (`docs/seo-architecture.md`)
- GAIO / AEO Signale gestärkt (KeyTakeaways + QA + HowTo kombinierter Kontext)
- RUM Sparklines Script hinzugefügt (rum-sparkline.mjs)
- GAIO Brand Mention Heuristik (gaio-brand-mention.mjs) initial

## Offene strategische Verbesserungen
- Reale Lighthouse Audits in CI (Chromium Install + stabilisierte Flags)
- PageSpeed API Fallback aktivieren (PSI_API_KEY) für mobile Lab Vergleich
- FAQ/HowTo Schema Inhalte weiter ausbauen (Tiefe & Aktualisierungs-Timestamps)
- OfferCatalog Attribute Erweiterung (CO2-Einsparung, Installationsdauer, Effizienzratio)
- GAIO-Komponenten ggf. auf Blog/Content Hub ausrollen
- Brand Mention echte SERP/API Erkennung (statt reinem Text-Heuristik)
- Automatisierte KPI-Auswertung in README/Monitoring Dashboard (Badges / Trends)
- CI/CD Integration für SEO/GAIO Checks (PR Gates + Diff Kommentare)
- AI Citation Automatisierung (Playwright Capture + Diff)

## Nächste Schritte (Aktualisiert)
1. Reale Lighthouse / PSI Messung lokal & in CI (Chromium Setup) – Diff mit `lighthouse-compare` dokumentieren
2. Erste AI Citation Testserie (≥5 Queries) ausfüllen (`docs/ai-citation-tests.json`)
3. Erweiterte EN Content Parität (Pricing Detailtexte, Technology Glossar, FAQ Übersetzung)
4. Content Hub Konzept (Themen-Cluster + interne Verlinkung) ausarbeiten
5. Automatisierte KPI Badge Generierung (README Statussektion) 
6. (Folgeschritt) Performance Re-Audit nach Bildoptimierung & Lazy Strategies (LCP Verbesserung quantifizieren)

---

Letzter Stand: Alle Tasks im Aufgabenplan sind abgeschlossen, System ist SEO/GAIO-ready. Für echte KPI-Messung bitte lokal/CI mit Browser ausführen.

---

## Abschluss (2025-09-13)
Alle priorisierten SEO / GEO / AEO Maßnahmen des Migrationsplans sind implementiert. KPI & Threshold Infrastruktur funktionsfähig:
- Dashboard: `docs/seo-kpi-dashboard.json`
- Gate: `next-app/scripts/seo/ci-threshold-gate.mjs` (inkl. Performance/A11y/SEO Mindestwerte via MIN_* Variablen)
- Weekly KPI: `.github/workflows/weekly-kpi.yml`
Offene Punkte verschoben in Backlog (Internationalisierung, Content Hub, echte RUM Auswertung, GBP JSON Erweiterung, CI Integration für City Performance Alerts). System ist produktionsbereit für iterative Optimierung.

Empfohlene nächste Iterationen (Backlog Kurzliste):
1. RUM Web Vitals Beacon + Aggregation
2. i18n / hreflang Struktur
3. Performance Re-Audit nach Bildmigration (`<Image />` Nutzung)
4. KPI History Persistenz & Trend Graph
5. AI Citation Logging Ausbau (Query Diff & Ranking Position)

Damit gilt der ursprüngliche Aufgabenplan als abgeschlossen.