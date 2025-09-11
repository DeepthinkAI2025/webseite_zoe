# Theming Architecture & Dark Mode Guidelines

Stand: 2025-09-04 (Initiale Dokumentation – erweitert im Rahmen Wave „Theming & Accessibility“)

## Ziele
1. Einheitliches Farbsystem (Light & Dark) mit garantierter Mindestkontrast Ratio (AA).
2. Reduzierung individueller Hex-Werte im Code → Nutzung semantischer Tokens.
3. Predictable Surfacing: Karten, Overlays, Panels teilen sich abgestufte Layer.
4. Performance: Keine Duplicate Color Layers; Dark Mode rein durch `data-theme` Umschalten (keine doppelte Render-Phase).

## Mechanik
- Root Attribut: `data-theme="warm"` (Basis) + optional `data-theme="dark"` für Dark Mode.
- Toggle persistiert Wahl unter `localStorage['zoe_theme']`.
- CSS Variablen definieren HSL Werte: z.B. `--background`, `--foreground`, `--card`, `--muted`, `--accent`.
- Komponenten nutzen nur semantische Klassen (Tailwind + Custom Utilities) statt roher Hex-Werte.

## Token Layer (Auszug)
| Semantic | Light (HSL) | Dark (HSL) | Zweck |
|----------|-------------|------------|------|
| background | var(--background) | var(--background) | Seite Root |
| card | var(--card) | var(--card) | Card / Panel Hintergrund |
| border | var(--border) | var(--border) | Rahmenelemente |
| accent | var(--accent) | var(--accent) | Interaktiver Fokus / Primärton |
| ring | var(--ring) | var(--ring) | Focus Outline |

(Vollständige Liste im Stylesheet – Redundanzen werden über Audit Scripts gemonitort.)

## Farb & Kontrast Strategie
- Dual-Pass Script (`contrast-check.js`) prüft Light & Dark simultan.
- Erwartete Ratios Mapping: JSON + Guard → Build bricht bei Regression (< Zielratio) ab.
- Empfohlen: Neue Komponenten zuerst in Light entwickeln, dann Dark Tailwind Klassen ergänzen (oder Token Overrides prüfen) → final beide über Script validieren.

## Komponenten Richtlinien
1. Kein Inline-Color-Hex außer in Token Definition oder seltene Spezial-Verläufe.
2. Interaktive States (hover/focus/active) dürfen maximal eine zusätzliche Ebene (Color Shift oder Schatten) nutzen.
3. Fokus: Immer sichtbare Outline (Ring) – nicht allein durch Farbwandel.
4. Dark Mode: Vermeide halbtransparente helle Overlays mit Text (< 90% Opazität) – stattdessen dedizierte dunkle Flächen.
5. Glass Panels nur wo visuelle Tiefe notwendig; für Standard Cards `surface-card` benutzen.

## Dark Mode Aktivierung
```js
// Beispiel (bereits implementiert im ThemeToggle)
document.documentElement.setAttribute('data-theme', selectedTheme);
localStorage.setItem('zoe_theme', selectedTheme);
```

## Motion & Performance
- Beim Umschalten kein Reflow durch bedingtes Mounting; nur Farb-Variablen ändern.
- Audit: Lighthouse + Web Vitals RUM sicherstellen, dass kein Layout Shift entsteht.

## Typografie & Spacing Interaktion mit Themes
- Typografische Tokens (Font Sizes, Line Heights) sind themenunabhängig.
- Spacing Audits (Spacing Script) stellen gleichmäßige Rhythmik sicher – Theme darf keine zusätzlichen Margins einführen.

## Accessibility Checks
| Tool | Zweck | Frequenz | Gate |
|------|-------|----------|------|
| Axe Dual Theme | Semantische/ARIA + Farbkontrast Heuristik | PR + CI | Blockierend (Violations > 0) |
| Contrast Script | Empirische Farb-Kontrast Ratio | Pre-Commit + CI | Blockierend (Regression) |
| Focus Audit | Fokus Reihenfolge / ARIA Heuristik | Manuell + geplanter CI Step | Warnung (zukünftig Gate) |

## Erweiterungen (TODO)
- [ ] Token Visualizer Seite (automatisch generiert) – Variation Tabellen
- [ ] Light/Dark Delta Heatmap (Welche Komponenten brauchen Overrides?)
- [ ] Fallback für High Contrast Mode (prefers-contrast: more)
- [ ] Export Theme JSON → Design Tool Sync

## Nutzung & Richtlinien
### Farb-Token Auswahl
Nur semantische CSS Variablen (`var(--accent)`, `var(--card)`, etc.). Keine direkten Hex Werte in Komponenten – neue Farben zunächst als Token definieren.

### Interaktionszustände
States (hover/focus/active) erzeugen höchstens eine zusätzliche Wahrnehmungsebene: Farb-Shade, leichte Erhöhung (`translate-y-0.5`) oder Ring. Keine konkurrierenden Schatten + Farbwechsel + Skalierung.

### Dark Mode Spezifisch
Kein bedingtes Unmounting. Wenn ein Pattern im Dark Mode nicht funktioniert, Tokens prüfen bevor zusätzliche Klassen eingeführt werden. Transparente Overlays vermeiden sofern Text involviert.

### High Contrast (geplant)
Geplante Theme Variante `data-theme="contrast"` mit Mindest-Kontrast 7:1 für Primärtext, 4.5:1 für Sekundärtexte. Umsetzung: eigene Token Datei + automatisierter Axe & Contrast Pass.

### Token Lifecycle
1. Bedarf erfassen (Issue / Kommentar)  
2. Vorschlag in Abschnitt Pending Tokens ergänzen  
3. Review (Design + Dev)  
4. Merge + Guard Läufe (Contrast / Axe)  
5. Adoption & Aufräumen alter Tokens

### Anti-Patterns
- Harte Hex Farben direkt in JSX  
- Inline Styles für Basis-Farben  
- Duplicate semantische Tokens mit minimaler Differenz (<3 Luminanzpunkte)  
- Media Queries statt Utility Layer (z.B. `:root[data-theme=dark]` Token Override bevorzugen)

## Pending Tokens
_Derzeit keine neuen vorgeschlagenen Tokens._

## Changelog
- 2025-09-04: Initiale Dokumentation angelegt (Grundlagen, Ziele, Mechanik, Guard Überblick).

