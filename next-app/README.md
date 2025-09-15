This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Security / Structured Data Architektur (Ergänzung)

Siehe `SECURITY.md` für vollständige Dokumentation (CSP, Nonce, Header Governance).

Wichtige Punkte kurz:
- Alle strukturierten Daten werden ausschließlich über die Server Component `JsonLd` mit Nonce gerendert.
- Keine direkten `<script type="application/ld+json">` Inline-Blöcke mehr in App-Router Pages.
- Neue Integrationen (Analytics / Third-Party) nur via PR + CSP Erweiterung.

Schnellcheck vor Commit:
```
grep -R "application/ld+json" src/app | grep -v JsonLd.tsx || echo "OK"
```
Wenn hier etwas ausgegeben wird (außer der Komponente), bitte auf `JsonLd` umbauen.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## City Performance Status

Automatisch aktualisiertes Badge (Top City – Composite Score oder LCP Fallback):

<!-- CITY_PERF_BADGE -->

> Hinweis: Wird täglich durch den `city-perf-daily` Workflow ersetzt. Datei-Quelle: `docs/city-perf-badge.json` / `docs/city-perf-badge.md`. Platzhalter wird via `scripts/seo/update-city-badge.mjs` ersetzt. Fallback: bleibt unverändert falls kein Badge vorhanden.

## Aktuelle Home Page Value Proposition (Kurz)

Hero Claim: "Photovoltaik. Transparent. Skalierbar. Wirtschaftlich." – Fokus auf belastbare Planung, dokumentierte Qualität & Monitoring / KPI Governance für nachhaltige Ertragssicherung.

Blöcke:
- Warum ZOE Solar? (Planung mit Datenbasis, Dokumentierte Qualität, Wirtschaftlichkeits-Fokus, Monitoring & KPI, Regulatorik & Förderung, Skalierbare Plattform)
- Ablauf (6 Schritte Screening → Übergabe & Monitoring)
- FAQ Kurz (Speakable Bereiche für Voice / AEO)
- CTA Block (Projekt starten / Ansatz Seite)

Strukturierte Daten: `BreadcrumbList`, `WebPage` inkl. `SpeakableSpecification` + FAQ JSON-LD Gruppen in thematischen Abschnitten.

## Rechtliche & Unternehmensdaten

Aktualisierte Konstanten (`src/lib/seo/constants.ts`):
```
legalName: ZOE Solar
Adresse: Kurfürstenstraße 124, 10785 Berlin
Inhaber: Jeremy Markus Schulze
USt-ID: DE325514610
Installateur-Nr: 0080-32174
Betriebsnummer: 134514
```
E-Mail: `service@zoe-solar.de` (Platzhalter für produktive Nutzung verifizieren)

Datenschutzerklärung (`/privacy`) ergänzt mit Server Logs, Anfrageverarbeitung, Rechtsgrundlagen & zukünftige Tracking-Hinweise (Consent erst nötig wenn nicht notwendige Tools aktiv).

## Sitemap & Indexierung

Tooling: `next-sitemap` (postbuild Hook). Config: `next-sitemap.config.js`.

Wichtige Punkte:
- Dynamische Ergänzung aller City Landing Pages (`/standorte/*`) über `additionalPaths` (liest Unterordner).
- Alternate/Hreflang Simulation für `de` & `en` (künftige i18n Vorbereitung) via `transform` → `alternateRefs`.
- `postbuild` script ruft automatisch `next-sitemap` nach `next build`.

Manueller Run:
```
npm run build
# erzeugt sitemap-0.xml, sitemap.xml, robots.txt
```

Deployment Hinweis: Stelle sicher, dass `SITE_URL` (ENV: `SITE_URL` oder Default) korrekt gesetzt ist, damit absolute URLs stimmen.

Option CI (separat falls nötig):
```
next build && next-sitemap
```

IndexNow: API Route + Workflow bereits vorhanden. Ergänzt sich mit zeitnaher Discovery durch Sitemap.

### Automatische Aktualisierung Förderprogramme (Tavily)

Die Förderprogramme pro Bundesland werden zusätzlich zu den manuell gepflegten YAML Dateien optional automatisch über eine Tavily Recherche angereichert.

Komponenten:
- Manuelle Quellen: `content/programmatic/foerderung/*.yml`
- Auto Quellen: `content/programmatic/foerderung-auto/<slug>.auto.yml` (GENERATED – nicht manuell editieren)
- Generator: `scripts/generate/foerderung-gen.mjs` merged Programme (Manual priorisiert, Auto überschreibt bei Namensgleichheit → Aktualisierung)
- Auto Update Script: `scripts/seo/foerderung-auto-update.mjs`
- Workflow: `.github/workflows/foerderung-auto-update.yml` (wöchentlich + manuell triggerbar)

ENV & Secrets:
`TAVILY_API_KEY` (GitHub Secret) – ohne Key läuft das Script im Dry Mode (kein Schreiboutput).

Validierung:
- Manuell: `npm run foerderung:validate` (Basis YAML)
- Auto: `npm run foerderung:auto:validate`
- CI kombiniert: `npm run ci:verify`

Fail-Kriterien Auto Validator:
- fehlendes `slug`, `region`, `updated_auto`
- `updated_auto` nicht ISO (YYYY-MM-DD)
- leere oder fehlende `programmes`
- Programmeintrag ohne `name`

Heuristik:
1. Mehrere Query-Varianten je Bundesland (Zuschuss / Bonus / Speicher / Investitionszuschuss)
2. Tavily Ergebnisse (title + content) → Zeilenanalyse → Kandidaten mit Schlüsselwörtern.
3. Programme dedupliziert (case-insensitive Name) & begrenzt (max ~10).
4. Rate / Cap rudimentär via Regex (`\d+ €`, `bis <Zahl> kWh/kWp`).

Review-Prozess:
- PR wird nur erstellt, wenn tatsächliche Änderungen in auto YAML oder generierten MDX auftreten.
- Manuelle Feinkorrektur weiterhin empfehlenswert (Beschreibung, exakte Förderkonditionen, Quellenlink).

Erweiterungsideen (Future):
- Confidence Score je Programm (Quellenanzahl)
- Automatischer Verfall (Programme älter als X Tage markieren)
- Matching gegen Offizielle Listen (BMUV / KfW API falls verfügbar)


## Gemini API statt OpenAI

