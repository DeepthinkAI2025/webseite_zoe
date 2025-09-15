# Operations & Workflows

Zentraler Überblick über wiederkehrende Automationen, Schwellenwerte und manuelle Eingriffe.

## Übersichtstabelle
| Domäne | Script / Workflow | Zweck | Output / Artefakte | Schwellwerte / Fail Kriterien |
|--------|-------------------|-------|---------------------|-------------------------------|
| Förderprogramme | foerderung-auto-update (GH Action) | Wöchentliche Tavily Anreicherung & PR | PR + geänderte `.auto.yml` + generierte MDX | Nur PR bei Diff; Validator Fail bricht ab |
| Förder Validierung | `foerderung:validate`, `foerderung:auto:validate` | Pflichtfelder & ISO Datum | Exit Code | Fehlendes `slug`, `region`, `updated_auto`, leere `programmes` |
| Structured Data Guard | `ci:jsonld-guard` | Inline JSON-LD Verstöße verhindern | Exit Code | Beliebige nicht-whitelisted `<script type="application/ld+json">` |
| Legacy Audit | legacy-audit (Action) | Informative Liste gefährlicher Patterns | JSON Artefakt | Nicht-blockierend aktuell |
| A11y Smoke | a11y-audit (Action) | Axe Analyse Home + 1 City | Report (geplant) | Severity >= serious → Fail |
| Performance Nightly | perf-nightly (Action) | Lighthouse Kennzahlen sammeln | Metrics JSON + HTML (geplant) | Perf < 0.85; A11y < 0.90; SEO < 0.95 |
| KPI Weekly | weekly-gaio (Action) | Exposure, RUM p75, KPI Trends | Mehrere Markdown/JSON Dateien | Keine harten Fails (Reporting) |
| Broken Links | `seo:links` | Crawler Tiefe 2, Link-Status | `broken-links-report.json` | >0 5xx/4xx Links → Review |
| City Similarity | `city:audit` | Duplicate Content Heuristik | CLI Output (geplant JSON) | Similarity > Threshold (0.80) Flag |
| FAQ Duplikate | `faq:dupes` | Dedupe Chancen identifizieren | CLI Output | Keine Fails (nur Hinweis) |
| Lighthouse Manuell | `perf:lh` | Einzel-Lauf gegen Prod/Dev | JSON/Console | Metriken unter Erwartung → Review |

## Förderprogramm Ablauf (Detail)
1. Scheduler (wöchentlich) oder manueller Dispatch.
2. Checkout + Dependency Install.
3. Script `foerderung-auto-update.mjs` erzeugt oder aktualisiert `<bundesland>.auto.yml`.
4. Merge + MDX Generierung via `gen:foerderung` (falls Diff).
5. Validatoren laufen (`foerderung:validate`, `foerderung:auto:validate`).
6. Git Diff checkt Veränderungen → PR mit Zusammenfassung.

Dry Mode: Ohne `TAVILY_API_KEY` kein Schreib-Output (nur Log Hinweise).

## A11y Gate (Zielbild)
- Playwright startet Dev/Preview Server.
- Läuft Axe Analyse über definierte Pfade: `/`, `/standorte/berlin`.
- Filtert Node Violations auf Severity >= serious.
- JSON Report (geplant Pfad: `next-app/docs/a11y-report.json`).
- Fail wenn Liste nicht leer.

## Performance Nightly (Zielbild)
- Build + Start Server.
- Lighthouse Mobile Pass (emuliertes Moto G4, 4x CPU Throttle, 1.5Mbps/0.75Mbps Netz).
- Metriken extrahiert: Performance Score, FCP, LCP, INP, TBT, CLS.
- Persistenz: `next-app/docs/lighthouse-perf-metrics.json` (append oder rotate).
- Fail on threshold Unterschreitung (konfigurierbar via ENV `LH_PERF_MIN`, etc.).

## JSON-LD Governance
- Guard Script sucht nach Inline Script Tags.
- Whitelist: `src/components/seo/JsonLd.tsx` (Server Component) + Tests.
- Erweiterung bei neuen zentralen Render-Komponenten erforderlich.

## Incident Playbook (Kurz)
| Symptom | Mögliche Ursache | Sofortmaßnahme |
|---------|------------------|----------------|
| A11y Workflow rot | Neue Komponente ohne ARIA / Farbkontrast | Lokal `npm test -- grep a11y` (zukünftig), fehlende Labels ergänzen |
| Performance Nightly rot | Große neue Library / unoptimiertes Bild | Bundle Analyse, Bild auf `<Image />` umstellen |
| Förder PR ausbleibend | Kein Diff oder API Key fehlt | Logs prüfen → Secret setzen |
| JSON-LD Guard Fail | Inline `<script type="application/ld+json">` eingefügt | Auf `JsonLd` refactoren |
| Broken Links Report Fehler | Gelöschte oder verschobene Seite | Redirect oder Link Fix |

## Environment Variablen (Auszug)
| Variable | Zweck | Scope |
|----------|------|-------|
| TAVILY_API_KEY | Förder Auto Update | GitHub Action Secret |
| SLACK_WEBHOOK | Weekly Report Push | Optional Secret |
| SITE_URL | Sitemap / Absolut URLs | Build / Runtime |
| LEAD_WEBHOOK_URL | Lead Benachrichtigung | Runtime |
| GEMINI_API_KEY | (Future) Content/Snippets KI | Runtime / Actions |

## Manuelle Routine Checks
- `npm run ci:verify` vor größeren PRs.
- `npm run perf:lh` nach signifikanten UI/Asset Änderungen.
- `npm run city:audit` nach Bulk-Erstellung neuer Städte.
- Förder PR Review max 24h nach Erstellung.

## Roadmap Operations (Kurz)
- A11y Report Artefakt + Trend Graph.
- Automatische City Similarity JSON Artefakte.
- Förder Confidence Scoring + Expiry Flagging.
- RUM Real User Monitoring Erweiterung (Clustering & Anomalie).