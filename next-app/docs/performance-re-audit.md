# Performance Re-Audit Leitfaden

Dieser Leitfaden beschreibt, wie nach Optimierungen (Code-Splitting, Bildoptimierung, Lazy Loading) ein erneuter Performance-Vergleich durchgeführt wird.

## 1. Voraussetzungen
- Laufender Preview / Dev Server (`pnpm dev` oder produktionsnaher Preview: `pnpm build && pnpm start`)
- Chrome/Chromium verfügbar oder `CHROME_PATH` gesetzt
- Scripts vorhanden: `lighthouse-baseline.mjs`, `lighthouse-compare.mjs`

## 2. Baseline erzeugen (vor Änderung)
Falls noch keine aktuelle Baseline existiert:
```
node scripts/seo/lighthouse-baseline.mjs --base http://localhost:3000
```
Artefakte:
- `docs/lighthouse-baseline-<timestamp>.json`
- `docs/lighthouse-baseline-current.json`

Commit dieser Baseline (separater Commit zur Vergleichbarkeit empfohlen).

## 3. Optimierungen durchführen
Typische Maßnahmen:
- Dynamische Imports (`next/dynamic`) für schwere Komponenten
- Nutzung `next/image` für LCP relevante Bilder
- Entfernen ungenutzter Polyfills / Bibliotheken
- Critical Rendering Pfad straffen (Fonts preloaden, CSS reduzieren)

## 4. Neue Messung nach Optimierung
```
node scripts/seo/lighthouse-baseline.mjs --base http://localhost:3000
```
Damit wird `lighthouse-baseline-current.json` überschrieben (Snapshot).

## 5. Vergleich erstellen
```
node scripts/seo/lighthouse-compare.mjs \
  --old docs/lighthouse-baseline-ALT.json \
  --new docs/lighthouse-baseline-current.json \
  --out docs/lighthouse-diff.json
```
Zusätzlich wird `docs/lighthouse-diff.md` erzeugt (Delta Tabelle).

Interpretation der Deltas:
- Positive Score-Deltas (Performance/A11y/SEO) = Verbesserung
- Negative LCP/TBT/FCP Werte = Verbesserung (Zeit verkürzt)
- CLS nahe 0 lassen – Verschlechterungen untersuchen (Layout Shifts)

## 6. Reale Nutzer Metriken (RUM) ergänzen
Nach Deployment reale Daten sammeln, dann:
```
node scripts/seo/rum-aggregate.mjs
node scripts/seo/rum-dashboard.mjs
```
Öffne `docs/rum-dashboard.html` für P75 Verlauf.

Validierung:
- P75 LCP nähert sich Ziel (< 2500ms)
- P75 INP < 200ms
- TBT sinkt oder bleibt stabil

## 7. Regression Gate (CI) nutzen
Threshold Gate Script (z.B. in CI vor Merge):
```
node scripts/seo/ci-threshold-gate.mjs
```
Umgebungsvariablen anpassbar (siehe README Abschnitt "Threshold Gate").

## 8. Dokumentation & Commit
- `docs/lighthouse-diff.md` + JSON ins Repo
- Kurzer Changelog Abschnitt im PR (Verbesserung in ms + Prozent)

## 9. Häufige Fehlerquellen
| Problem | Hinweis |
|---------|---------|
| Keine Chrome Instanz | `npm i -D puppeteer` und CHROME_PATH setzen |
| LCP bleibt hoch | Bildgröße prüfen, Priorität, Preload Fonts, Hero Markup vereinfachen |
| INP hoch | Lange Tasks via Performance Profiler identifizieren (Third-Party/Bibliothek) |
| TBT hoch | Vermeide synchrones Parsing großer Bundles, dynamischer Import weiter aufteilen |

## 10. Nächste Ausbaustufen
- Mobile spezifischer Lauf (Device Emulation)
- PSI API Integration als Fallback
- Trendgraph (mehrere Diff Snapshots kombinieren)
- Automatisierter PR Kommentar mit Diff Zusammenfassung

---
Stand: 2025-09-13
