## Interaction States Policy

Zustände (Hover, Focus, Active, Disabled) folgen konsistenten Regeln:

1. Hover: max. 1 visuelle Änderung (Farb-Tint oder Schatten). Keine Layout-Verschiebung.
2. Focus Visible: Immer Ring (2px) + ausreichend Kontrast (>= 3:1 zum Hintergrund). Keine rein farbliche Differenz ohne Outline.
3. Active: 1 Schritt dunkler (oder Inset-Schatten) – nicht kombiniert mit starker Skalierung.
4. Disabled: Reduzierte Opazität (>=0.45) + Cursor default + kein Hover/Focus Stil.
5. Motion Reduction: Transitions auf 0ms bei `prefers-reduced-motion: reduce`.

Token Mapping (Beispiele):
- Primär Button: bg-amber-600 hover:bg-amber-500 focus:ring-amber-600 active:bg-amber-700
- Sekundär Button Outline: border-amber-200 hover:bg-amber-50 focus:ring-amber-600 active:border-amber-300

Alle interaktiven Elemente erhalten mindestens `focus-visible:ring-2 focus-visible:ring-offset-2`.

## Keyboard Accessibility Guide

Tab Reihenfolge Grundregeln:
1. Primäre Navigation → Sekundäre Navigation → Haupt-CTA → Content Module → Formulare → Footer.
2. Skip-Link (falls vorhanden) muss Fokus zuerst erhalten.
3. Offcanvas/Drawer: Eröffnung setzt Fokus auf erstes interaktives Element im Drawer, ESC schließt und gibt Fokus zurück zum auslösenden Trigger.
4. Modale/Dialoge: Fokusfalle aktiv; Schließen setzt Fokus zurück.
5. Komponenten mit Composite Roles (z.B. Menüs) verwenden Pfeiltasten intern – Tab verlässt Komponentenrahmen.

Seiten Walkthroughs (Dokumentiert 2025-09-03):
### Home
1. Skip-Link (falls sichtbar) → 2. Hauptnavigation Links → 3. Hero Primär-CTA → 4. Persona Switch / Planner CTA → 5. Value Sections (Heading jeweils Erster Tab) → 6. Lead Formular Felder → 7. Footer Links.

### WhyUs
1. Nav → 2. Hero H1 → 3. USP Bullet Buttons (falls interaktiv) → 4. Testimonials/Trust Badges → 5. FAQ Accordion Trigger (Pfeiltasten innerhalb, Tab verlässt) → 6. Abschluss CTA → 7. Footer.

### Technology
1. Nav → 2. Intro Heading → 3. Tech Grid Cards (jede Card fokussierbar – Enter öffnet Details) → 4. Vergleich/Diagramm (Falls interaktiv: Pfeiltasten) → 5. CTA → 6. Footer.

### Contact / Contact_new
1. Nav → 2. Hero Abschnitt CTA → 3. Formular Error Summary (falls vorhanden) → 4. Pflichtfelder in visueller Reihenfolge (Name → Email → Telefon → Adresse → Selektoren → Nachricht) → 5. Newsletter Checkbox → 6. Submit Button → 7. Sidebar Kontaktkarten → 8. Footer.

### Pricing
1. Nav → 2. Paketkarten (Tab reihum, Enter öffnet ggf. Details) → 3. Vergleichstabelle (Tab durch Links/Buttons, Pfeiltasten innerhalb sortierbarer Headers) → 4. CTA Formular Felder → 5. Footer.

## Focus Visibility
Ziel: Jeder interaktive Fokus ist klar erkennbar (AA). Einheitliche Ring-Strategie.

### Regeln
1. :focus-visible statt :focus verwenden
2. Kein Entfernen des Standard-Rings ohne Ersatz
3. Ring-Farben konsistent: Primär Ring (Brand Akzent) oder Danger Variante
4. Mind. 2px sichtbarer Kontrast zum Hintergrund

### Utilities
Klasse `focus-visible:focus-ring` wendet kombinierte Outline + Shadow an. Für destruktive Aktionen `focus-ring-danger`. Inset Varianten sparsam.

### Beispiele
Button Primär: `.bg-blue-600 hover:bg-blue-700 focus-visible:focus-ring`
Icon Button: `.p-2 rounded hover:bg-neutral-100 focus-visible:focus-ring`
Link Inline: `focus-ring` ergänzen falls Hintergrund-Kontrast niedrig.

### Audit Checkliste
- [ ] Alle Buttons besitzen `focus-visible:focus-ring`
- [ ] Links in Navigation haben sichtbaren Ring
- [ ] Icon Buttons (Schließen, Slider, Testimonials) geprüft
- [ ] Custom Inputs (Range Slider) haben klaren Ring

Status 2025-09-04: Alle vier Punkte erfüllt (Range Slider akzeptiert – zukünftige Harmonisierung optional). Liste bleibt zur Regressionserkennung bestehen.

### Known Gaps
- Range Inputs nutzen browser Standard + zusätzliche ring Styles – zukünftige visuelle Harmonisierung möglich.

### Form Field Focus Pattern (Wave 2 – abgeschlossen 2025-09-04)
Alle Formularfelder (Lead, Contact, Planner, Memory Note) konsolidiert:
- Einheitliche Klassen: `focus-visible:focus-ring focus:outline-none`
- Fehlerzustand erweitert um `focus-ring-danger` bei Invalidität
- Select/Dropdown Trigger: ring + `aria-expanded` dynamisch
- Interne Icon Buttons übernehmen identischen Ring ohne Layout Shift