Für zukünftige KI-gestützte Schema- oder Content-Generatoren wird statt `OPENAI_API_KEY` nun `GEMINI_API_KEY` verwendet (README Anmerkung – entsprechende Scripts anpassen falls OpenAI Platzhalter existiert):

Empfehlung: In GitHub Actions Secrets `GEMINI_API_KEY` setzen → Vercel Environment Sync:
1. In Vercel Projekt Einstellungen → Git Integration aktivieren
2. Option "Automatically expose Git Repository Variables" aktivieren (oder manuell Environment Variables spiegeln)
3. Änderung an GitHub Secret triggert Re-Deployment (falls Build relevant) – für reine Runtime Serverless Nutzung `vercel env pull` optional lokal.

Im Code zukünftig Zugriff via `process.env.GEMINI_API_KEY`.

## Erweiterung City Landing Pages (Standorte)

Aktuell implementiert: Berlin, Brandenburg, Potsdam, Leipzig. Geplant (nächste Iteration):
Hamburg, München, Köln, Frankfurt, Stuttgart, Düsseldorf, Hannover, Nürnberg, Bremen, Dresden, Essen, Dortmund, Mannheim, Bonn, Münster (+ perspektivisch: Karlsruhe, Wiesbaden, Augsburg, Freiburg, Kassel, Mainz, Saarbrücken, Rostock, Erfurt, Magdeburg, Kiel, Lübeck, Bielefeld, Jena, Oldenburg, Heidelberg, Regensburg, Würzburg, Ulm, Darmstadt, Ingolstadt, Braunschweig).

Strategie:
- Reusable Template (siehe vorhandene City Pages) → Kopie + Unique Copy (≥30% Differenz) pro Stadt.
- FAQ & USP auf lokale Gegebenheiten (Dachformen, Verschattung, Netzbetreiber Geschwindigkeit, Speicherquote) anpassen.
- Automatische Sitemap Aufnahme ohne weitere Config.
- Performance Lighthouse & Ranking Pipeline skaliert automatisch, sobald City in History auftaucht.

Automatisierung (Generator Script):
```
npm run city:new -- <slug> "City" "Optional Voller Titel"
# Beispiel
npm run city:new -- karlsruhe "Karlsruhe" "Photovoltaik Installation Karlsruhe – Planung & Montage"
```
Aktionen des Scripts:
1. Legt `src/app/standorte/<slug>/page.tsx` an (Abbruch falls vorhanden)
2. Ergänzt `src/content/geo/cities.json` alphabetisch
3. Füllt Template mit Standard USP + FAQ (muss lokalisiert / differenziert werden)
4. Hinweis im Console Output zur ≥30% Unique Copy Anforderung

Nachbearbeitung pro neuer Stadt (empfohlen):
- USP anpassen (z.B. Netzbetreiber Dauer, regionale Dachlast / Schneelast, typische Verschattungen)
- FAQ lokalisieren (Genehmigung, Förderprogramme, Speicherquote Region, Einspeisung)
- Interne Verlinkungen (ggf. Nachbarstädte / regionale Cluster) hinzufügen
- Strukturierte Daten: Falls abweichende Öffnungszeiten oder Koordinaten → lokal überschreiben

Duplicate Content Check (künftige Option): eigenes Script könnte Cosine Similarity für Body Text berechnen (`>0.85` Flag = zu ähnlich). Noch nicht implementiert.

## Lead Qualifikation & Anfrage Pipeline

Ziel: Qualifizierte Erstbewertung von Projektanfragen mit minimalem Overhead & skalierbarer Datenbasis.

### Komponenten

| Teil | Pfad | Zweck |
|------|------|-------|
| API Route | `src/app/api/lead/route.ts` | Annahme & Validierung von Lead Payloads, Rate-Limit, Persistenz |
| Formular | `src/components/forms/LeadQualiForm.tsx` | Client UI, Validation, Fetch Submit, Honeypot |
| Seite | `/anfrage` (`src/app/anfrage/page.tsx`) | Landing für Anfrage + JSON-LD `Service` + `SubmitAction` |
| Persistenz | `data/leads.jsonl` | Append-Only JSONL (eine Zeile = Lead) |
| Optional Webhook | ENV `LEAD_WEBHOOK_URL` | Slack o. ä. Benachrichtigung |

### Felddefinition

| Feld | Pflicht | Typ | Validierung |
|------|---------|-----|-------------|
| name | ja | string | trim, max 120 |
| email | ja | string | RFC5322 Basis Regex |
| phone | nein | string | max 40 |
| postcode | ja | string | `^\d{5}$` |
| roofType | nein | enum | `ziegel|flachdach|pultdach|walmdach|andere` |
| annualConsumptionKWh | nein | number | 300–60000 ganzzahlig |
| storageInterest | nein | boolean | Normalisiert (true/false, 1, yes, ja) |
| wallboxInterest | nein | boolean | dito |
| message | nein | string | max 1000 |
| consent | ja | boolean | muss true sein |
| honeypot | (hidden) | string | muss leer bleiben (Bot Trap) |

### Sicherheit & Qualität

- Rate Limit: IP + Minute (8 req/min) – einfache In-Memory Bucket Map (ersetzbar durch Redis).
- Honeypot: Verstecktes Feld `Website` – bei Befüllung → stilles `success` (Spam Drop ohne Signalisierung).
- Input Hardening: Trim + Längenbegrenzungen + Typ-Koerzierung.
- Silent Webhook Failure: Fehler bei Slack/Webhook blockiert nicht die Lead-Erfassung.
- JSON Only: `Content-Type: application/json` enforced, sonst 415.

### Persistenzstrategie

`data/leads.jsonl` (gitignored empfohlen) speichert jede Anfrage als eine JSON-Zeile. Vorteile: Append-Only, grep-/jq-freundlich, einfache Migration in DB später (Batch Import). Felder: `ts, name, email, phone?, postcode, roofType?, annualConsumptionKWh?, storageInterest, wallboxInterest, message, userAgent?, ip?`.

Rotation (optional zukünftige Erweiterung): Cron / Workflow (monatlich) → `leads-YYYY-MM.jsonl` archivieren.

### Datenschutz Hinweis (Empfehlung Text)

"Wir verarbeiten die angegebenen Daten ausschließlich zur Bewertung & Kontaktaufnahme zu Ihrem Photovoltaik Projekt. Eine Weitergabe an Dritte erfolgt nicht. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (E-Mail an service@zoe-solar.de)."

