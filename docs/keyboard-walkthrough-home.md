# Keyboard Walkthrough – Home Page

Datum: 2025-09-03

Ziel: Verifizierung der logischen Tab-Reihenfolge, Fokus-Sichtbarkeit und Landmark-Struktur der Startseite.

## Testumgebung
Browser: Chromium (Headless Annahme) / Standard Desktop View ≥1280px
Reduzierte Bewegung: nicht aktiviert

## Landmarks & Struktur
- Skip-Link (`Zum Inhalt springen`) – erscheint bei erster Tab-Navigation sichtbar links oben.
- Header (`role="banner"`) mit Logo + Primärnavigation + Aktionen.
- Hauptinhalt indirekt als `<main>` Wrapper innerhalb der Page-Komponente (implizit über Layout). Empfehlung: explizites `<main id="start" role="main">` (Nice-to-have Phase 6).
- Footer Landmark vorhanden (SiteFooter – nicht im Scope dieses Walkthroughs detailliert geprüft).

## Tab-Sequenz (vereinfacht) – Desktop
1. Skip-Link (sichtbar bei Fokus) – Enter springt zur Sektion `#start`.
2. Logo Link (ZOE Solar)
3. Navigation Links der Primärnavigation (in deklarierter DOM-Reihenfolge)
4. Command-Bar Eingabefeld (nur Desktop ≥lg sichtbar)
5. Hero CTA 1 ("In 30 Sek. Ersparnis/ROI prüfen")
6. Hero CTA 2 ("15‑Min‑Mini‑Beratung")
7. (Falls sichtbar) Funnel Inputs im Hero (Range Slider Verbrauch, dann Range Slider Strompreis – beide mit sichtbarem Ring)
8. Scroll-Indikator Dots (Rechts – über Anker) – jeder Dot erhält Fokus-Ring, `aria-current` korrekt für aktiven Abschnitt.
9. Interaktive Buttons / Switcher in "Angebot" (Tier Switcher Smart/Komfort/Premium)
10. Testimonial Pager (Kleine Balken) – Fokus-Ring sichtbar (Focus-Visible Outline)
11. Testimonial Prev / Next Buttons (sichtbar ab sm) – erhalten Ring
12. CTA Buttons in Abschluss-Sektionen (z.B. "Fahrplan anfordern")
13. Footer Links (nicht einzeln aufgeführt).

## Fokus-Sichtbarkeit Bewertung
- Alle überprüften interaktiven Elemente zeigen klaren visuell differenzierten Fokuszustand (Tailwind Utility `focus-ring` / `focus-visible:focus-ring` + Outline/Ring Farbkontrast >= WCAG AA auf weißem oder hellen Hintergrund).
- Range Slider: Browser Standard Thumb + zusätzlicher Ring auf Fokus → ausreichend, Verbesserungs-Idee: custom Thumb mit erhöhtem Kontrast (Phase 6 Candidate).

## ARIA & Semantik
- Testimonial Slider: Region `role="region" aria-label="Kundenstimmen"` vorhanden.
- Pager Buttons: `aria-label="Testimonial n anzeigen"` vorhanden.
- Prev/Next Buttons: Beschriftet mit aria-label.
- Scroll-Indikatoren: Jeder Dot trägt `aria-current="page"` wenn aktiv → OK. (Optional Role="navigation" wrapper – bereits vorhanden via `<nav aria-label="Scroll-Indikatoren">`).
- Tier Switcher Buttons: Nutzen `aria-pressed` für Toggle-State → korrekt für ein Button-Set. Optional radiogroup Pattern (Phase 6 Nice-to-have) für noch klarere Semantik.

## Potentielle Micro-Optimierungen (Backlog)
| Bereich | Empfehlung | Begründung |
|--------|------------|-----------|
| Haupt-Landmark | Explizites `<main role="main">` | Klarere Screenreader Navigation |
| Tier Switcher | `role="radiogroup"` + `role="radio"` Mapping | Präzisere Semantik für exklusiven Zustand |
| Range Slider Labels | Visuelles Label + `aria-describedby` für Zahlenspan | Klarere Orientierung / Screenreader Kontext |
| Scroll Dots | `aria-label` pro Dot statt Nur Titel | Mehrsprachige klare Ansage |

## Fazit
Tab-Reihenfolge logisch, keine Hidden Trap-Focus-Bereiche, Fokuszustände visuell konsistent. A11y Ziel (≥95 Lighthouse Accessibility) durch Fokusremediation nicht gefährdet – nächste Messung sollte bestätigen.

Status: Home Page Keyboard Walkthrough – PASSED (Baseline dokumentiert).