Checkliste Wave 2 Final:
- [x] Text / Email / Tel / Textarea
- [x] Select Trigger & Optionen
- [x] Range Slider Bedienbarkeit + Ring sichtbar
- [x] Drawer / Modal erste Fokusziele
- [x] Skip-Link Sichtbarkeit + Ring

Ergebnis: Focus Remediation Wave 2 abgeschlossen. Restliche Feintuning-Punkte (Range visuelle Vereinheitlichung) in nächste Wave verschoben.

### Playwright Visual (geplant)
Snapshot Test pro Komponente mit forcierter Focus-Emulation.

### Financing
1. Nav → 2. Hero/Intro Karte → 3. Benefit Cards (je Card erster interaktiver Link/Button) → 4. Förder-Hinweis / Warnkarten → 5. Kontakt CTA → 6. Footer.

### Service
1. Nav → 2. Einführungsabschnitt (H1) → 3. Service-Paket Karten → 4. Vergleich / Hinweise → 5. FAQ / Testimonials (falls sichtbar) → 6. CTA → 7. Footer.

### SuccessStories
1. Nav → 2. Filter / (falls vorhanden) Kategorie Auswahl → 3. Story Cards (Bild-Link zuerst) → 4. Testimonials Abschnitt → 5. Abschluss CTA → 6. Footer.

### Blog / BlogPost
Blog: 1. Nav → 2. Artikelkarten (Titel-Link) → 3. Pagination / weitere Laden Mechanik → 4. Footer.
BlogPost: 1. Nav → 2. Zurück-Link → 3. Inhalts-Text (erste fokussierbare Sprungmarke) → 4. Interne Links (Tab-Reihenfolge im Fluss) → 5. Footer.

### Faq
1. Nav → 2. Intro / H1 → 3. Accordion Trigger reihum (Pfeiltasten optional) → 4. Kontakt CTA → 5. Footer.

### About
1. Nav → 2. H1 → 3. Werte/Principles Cards → 4. Team/Referenzen Sektion → 5. CTA → 6. Footer.

### Imprint / Privacy
1. Nav → 2. H1 → 3. Abschnitt Links (Mail / Adressen) → 4. Footer.

### Projects
1. Nav → 2. Filter Chips (Links/Rechts erlaubt Pfeiltasten Navigation; Space/Enter toggelt) → 3. Projektkarten (Titel verlinkt; Enter öffnet Detail) → 4. CTA Sektion → 5. Footer.

### Drawer / Overlay Focus Order
Trigger → Drawer Container (erstes fokussierbares Element) → Interaktive Inhalte → Schließen Button → (Wrap) zurück an erstes Element. ESC bricht ab und stellt Fokus auf Trigger wieder her.

### Error Handling Fokus
Bei Submit mit Fehlern: Fokus auf Summary; Enter/Space auf Link fokussiert Feld; ESC verlässt nicht das Formular (Standard Browser Verhalten beibehalten).

Alle Walkthroughs werden bei neue Komponentenänderungen (CI Step) gegengeprüft (TODO: automatisiertes Playwright Script).

Tab-Sequenz Ergänzung 2025-09-04: Dynamische Filter & Sektionen (Projects, SuccessStories) komplett dokumentiert; Task "Focus Order & Tab Sequenz" kann als abgeschlossen markiert werden.

## Error Handling & Live Regions

Fehlerzusammenfassung (`role="alert"`) erhält Fokus bei Submit mit Validierungsfehlern. Einzelne Feldfehler haben `role="alert"` und sind via `aria-describedby` verknüpft.

## Form Loading States

Während Submit nutzt das Formular eine polite Live Region für Statusmeldungen. Buttons zeigen progressiven Label-Text.

## Drawer / Overlay ARIA

Drawer: `role="dialog"` + `aria-modal="true"`, Fokusfalle (Tab / Shift+Tab) + ESC Bindung.

---
Weitere Abschnitte folgen nach nächster Wave.

## Layout & Spacing Konsolidierung (2025-09-03)

Reduktion halbtransparenter Weiß-Flächen zur Verringerung von Kontrast-Risiken & Variants:
- Großflächige Container (Hero Formular Box, Feature Items, Sticky CTA) von `bg-white/95` auf `bg-white` vereinheitlicht.
- `Card` Variant `subtle` gewechselt von `bg-white/70` zu opakem `bg-white`.
- Kleinformatige Chips / Overlays behalten leichte Transparenz (`bg-white/80`–`/95`) für Lesbarkeit gegen variierende Backdrops.

Nächste Schritte: Evaluierung verbleibender `bg-white/10–20` Overlays für alternative neutrale Token (z.B. `bg-neutral-50/90`).

### Code Splitting (Home)
Lazy geladen: Testimonials (`HomeTestimonials.lazy.jsx`), SmartPlanner (Intersection Observer deferred in `#schnellrechner` Sektion). Ziel: Reduktion initialer Home JS Payload; weitere Kandidaten: FAQ Akkordeons.

### Transparenz Phase 2
Kleine Chips jetzt `bg-neutral-50/90 border border-neutral-200` statt `bg-white/20`. Semi-transparente Panels im SmartPlanner wurden auf opakes `bg-white` vereinheitlicht (früher `bg-white/70 backdrop-blur`). Glass Panels in Story-/Feature-Abschnitten vorerst beibehalten für Tiefenwirkung – Dark Mode Pass prüfen.
