# Developer Guide

Kurzreferenz für Setup, Tests, Debugging & häufige Aufgaben.

## Setup
```bash
npm install          # Root (delegiert nichts komplexes)
npm run dev          # Startet next-app mit Turbopack
```
Node Version: >= 18 (empfohlen LTS). 

## Nützliche Scripts
| Zweck | Command |
|-------|---------|
| Entwicklung | `npm run dev` |
| Voller CI Check lokal | `cd next-app && npm run ci:verify` |
| Playwright Tests | `cd next-app && npm test` |
| Lighthouse lokal | `cd next-app && npm run perf:lh` |
| JSON-LD Guard | `cd next-app && npm run ci:jsonld-guard` |
| City erstellen | `cd next-app && npm run city:new -- <slug> "Name"` |
| Förder Merge | `cd next-app && npm run gen:foerderung` |

## Debug Tipps
- Build hängt: `NEXT_DEBUG=true` setzen um mehr Logs zu sehen.
- Seltsame Caching Effekte: `.next/` löschen.
- Structured Data Problem: `npm run ci:jsonld-guard` + Browser DevTools → `<script id="ld-*">` prüfen.
- Performance Ausreißer: Einzelnes Lighthouse mit `npm run perf:lh` und Console Traces vergleichen.

## Tests
Playwright Config: `next-app/playwright.config.ts` (Headless default). Beispiel einzelner Test:
```bash
npx playwright test jsonld --project=chromium
```

## A11y (geplant)
Axe Integration erweitert in nachfolgenden Iterationen die Test-Suite. Temporär minimaler Smoke.

## Ordnerstruktur (Kurz)
| Pfad | Inhalt |
|------|--------|
| `src/app/` | App Router Pages & Layouts |
| `src/components/` | Wiederverwendbare UI / SEO Komponenten |
| `src/lib/` | Hilfsfunktionen (SEO, Parsing, Validierung) |
| `scripts/` | Generatoren, Audits, CI Utilities |
| `content/` | Programmatic Daten (YAML/MDX) |
| `docs/` | Berichte & Artefakte |

## Programmatic Content Workflow
```
# Manuelles Update + Merge
npm run gen:foerderung
# Neue Stadt
npm run city:new -- karlsruhe "Karlsruhe" "Photovoltaik Installation Karlsruhe – Planung & Montage"
```

## Environment Variablen (Entwicklung)
Erstelle `.env.local` in `next-app/` bei Bedarf:
```
SITE_URL=http://localhost:3000
TAVILY_API_KEY=...
LEAD_WEBHOOK_URL=...
```

## Coding Standards
- Strikte Vermeidung von Inline JSON-LD → nur `JsonLd` Component.
- Keine `dangerouslySetInnerHTML` ohne Audit Grund.
- Tailwind Klassen: Gruppierung semantisch (Layout / Farbe / Animation getrennt).

## Release Checkliste (Kurz)
1. `npm run ci:verify`
2. A11y & Perf Workflows grün auf PR
3. Förder PR (falls vorhanden) gemerged / reviewed
4. Sitemap Build geprüft (`.next/` + `public/robots.txt` / `sitemap.xml`)
5. Changelog (falls extern benötigt) aktualisiert

## Known Technical Debt
- A11y Coverage minimal (Smoke → Ausbau)
- Performance Trendpersistenz (Nightly Baseline) in Arbeit
- Duplicate Content Weighted Similarity noch nicht umgesetzt

---
Fragen / Ideen: Issue erstellen oder kurzen Hinweis im PR hinterlassen.