### JSON-LD

`Service` + `SubmitAction` (target Endpoint `/api/lead`) verbessert semantische Einordnung (kann Suchmaschinen helfen, Intent zu verstehen). Erweiterung möglich um `provider` (Organization) / `areaServed` Liste.

### Testablauf lokal

```
curl -X POST http://localhost:3000/api/lead \
	-H 'content-type: application/json' \
	-d '{"name":"Test User","email":"test@example.com","postcode":"10115","annualConsumptionKWh":3500,"consent":true}'
```
Erwartet: `{ "success": true }` + neue Zeile in `data/leads.jsonl`.

Fehlerbeispiel (422): fehlende Pflichtfelder oder ungültige PLZ.

### Mögliche nächste Iterationen

- DSGVO: Automatisierte Löschroutine (z.B. 18 Monate) + Export Script.
- Scoring: Einfache Heuristik (Verbrauch hoch + Speicher/Wallbox Interesse => Priorität).
- Duplicate Detection: Hash (email+postcode+Tag) → Abweisung / Flagging.
- Geo Enhancement: Reverse Lookup Netzbetreiber / spezifische Feed-In Wartezeiten.
- CRM Export: Periodischer JSON → CSV Transformer `scripts/lead-export.mjs`.

## City Deep Content (Regionale Kennzahlen)

Ziel: Höhere inhaltliche Differenzierung & fachliche Autorität durch regionale Kennzahlen & Kontextblöcke.

<!-- CITY_DEEP_COVERAGE_BADGE -->

