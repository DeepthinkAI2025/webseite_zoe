# Next Optimierungs-Roadmap

Diese Roadmap bündelt sinnvolle nächste Schritte nach dem visuellen Redesign & erfolgreichen Build.

## 1. Code & Typing Härtung
- `any` reduzieren (Form Payloads, API Responses) – Nutzen: bessere DX, weniger Laufzeitfehler.
- Gemeinsame Typen für Lead / Contact (`LeadPayload`, `LeadApiResponse`).
- Zentrale `env` Utility für `process.env.NEXT_PUBLIC_*` Validierung.

## 2. Komponenten Extraktion / Reuse
- `KpiTile`, `ProcessStep`, `ExampleCard`, `DiffCard`, `GlossarPill` als kleine isolierte Komponenten (Verbesserung von Lesbarkeit & Testbarkeit).
- CTA Formular Panel (`zo-glow-panel`) als `GlowPanel` Komponente.
- Vereinheitlichung Buttons Variants (primary / outline / ghost) via konsistentem Design Token Mapping.

## 3. Performance & Web Vitals
- LCP Audit: hero heading + first actionable CTA → `font-display: swap` (already default via next/font) prüfen; optional Preload für primäre Schrift.
- Kritische CSS Reduktion: Audit ungenutzte Utility Klassen in obove-the-fold Bereich (nur falls Bündel wächst).
- Lazy / `loading="lazy"` für nicht sichtbare Bilder (falls noch vorhanden in anderen Seiten).
- Route-level code splitting: Legacy Seiten/Code entfernen (Migration abschließen) → reduziert JS Gesamtlaster.

## 4. Accessibility & Semantik
- Farbkontrast Check der neuen Gradients auf Text (Dark: min 4.5:1 für Fließtext, 3:1 für Large Headlines) – anpassbare `--shadow-color` ggf. abdunkeln.
- Fokus-Stile vereinheitlichen (sichtbar, nicht nur Outline Entfernen). Eigene Klasse `.focus-ring` mit `outline: 2px solid var(--color-emerald-500)` + Offset.
- ARIA Labels für Navigations-Abschnitte (`nav` Landmark Prüfen) → doppelte Landmark vermeiden.
- Form Fehler Feedback mit `aria-invalid` + `aria-describedby` (LeadMiniForm & ContactForm).

## 5. Motion & Reduced Motion
- Animations respektieren `prefers-reduced-motion: reduce` → Fallback: `animation: none;` für `.zo-fade-in` via @media Query.
- Mikrointeraktionen: Hover Elevation + sanfte Scale (max 1.015) für `.zo-card` nur wenn keine Reduced Motion.

## 6. SEO / Content Struktur
- Interne Linking Blöcke (z.B. TOP_CITIES) optional als strukturierte Liste mit `itemListElement` JSON-LD (ListItem Schema) auszeichnen.
- Glossar Inhalt als eigener statischer Hub `/lexikon` → mehr Long Tail Coverage.
- `sitemap.xml`: Prioritäten & Changefreq feinjustieren, sobald Content stabil.

## 7. Monitoring & Observability
- Web Vitals Endpoint `/api/vitals` erweitern: Sampling (z.B. 0.25 Rate) + IP Hash + UserAgent Normalisierung.
- Logging Storage Strategie: Edge KV / Axiom / Umami → definieren.
- Error Boundary (Client) + Reporting an `/api/rum`.

## 8. Security / Hardening
- Rate Limits zentralisieren (`/api/fapro/lead`, `/api/lead`, `/api/vitals`).
- Input Validation via `zod` Schema (Client teilen für Instant Feedback + Server für Sicherheit).
- CSP Header definieren (script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ...). Separate Security Review.

## 9. Theming / Dark Mode Erweiterung
- Aktuell Dark Gradients im Hero vorhanden – konsistentes Dark Theme für alle Cards (`--card-bg-dark`).
- Token Mapping: `--surface-primary`, `--surface-alt`, `--border-subtle` für einfacheres Umschalten.

## 10. Legacy Bereinigung
- `src/legacy/**` schrittweise entfernen oder in getrenntes Archiv Repo verschieben.
- Tracking & RUM Logik vereinheitlichen (nur eine Implementierung – aktuell alt + neu).
- Navigation aus Legacy migrieren (falls noch gebraucht) → Reduktion doppelter JS Patterns.

## 11. Qualitäts-Gates & Tooling
- Playwright Visual Tests auf neue UI aktualisieren (Snapshots regenerieren nach Review).
- A11y Tests (axe) erneut laufen lassen → dokumentieren in `docs/axe-a11y-report.json`.
- Lighthouse Budget: definieren (Performance >= 90, Best Practices >= 95, A11y >= 95, SEO >= 100) – in CI Gate einbauen.

## 12. Form UX Optimierungen
- Inline Validierung onBlur (statt erst beim Submit) für Pflichtfelder.
- Loading State: Spinner Icon (CSS) statt Textwechsel.
- Success State Variation: Angebot Termin CTA direkt anbieten.

## 13. Analytics & Attribution
- UTM Normalisierung in Server API (Kleinbuchstaben + Whitelist).
- Optional: First Touch vs. Last Touch Speicherung (Cookie + Server Merge).

## 14. Internationalisierung (i18n App Router)
- Aktuelle Warnung: i18n in App Router unsupported – Evaluieren: Next 15 Roadmap oder Umstieg auf Middleware-Lösung mit Domain/Routing.
- Fallback Strategie definieren bevor massiver Content Rollout.

---
Priorisierungsvorschlag (MoSCoW):
- Must: 1, 10, 11
- Should: 2, 3, 4, 8
- Could: 5, 6, 7, 12, 13, 9
- Later/Watch: 14

Letzte Aktualisierung: 13.09.2025