![Deep Content Coverage 100%](https://img.shields.io/badge/deep--content-100%25-green)

![Deep Content Coverage 75.61%](https://img.shields.io/badge/deep--content-75.61%25-yellow)

### Datenquelle
`src/content/geo/city-data.json` – Array von Objekten:
```
{
	slug: string,
	insolationKwhM2: number,              // Jahres Globalstrahlung (vereinfachter Mittelwert)
	specificYieldRange: string,           // Typischer spezifischer Ertrag kWh/kWp Range
	storageAdoptionHint: string,          // Nutzen-/Dimensionierungshinweis Speicher
	gridProcessNote: string,              // Netzanschluss / Bearbeitungsdauer Hinweis
	shadingRisk: 'low'|'medium'|'high',   // Heuristik Verschattung
	roofMixNote: string                   // Dominante Dachform-/Struktur Hinweise
}
```

### Generator Integration
`scripts/generate-city-page.mjs` prüft beim Anlegen einer Stadt, ob ein Eintrag in `city-data.json` existiert. Falls ja, wird ein Abschnitt "Regionale Kennzahlen & Kontext" mit zwei Spalten (Kennzahlen links, Prozess/Risiko rechts) eingefügt.

### Retro Injection
`scripts/augment-city-deep-content.mjs` ergänzt bestehende Seiten, sofern Block nicht vorhanden aber Daten existieren.

### Pflegeprozess
- Ergänzung neuer Städte durch manuelles Edit der JSON.
- (Zukünftig) Automatisierte Aktualisierung via externer Datengrundlage (DWD, PVGIS) – nightly Job der Werte cached & normalisiert.

### SEO / Uniqueness Effekt
Der Kennzahlenblock erhöht die Term-Diversität (Globalstrahlung, spezifischer Ertrag, Netzanschlussdauer …) → geringere Similarity bei großem Seitensatz, bessere semantische Abdeckung (E-E-A-T Signale, Expertise / Experience durch regionale Spezifika).

### Erweiterungsideen
- Zusätzliche Felder: `feedInTariffNote`, `localIncentiveHint` sobald belastbare Daten verfügbar.
- Confidence Score pro Kennzahl (Quelle, Alter, Genauigkeit) → Transparenz.
- Weighted Similarity im Audit Script: Kennzahlen-Terme höher gewichten zur Differenzierungsprüfung.

### Geplanter Audit Upgrade
Similarity Script Erweiterung um `weightedTerms.json` (Mapping Term → Gewicht). Pipeline:
1. Tokenisierung wie bisher
2. Falls Term in Gewichtungsliste → TF * Gewicht
3. Cosine & Overlap neu berechnen → empfindlicher auf fehlende Kennzahlenvariation

### Qualitäts-Gates Idee (Future)
- Mindestanzahl befüllter Kennzahlenfelder pro Stadt (Fail → Issue/Warning)
- Abdeckungs-Report: Anteil Städte mit Deep Content Abschnitt (Ziel 100%)

### Wartung / Konsistenz
Bei Änderungen an Feldnamen zwingend Generator + Augment Script prüfen.
Backward-Kompatibilität: Neue Felder optional lassen (fehlende Werte nicht rendern) → vermeidet Hard Fail.

### Quick Check
```
grep -R "Regionale Kennzahlen & Kontext" src/app/standorte | wc -l
```
Erwartung: Anzahl = Anzahl Einträge mit Datensatz.

### Weighted Similarity Nutzung
Aktueller Status: Implementiert. Datei: `src/content/geo/similarity-weighted-terms.json`
Run Beispiel:
```
node scripts/seo/city-content-audit.mjs --threshold 0.78 --weights src/content/geo/similarity-weighted-terms.json
```
Output JSON enthält Felder `weightsFile`, `weightedTerms`. Terms, die im File fehlen → Faktor 1.
Anpassung der Faktoren vorsichtig inkrementell (Δ 0.1–0.3), sonst Oversensitivity.



## Offene optionale Verbesserungen (nicht notwendig für Launch)

- Sitemap bereits aktiv – Feintuning: separate Index Sitemaps (blogs, cities) + hreflang pro Sprache dynamisch
- Consent Banner & differenziertes RUM Sampling (wenn später zusätzliche Tracking Tools / Analytics)
- Query Historisierung für AI Citation (Sparkline Zeitverlauf + Differenz Gewichtung)
- Automatischer Inject von Video/Audio Schema bei Komponenten-Render (HOC oder Server Component Hook)
- Vollständige englische Lokalisierung oder Deaktivierung bis Inhalte verfügbar
- Erweiterter City Page Generator (Parameter für kWp Range, Prognose, Netzbetreiber Liste)

## ENV Sync Vercel ↔ GitHub

Empfohlener Ablauf:
1. Secrets als GitHub Actions Secret anlegen (`GEMINI_API_KEY`, ggf. `SLACK_WEBHOOK_URL`, Thresholds)
2. In Vercel: Settings → Git → Environment Variables → "Import from GitHub" oder manuell pflegen
3. Bei Änderung in GitHub: Überprüfen, ob Vercel Auto-Re-Deploy triggered (Preview/Production)
4. Lokale Entwicklung: `.env.local` (nicht commiten) – `vercel env pull` möglich

Sicherheitsnotiz: Keine Secrets im Client-Bundle – Prefixed `NEXT_PUBLIC_` nur für nicht-sensible Werte.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Monitoring & KPI Governance

Die Anwendung beinhaltet ein SEO / Performance Governance System:

- KPI Dashboard Script (`scripts/seo/kpi-dashboard.mjs`) erzeugt `docs/seo-kpi-dashboard.json` + Markdown.
- Historie & Diff (`kpi-history.json`, `scripts/seo/kpi-history-diff.mjs`).
- Sparklines (`scripts/seo/kpi-sparkline.mjs`) für Trendvisualisierung.
- RUM Aggregation (`scripts/seo/rum-aggregate.mjs`) mit p75 Metriken (LCP, INP, CLS, TTFB) & optionaler History.
- Threshold Gate (`scripts/seo/ci-threshold-gate.mjs`) für Lab & optionale RUM p75 Gates.

### Gate Environment Variablen (Auszug)
THRESH_LCP_MS, THRESH_CLS, THRESH_INP_MS, THRESH_TBT_MS, MIN_PERF_SCORE, MIN_A11Y_SCORE, MIN_SEO_SCORE, RUM_LCP_P75_MS, RUM_INP_P75_MS, RUM_CLS_P75, RUM_TTFB_P75_MS

### PR KPI Kommentar Automation

Workflow: `.github/workflows/pr-kpi-comment.yml` kommentiert jede Pull Request (opened / synchronize / reopened) mit:
- Lab KPI Überblick (Performance / LCP / CLS / INP)
- RUM p75 Kennzahlen (falls vorhanden)
- KPI Diff (letzte vs. vorletzte History)
- Sparklines (Performance %, LCP, CLS, INP)

Script: `scripts/seo/post-kpi-comment.mjs`

Artefakte:
- `docs/pr-kpi-comment.md`
- `docs/seo-kpi-dashboard.json`
- `docs/kpi-history.json`
- `docs/rum-summary.json` (falls RUM Daten)

Permissions: `pull-requests: write` gesetzt; `GITHUB_TOKEN` automatisch vorhanden.

Lokaler Test (ohne Kommentar Post):
```
node scripts/seo/kpi-dashboard.mjs
node scripts/seo/kpi-history-diff.mjs
node scripts/seo/kpi-sparkline.mjs
node scripts/seo/post-kpi-comment.mjs
cat docs/pr-kpi-comment.md
```

Für manuelles Posten (z.B. Test): Umgebungsvariablen `GITHUB_TOKEN`, `GITHUB_REPOSITORY=owner/repo`, `PR_NUMBER=123` setzen.

Zukünftige Verbesserung: Idempotentes Update (aktuell wird ein neuer Kommentar hinzugefügt).
### Idempotenz & Status Emojis

Der PR Kommentar wird nun idempotent aktualisiert (Marker `<!-- KPI-COMMENT-IDEMPOTENT -->`).

Statusdarstellung:
- ✅ Metrik erfüllt (<= Schwelle bzw. >= Score Mindestwert)
- ❌ Metrik verfehlt
- – Keine Schwelle gesetzt oder kein Wert

RUM & Lab Schwellen werden aus den jeweiligen Environment Variablen gelesen (siehe oben). Fehlt eine Variable, wird kein Pass/Fail Emoji gezeigt.

### GAIO Query Monitoring

Datei: `seo/gaio-queries.json` – definiert priorisierte Frage- / Intent-Sets (Felder: id, query, intent, page, importance).

Snapshot Script: `scripts/seo/gaio-check.mjs`
Erzeugt:
- `docs/gaio-query-report.json`
- `docs/gaio-query-summary.md`

Aktuell Platzhalter (brandMention / presentInAIOverview = null). Spätere Erweiterung: API oder SERP Parsing.

Brand Mentions Heuristik:
```
node scripts/seo/gaio-brand-mention.mjs
```
Output: `docs/gaio-brand-mentions.json` – einfache Heuristik (Query Text enthält Markenstring).

Ausführen lokal:
```
node scripts/seo/gaio-check.mjs
```

### Vergleichstabelle (Pricing)

Komponente: `src/components/pricing/ComparisonTable.tsx`
- Fokus auf maschinenlesbare Pakete (Preisrange, kWp, Amortisation, Garantie, Effizienzklasse, Kategorie, Kurzbeschreibung)
- Semantische Tabelle + `<caption>` + `scope` Attribute zur besseren AEO/Parsing Qualität

### hreflang / Internationalisierung (Stub)
### RUM Sparklines

Script: `scripts/seo/rum-sparkline.mjs` (benötigt `docs/rum-history.json`)
```
node scripts/seo/rum-sparkline.mjs
```
Erzeugt Markdown (stdout) mit p75 Trends (LCP / INP / CLS / TTFB).

### PR Kommentar Erweiterungen

- Zeigt jetzt zusätzlich (falls vorhanden) RUM Sparklines.
- Gate Status weiterhin mit ✅ / ❌ Emojis.

Im `RootLayout` werden vorbereitend `link rel="alternate"` für `de`, `en`, `x-default` ausgegeben.
Steuerung Domain Basis via `NEXT_PUBLIC_SITE_URL`.
Spätere Erweiterung: dynamisch generierte Sprachpfade + sprachspezifische Sitemaps.

### Outlier & URL Aggregation

| Datei | Zweck |
|-------|------|
| `docs/rum-outliers.json` | Top langsamste Einzelereignisse (LCP/INP) |
| `docs/rum-url-aggregate.json` | p75 Aggregation pro URL (LCP/INP/CLS/TTFB + Count) |
| `docs/rum-url-aggregate.md` | Markdown Topliste |

Scripts:
| Script | Beschreibung |
|--------|--------------|
| `scripts/seo/rum-outliers.mjs` | Extrahiert Outlier Events (Top N) |
| `scripts/seo/rum-url-aggregate.mjs` | Aggregiert p75 pro URL |
| `scripts/seo/slack-outliers.mjs` | Slack Alert bei Grenzwertüberschreitung |

Slack Outlier Beispiel:
```
SLACK_WEBHOOK_URL=... OUTLIER_LCP_MS=4500 OUTLIER_INP_MS=600 \
	node scripts/seo/slack-outliers.mjs
```

### Exposure Importance Weights
Individuelle Wichtigkeit pro Query überschreiben:
```
IMPORTANCE_WEIGHTS='{"solar speicher":"2.5","pv förderung":"3"}' \
	node scripts/seo/gaio-exposure-index.mjs
```
Erweiterter Output: `appliedWeights[]`, Flag `weightOverridesUsed`.

### HTML Dashboard Upgrades
Script: `scripts/seo/build-seo-dashboard.mjs` → `docs/seo-dashboard.html`
Enthalten: Gate, KPI (Lab), RUM Summary, Histogram, Outliers, Exposure (normalisiert + raw), Brand, Weekly History, URL Aggregation (Top 15)
Features: Sortierbare Tabellen, Farb-Codierung (gut / grenzwertig / schlecht) dynamisch anhand Threshold Artefakt, Legende, Sparklines, Δ LCP & Debt Spalten.

#### Performance Debt
Berechnung (pro URL): `(p75_lcp - TARGET_LCP) * sqrt(events) * weight`
- `TARGET_LCP` = `RUM_LCP_P75_MS` (oder 2500 Default)
- `weight` optional via `RUM_URL_WEIGHT_MAP` (JSON Mapping: URL → Faktor)
Nutzen: Priorisierung der URLs mit höchstem aggregierten Optimierungsschaden (Hebel). Je höher der Debt Wert, desto dringlicher.

Debt Darstellung:
- HTML Dashboard: Spalte `Debt` + Δ LCP (Vorwoche vs. Jetzt)
- PR Kommentar: Summenzeile + Top 3 Debt URLs + Detailblock Top 10

#### Low Sample Confidence
URLs mit Event Count < `MIN_RUM_SAMPLE` (Default 50) werden mit `(low n)` markiert – Visualisierung: Stern in Events-Spalte im Dashboard. Diese Werte sind statistisch weniger belastbar und sollten vor Optimierungsentscheidungen verifiziert werden.

#### Alert Suppression
Slack Alerts (Outliers / Anomalies) nutzen einen Cache `docs/alert-cache.json` um identische Meldungen für `SUPPRESS_MINUTES` zu unterdrücken (ENV konfigurierbar). Reduziert Noise & Alert Fatigue.

#### Anomaly Severity Labels
Wiederholte Anomalien (2 Wochen Sequenz) werden beim Issue-Erstellen mit Severity (`LOW`/`MED`/`HIGH`) gelabelt (berechnet aus kumulativer % Verschlechterung). Ergebnis: Issues mit Labels `anomaly`, `severity-high|med|low`.

### Relevante ENV Variablen (Auszug)
| Kategorie | Variable | Zweck | Default |
|-----------|----------|-------|---------|
| Lab Gate | THRESH_LCP_MS | LCP Grenze | 3000 |
| Lab Gate | THRESH_INP_MS | INP Grenze | 200 |
| Lab Gate | THRESH_CLS | CLS Grenze | 0.1 |
| Lab Gate | THRESH_TBT_MS | TBT Grenze | 250 |
| Scores | MIN_PERF_SCORE | Min Performance Score | 0.8 |
| Scores | MIN_A11Y_SCORE | Min A11y Score | 0.9 |

## Programmatische & Qualitäts-Scripts

| Script | Zweck | Pfad |
|--------|-------|------|
| `npm run gen:foerderung` | Wandelt YAML Förderdaten in MDX Seiten unter `/foerderung/[slug]` | `scripts/generate/foerderung-gen.mjs` |
| `npm run faq:dupes` | Findet doppelte FAQ Einträge (Frage+Antwort Hash) für Content Qualität | `scripts/content/faq-duplicate-audit.mjs` |
| `npm run rum:rollup` | Aggregiert Web Vitals RUM NDJSON zu p50/p75/p90/p95 | `scripts/rum/rollup.mjs` |
| `npm run perf:lh` | Führt Lighthouse Performance Batch Audit aus | `scripts/lighthouse-run.mjs` |
| `npm run ci:jsonld-guard` | Prüft verbotene Inline JSON-LD Muster außerhalb `JsonLd` Komponente | `scripts/ci/check-inline-jsonld.mjs` |
| `npm run ci:legacy-audit` | Ermittelt veraltete Patterns (Legacy Schema / Strukturen) | `scripts/ci/legacy-audit.mjs` |
| `npm run foerderung:validate` | Validiert Programm-Förderungs YAML (Pflichtfelder, Slug=Dateiname, Datum ISO) | `scripts/ci/foerderung-validate.mjs` |

### Förderungs Index Strukturierte Daten
Die Seite `/foerderung` rendert zusätzlich ein `ItemList` JSON-LD aller generierten Programme (Sortierung: neueste `updated` zuerst). Dies erleichtert semantische Erfassung einer Sammlung verwandter Ressourcen.

Validierungs-Gate:
- Slug MUSS dem Dateinamen entsprechen (z.B. `bayern-2025.yml` → `slug: bayern-2025`).
- `updated` im Format `YYYY-MM-DD` (rein, ohne Zeitanteil). Bei Fehler → CI Bruch über `foerderung:validate`.

### Förderungs-YAML Felder

Minimal:
- `title`, `slug`, `region`, `updated`, `programmes[]`

Optional:
- `foerdergeber`, `kurzbeschreibung`, `voraussetzungen[]`, `kombinierbarkeit[]`, `vorteile[]`, `schritte[]`, `faq[]`

Beispiel siehe `content/programmatic/foerderung/bayern-2025.yml`.

Nach Anpassung: `npm run gen:foerderung` ausführen → Statische Params automatisch über `generateStaticParams` in `src/app/foerderung/[slug]/page.tsx`.

FAQ werden heuristisch (Markdown Pattern **Frage**) extrahiert und als `FAQPage` JSON-LD eingebunden.
| Scores | MIN_SEO_SCORE | Min SEO Score | 0.9 |
| RUM p75 | RUM_LCP_P75_MS | Ziel LCP | 2500 |
| RUM p75 | RUM_INP_P75_MS | Ziel INP | 200 |
| RUM p75 | RUM_CLS_P75 | Ziel CLS | 0.1 |
| RUM p75 | RUM_TTFB_P75_MS | Ziel TTFB | 600 |
| Debt | RUM_URL_WEIGHT_MAP | JSON URL → Gewicht | {} |
| Confidence | MIN_RUM_SAMPLE | Mindest-Events für kein `(low n)` | 50 |
| Alerts | SUPPRESS_MINUTES | Unterdrückungsintervall identischer Alerts | 0 (aus) |
| Outliers | OUTLIER_LCP_MS | LCP Outlier Schwelle | 4000 |
| Outliers | OUTLIER_INP_MS | INP Outlier Schwelle | 500 |
| Anomalie | ANOMALY_PCT | % Schwellwert pro Woche | 10 |

### Nutzen & Wirkung (Kurzüberblick)
- Dynamische Threshold-Farben: Verhindert Drift bei hart kodierten Grenzwerten.
- Debt Score: Maximiert ROI von Optimierungen (konzentriert Aufwand auf größte Nutzer-Beeinträchtigungen).
- Low Sample Kennzeichnung: Reduziert Fehlentscheidungen durch statistisches Rauschen.
- Alert Suppression: Weniger Slack Lärm, höhere Signalqualität.
- Severity Labels: Besseres Stakeholder Tracking & Priorisierung im Issue Backlog.

Heuristik für Farben:
- Zeit(ms): <2000 grün, <3500 gelb, sonst rot
- Prozent: ≥90 grün, ≥80 gelb, sonst rot
- Ratio (0..1): analog Percent Mapping

### PR Kommentar Badges & Langsamste URL
Badges in Zeile 2: Anomalien / Outliers Status. Zusätzlich: Zeile mit langsamster URL (höchster p75 LCP) inkl. Event Count zur schnellen Fokussierung.
Erweitert: Performance Debt Summenzeile + Top 3 Debt URLs + detaillierter Debt Block.

### Echte RUM Pipeline (Client → Aggregation → Dashboard)

1. Client Beacon: `src/lib/rum/web-vitals-client.ts` nutzt `web-vitals` und sendet LCP/INP/CLS/TTFB via `sendBeacon` an `/api/rum`.
2. API Endpoint: `src/app/api/rum/route.ts` schreibt JSONL (`docs/rum-metrics.jsonl`).
3. Aggregation: `scripts/seo/rum-url-aggregate.mjs` erzeugt:
	- `docs/rum-url-aggregate.json` (Array, p75_* + count + delta + debt + lowSample Flag)
	- `docs/rum-url-history.json` (Rolling History für Trends)
	- `docs/rum-url-aggregate.md` (Top Tabelle)
4. Outliers: `scripts/seo/rum-outliers.mjs` extrahiert Extremwerte.
5. Dashboard: `scripts/seo/build-seo-dashboard.mjs` bindet Aggregation ein (Δ LCP, Debt, Low Sample Markierung).
6. PR Kommentar: `post-kpi-comment.mjs` summiert Debt + Top 3.
7. Alerts: `slack-outliers.mjs` / `slack-anomalies.mjs` mit Suppression Cache (`alert-cache.json`).

ENV Einflüsse:
- `RUM_LCP_P75_MS` Ziel für Debt Berechnung.
- `MIN_RUM_SAMPLE` Untergrenze für vertrauenswürdige URL Werte.
- `RUM_URL_WEIGHT_MAP` JSON Mapping zur Gewichtung (z.B. `{ "/pricing":1.5 }`).
- `SUPPRESS_MINUTES` Unterdrückt identische Slack Payloads.

Nutzen:
- Schnelle Identifikation regressiver URLs (Δ LCP > 0) mit hoher Nutzer-Reichweite (sqrt(events)).
- Strategisches Priorisieren (Debt) statt nur rohe Zeitwerte.
- Reduktion Alert Noise → höhere Signalqualität.

## Data Fetching / ISR Beispiel

Beispielroute: `/demos/data-fetching`

Merkmale:
- `export const revalidate = 3600;` (ISR – maximal stündliche Regeneration)
- Server Component `page.tsx` holt externe API (`jsonplaceholder`) mit identischem Revalidate-Fenster
- Geeignet für semi-statische Daten (Preis-Snapshots, Feature-Listen, Aggregationen)

On-Demand Revalidation (optional): API Route erstellen, `res.revalidate('/demos/data-fetching')` nach CMS Update aufrufen.

Fehlerstrategien (Empfehlung):
1. Circuit Breaker bei >N Fehlversuchen (Fallback Cache serve)
2. strukturiertes Logging (Status, Dauer, Endpoint)
3. Retries mit Exponential Backoff bei transienten 5xx

Monitoring: Response Zeiten und Cache-Hitrate können in KPI Dashboard integriert werden (Erweiterung offen).

## Performance Re-Audit & Vergleich

Nach wesentlichen Optimierungen (Bildkompression, Code-Splitting, Caching) sollte ein Re-Audit durchgeführt werden:

1. Dev/Preview Server starten (oder produktive URL definieren)
2. Baseline erfassen:
```
node scripts/seo/lighthouse-baseline.mjs --base http://localhost:3000 --paths / /pricing /technology /contact /projects /why-us
```
3. Änderungen implementieren (z.B. `<Image />`, Preloading, Critical CSS)
4. Neue Messung erstellen (überschreibt `lighthouse-baseline-current.json`)
5. Diff erzeugen:
```
node scripts/seo/lighthouse-compare.mjs --old docs/lighthouse-baseline-<ALT>.json --new docs/lighthouse-baseline-current.json
```
6. Ergebnis: `docs/lighthouse-diff.json` + `docs/lighthouse-diff.md`

Hinweise:
- Für konsistente Ergebnisse: CPU-Throttling & Netzwerkbedingungen stabil halten (idealerweise über Lighthouse CI oder GitHub Action Runner mit festgelegten Flags)
- LCP Ziel < 2500ms (Lab) und später p75 Real (RUM) validieren
- CLS < 0.1, TBT < 250ms, INP (RUM) < 200ms

Optional: Remote PSI Ergänzung
```
PSI_API_KEY=... node scripts/seo/pagespeed-fallback.mjs --base https://www.zoe-solar.de --paths / /pricing /technology
```

## CI Performance Gate

Workflow: `.github/workflows/perf-audit.yml`

Pipeline Schritte:
1. Produktionsbuild (`next build`) & Start (`next start`)
2. `lighthouse-baseline.mjs` über Kernpfade (`/ /pricing /technology /contact /projects /why-us`)
3. Optionaler Vergleich: `lighthouse-compare.mjs` (falls vorherige Baseline vorhanden)
4. KPI Dashboard Aggregation + RUM Aggregation (falls `rum-metrics.jsonl` existiert)
5. Threshold Gate (`ci-threshold-gate.mjs`) mit Lab + optional RUM Schwellen
6. Artefakte Upload (Baseline, Diff, threshold-result, rum-summary, KPI Dashboard)

Environment Schwellen (Defaults im Workflow gesetzt):
- THRESH_LCP_MS=3000
- THRESH_CLS=0.10
- THRESH_INP_MS=200
- THRESH_TBT_MS=250
- MIN_PERF_SCORE=0.85 / MIN_A11Y_SCORE=0.90 / MIN_SEO_SCORE=0.90

Badge (Platzhalter, kann via Shields & GitHub Actions Status nachgerüstet werden):
`![Perf Gate](https://img.shields.io/badge/perf--gate-pending-lightgrey)`

Geplante Erweiterungen:
- Automatische Badge Aktualisierung nach erfolgreichem Gate Run
- Matrix für mobile/desktop Runs mit unterschiedlichen Thresholds
- Integration von PSI Remote Scores (Fallback bei fehlendem lokalem Chromium)

## GEO City Pages

Strategie & Muster für regionale Landingpages siehe `docs/geo-city-strategy.md`.

Neues City Template anlegen:
```
node scripts/generate-city-page.mjs <slug> "CityName" "Optional Title"
```
Beispiel:
```
node scripts/generate-city-page.mjs potsdam "Potsdam" "Photovoltaik Installation Potsdam – Planung & Montage"
```
Danach: Inhalt/FAQ individuell anpassen (≥30% unique Copy) & Sitemap Build ausführen.

### Dynamische City Discovery
`next-sitemap` liest automatisch alle Unterordner unter `src/app/standorte/*` und ergänzt sie in der Sitemap (`additionalPaths`). Kein manuelles Pflegens mehr nötig.

Registry Datei: `src/content/geo/cities.json` – wird vom Generator gepflegt und für interne Verlinkung (Blog Footer) & Performance Messung genutzt.

### Performance Messung City Pages
Script: `scripts/seo/city-lighthouse.mjs`
Beispiel:
```
node scripts/seo/city-lighthouse.mjs --base https://preview.example.com --out docs/city-perf.json --history docs/city-perf-history.json
```
Output: Array mit Performance Score, LCP, CLS, TBT, FCP je City. Nutze diese Daten zur Vergleichbarkeit bei neuen regionalen Seiten.

Empfehlung: In CI 1× täglich oder nach Deployment laufen lassen & Trend speichern.

Diff Datei: `docs/city-perf-diff.json` (automatisch) mit `deltaLcp` und `deltaScore` (letzter Run vs. vorheriger). History enthält maximal 30 Einträge.

### Regression Detection & Ranking
Scripts:
```
node scripts/seo/city-perf-ranking.mjs --history docs/city-perf-history.json --out docs/city-perf-ranking.json --markdown
node scripts/seo/city-perf-regression.mjs --history docs/city-perf-history.json --threshold 300 --out docs/city-perf-regressions.json --slack $SLACK_WEBHOOK_URL
node scripts/seo/city-perf-summary.mjs --ranking docs/city-perf-ranking.json --regress docs/city-perf-regressions.json --out docs/city-perf-summary.md
```
Ergebnisse:
- Ranking JSON + Markdown (`city-perf-ranking.*`)
- Regressions (`city-perf-regressions.json`) bei LCP Anstieg über Schwellwert
- Zusammenfassung (`city-perf-summary.md`) kombiniert beides

Slack Alert: Setze `SLACK_WEBHOOK_URL` oder `--slack` Flag. Meldet jede Stadt mit Δ LCP > Threshold.

### Daily City Performance Workflow
Ein geplanter GitHub Action Workflow (`.github/workflows/city-perf-daily.yml`) führt täglich (Cron `15 4 * * *` ≈ 06:15 CET / 07:15 CEST) die City Performance Pipeline aus:
1. Snapshot (`city-lighthouse.mjs`) mit History Append (`docs/city-perf-history.json`)
2. Ranking (`city-perf-ranking.mjs`) inkl. optionalem Markdown
3. Regression Detection (`city-perf-regression.mjs`) mit optionalem Slack Webhook Secret `SLACK_CITY_PERF_WEBHOOK`
4. Summary Aggregation (`city-perf-summary.mjs`) → `docs/city-perf-summary.md`
5. Commit & Push der Artefakte (`docs/city-perf*.json`, Summary Markdown)

Konfiguration anpassen:
- Basis-URL Flag `--base` im Workflow (aktuell Platzhalter `https://example.com`)
- Threshold (`--threshold 300`) für LCP Regressionen je nach Toleranz anpassen

Optionale Secrets:
- `SLACK_CITY_PERF_WEBHOOK` → empfängt Regression Alerts (nur bei tatsächlichem Δ > Threshold)

Geplante Erweiterungen:
- Automatische Badge Generierung für Top-Performer Stadt
- Composite Score (gewichtetes LCP/CLS/TBT/INP Lab Approx)
- Issue Auto-Creation bei Regression (GitHub API)
- Historische Trend Visualisierung (Sparkline Markdown)

### Composite Score (Neu)
Aktivierbar im Ranking Script via Flag `--composite` mit optionalen Gewichten:
```
node scripts/seo/city-perf-ranking.mjs --history docs/city-perf-history.json --out docs/city-perf-ranking.json --markdown --composite --wLcp 0.5 --wCls 0.2 --wTbt 0.3
```
Formel:
```
Composite = (normInvLCP * wLcp) + (normInvCLS * wCls) + (normInvTBT * wTbt)
```
Normalisierung (invertiert, höher = besser):
- LCP: 0..4000ms → 1 - (LCP/4000)
- CLS: 0..0.3 → 1 - (CLS/0.3)
- TBT: 0..600ms → 1 - (TBT/600)

JSON Output erweitert um Objekt `composite` (config + ranking). Markdown enthält zusätzliche Tabelle `Composite Score`.
Empfehlung: Gewichte feinjustieren wenn reale INP Daten (RUM) vorliegen – INP kann später LCP teilweise ersetzen oder mit eigenem Gewicht ergänzt werden.

### Badge Generation (Top City)
Script: `scripts/seo/city-perf-badge.mjs`

Erzeugt JSON + optional Markdown + Shields Badge URL für die führende Stadt je Kennzahl (Composite bevorzugt, fallback LCP):
```
node scripts/seo/city-perf-badge.mjs --ranking docs/city-perf-ranking.json --out docs/city-perf-badge.json --metric composite --markdown
```
Beispiel Markdown Badge Einbindung:
```
![Top City composite](https://img.shields.io/badge/city%20composite-92-brightgreen)
```
Metriken:
- `--metric composite` (falls Ranking Composite enthält)
- `--metric lcp`
- `--metric perfScore`

Farbskala (heuristisch):
- LCP < 1800ms brightgreen / <2500ms yellow / sonst orange
- Composite & Performance Score: ≥90 brightgreen, ≥75 green, ≥60 yellow, sonst orange

Daily Workflow committet automatisch: `city-perf-badge.json` + `city-perf-badge.md`.

### City Content Similarity Audit

Zur Vermeidung von Duplicate / Near-Duplicate Content zwischen City Landing Pages steht ein Audit Script zur Verfügung.

Run (Standard Threshold 0.80):
```
npm run city:audit
```
Mit Vergleich zur vorherigen Version:
```
node scripts/seo/city-content-audit.mjs --threshold 0.80 --prev docs/city-content-similarity.json
```
Optionen direkt:
```
node scripts/seo/city-content-audit.mjs --threshold 0.85 --top 25 --prev docs/city-content-similarity.json
```
Outputs:
- `docs/city-content-similarity.json`
- `docs/city-content-similarity.md`

Schweregrade (Cosine Similarity):
- HIGH ≥ 0.90: Sofort differenzieren (lokale Dachformen, Netzbetreiber-Dauer, Förderprogramme, regionale Verschattung, Wirtschaftlichkeitsfaktoren)
- MED 0.85–0.89: Paragraph-Erweiterung + 1–2 spezifische lokale Abschnitte
- LOW 0.80–0.84: Beobachten
- OK < 0.80: Unkritisch

Neue Kennzahlen:
- Overlap: Jaccard Token Overlap (gemeinsame eindeutige Tokens / Vereinigungsmenge) → zeigt Wortschatz-Differenz.
- Δ Sim: Veränderung der Similarity vs. vorherigem Lauf (nur wenn --prev gesetzt).

Empfohlene Unique Copy Maßnahmen:
- Abschnitt „Regionale Besonderheiten“ (Netzanschlusszeiten, Genehmigungsquote)
- „Lokaler Energie-Mix & Einspeiseprofil“ (falls Daten verfügbar)
- Spezifische Speicher-/Wallbox-Adoptionsrate Region
- Typische Dachmaterialien / Altersstruktur Gebäudebestand

CI Policy (Exit Codes):
- Enthält HIGH → Exit Code 3 (Pipeline kann brechen)
- MED (kein HIGH) → Exit Code 2 (Warnung)
- LOW (kein HIGH/MED) → Exit 0
- Keine Paare ≥ Threshold → Exit 0

## Netzanschluss & Anmeldung (Neue Landing Page)

Seite: `/netzanschluss`

Ziele:
- Suchintents: "pv netzanschluss dauer", "netzbetreiber anmeldung pv", "stromnetz anmeldung speicher", "wallbox genehmigung 11kw".
- Vertrauen: Prozess-Transparenz (HowTo Schema) + FAQ entlastet Rückfragen.
- Interne Autorität: Verlinkung aus City Pages (Abschnitt Installation / Inbetriebnahme) + Pricing (Hinweis auf Bearbeitungszeit Puffer) + Technology (Messkonzept Integration).

Strukturierte Daten:
- `HowTo` (Schritte Vorprüfung → Inbetriebnahme) für Rich Result Potenzial.
- `FAQPage` (häufige Verzögerungs-Ursachen & Unterlagenliste).
- `BreadcrumbList`.

Erweiterungsideen:
- Dynamische Bearbeitungszeit-Statistik (Durchschnitt / Spannweite) aus realen Projektdaten.
- Formular: Upload Checkliste Unterlagen (führt zu Lead + Vollständigkeits-Score).
- Messkonzept Varianten Galerie (z.B. PV + Speicher + Wallbox + Wärmepumpe).

Interne Verlinkungsempfehlungen (Ankertexte):
- In City Pages: "Netzanschluss Anmeldung – Dauer & Schritte" → `/netzanschluss`
- In FAQ Home/City: Frage zu Bearbeitungszeit → Deep Link zu Abschnitt.
- In Pricing: Hinweis auf Zeitpuffer (kWp Paket → Link).

KPI Tracking:
- Scroll-Depth (HowTo Steps) → zeigt Informationskonsum.
- Klicks auf Portal-Links (Outbound Events) → Validiert Nutzwert.
- Conversion Assist (Lead Attribution) – später via UTM / Session Journey.

### Interne Verlinkung Netzanschluss (Implementiert)

Eingefügte kontextuelle Blöcke mit Deep Links (`#netzbetreiber-portale`, `#faq-netzanschluss`):
- City Pages (Berlin, Hamburg, Brandenburg, München – Muster; roll-out auf weitere vorgesehen)
- Pricing (`Netzanschluss & Zeitpuffer` Hinweisbox)
- Technology (`Messkonzept & Netzanschluss` Box)

SEO Effekte:
- Thema "Netzanschluss / Anmeldung" als eigener semantischer Hub gestärkt
- Reduktion von Thin Content / isolierten Seiten durch bidirektionale Kontext-Verlinkung
- Höhere Chance auf sitelink-artige Enhanced Listings (FAQ + HowTo + interne Relevanz)

Messbare KPIs (optional erfassen):
- Klickrate auf Netzanschluss Links (Outbound Tracking intern)
- Scroll-Depth Netzanschluss Seite (Nutzungstiefe)
- Anteil Leads mit Besuch der Netzanschluss Seite (Attribution / Assisted Conversion)


