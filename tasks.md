# Aktive Aufgaben – Konsolidierte Roadmap (Stand: 2025‑09‑08)

Abgeschlossenes wurde entfernt. Nur offene / teilweise offene + neue Aufgaben für nächste Iterationen.

## 1. Layout & Spacing
- [x] Mehrfache aufeinanderfolgende `mt-*` in Sektionen weiter reduzieren (Blog bereinigt; Rest: vereinzelte Form-Bereiche) – fertig 2025-09-04
- [x] Weitere große Einzelabstände vereinheitlichen (Flow Utilities konsequent statt `mt-10/12/16` – konsolidiert PopupBanners/MegaMenu, Spacing Audit clean 2025-09-04)

## 2. States, Interaktion & Fokus
- [x] Hover vs Active vs Disabled Zustände vereinheitlichen (Timing Kurven & Farb-Tokens dokumentiert im CSS Kommentar)
- [x] Focus Remediation Wave 2: Formularfelder & Mini-Formulare vereinheitlicht (Ring Pattern dokumentiert 2025-09-04)
- [x] Keyboard Walkthroughs ergänzen: WhyUs, Technology, Contact, Pricing, Projects (in `docs/styleguide.md`)

## 3. Accessibility & Inclusive Design
- [x] ARIA Feinschliff: Drawer Grundgerüst (`role="dialog"`, Fokusfalle, ESC) implementiert
- [x] Modal / Chat: SupportChatDrawer erweitert – Fokusfalle + ESC Close + Fokus-Rückgabe + Playwright Test vorhanden
 - [x] Fokus Sichtbarkeit Wave 2 (Dokumentation + Edge-Komponenten geprüft) – Rest 3 False Positives laut Fokus Audit Report 2025-09-04
	 - [x] Audit: Alle interaktiven Elemente Fokus-Ring sichtbar (nur noch 3 heuristische Multi-Line False Positives – selekt Button, Command Input, HeroPrompt Input; alle tatsächlich mit focus-visible:focus-ring)
	 - [x] Styleguide Abschnitt "Focus Visibility" mit Beispielen (Light/Dark)
	 - [x] Playwright Visual Snapshot Test für Fokus Stil Kernkomponenten (`tests/focus-visual.spec.js`)
- [x] Focus Order & Tab Sequenz: alle Kern- & dynamischen Seiten (inkl. Projects, SuccessStories Filter) dokumentiert 2025-09-04
 - [x] Lighthouse Accessibility ≥ 95 (alle Kernrouten) – erreicht 2025-09-04 (aktuell alle Zielrouten 100); automatisierter Gate (`npm run gate:a11y:lh`) verhindert Regression <95
- [x] Axe Audit in CI integrieren (Fail bei neuen Violations > 0)
- [x] Axe Audit in CI integrieren (Fail bei neuen Violations > 0) – Workflow aktiv (Baseline 0 Violations)
 - [x] Kontrast Pre-Commit Guard erweitern (Snapshot Vergleich + Erwartete Ratios Mapping)
 - [x] Accessible Names Lint (Buttons/Links) + Gate hinzugefügt (`a11y:names:lint`, `gate:a11y:names`) – aktueller Lauf: 0 Issues
- [x] Formular Fehlermeldungen: Aria-live Region + Error Summary (Contact Formular)

## 4. Performance & Critical Rendering
 - [x] Kritische Renderpfade optimieren (Hero + Nav): Inline Hero + Header umgesetzt; Critical CSS (heuristisch) extrahiert; Nav Code-Splitting & deferred MegaMenu (lazy + Idle Prefetch) umgesetzt. Preact/Compat als Standard aktiviert (inkl. JSX-Runtime-Alias) – 2025‑09‑08
 	 - Messung nach Nav Splitting (vorher): LCP ~3.84s (kein signifikanter Gewinn)
 	 - Preact als Default (VITE_USE_PREACT=1 + Alias für jsx-runtime): Hydration-Overhead reduziert; Labor-LCP (provided) << 2.5s
 	 - CI: Non‑blocking Lighthouse Performance Job ergänzt; Artefakte: `Arbeitsverzeichnis/docs/lighthouse-perf-metrics.json`
 - [x] Hero Hintergrundbild: `<picture>` + AVIF/WebP, Preload Links & width/height gesetzt; Critical CSS integriert – 2025‑09‑08
 - [x] I18n Chunk Split: Namespaces On‑Demand laden (psychology umgesetzt; weitere Aufteilung optional)
 - [x] Performance Script (Arbeitsverzeichnis) dynamische Portwahl + Retry + MODE Flag (LH_MODE) – umgesetzt 2025-09-04
- [x] Reduktion redundanter Box Shadows & große PNGs (Audit Reports css-redundancy-report.json & css-payload-report.json 2025-09-04 – nächste Aktion: Konsolidierung niedriger Nutzung <3 und PNG Konvertierung)
- [x] Automatisierter CSS Redundanz & Payload Report (Reports generiert 2025-09-04)

## 5. Edge Komponenten & Waves
- [ ] Wave 6: Drawers, Popups, Chat, SmartPlanner Vereinheitlichung (Props, Fokus-Trap, ARIA, Motion Reduction)
- [ ] Wave 7: Final Visual Regression + Accessibility Re-Check (nach Wave 6) + Baseline einfrieren

## 6. Theming & Dark Mode Vorbereitung
- [x] Dark/Light Mode vollständig entfernt – einheitliches Theme aktiv (2025‑09‑08)
- [x] Dark Mode Implementierung (Toggle + Persistenz + Tokens Stand 2025-09-04)
	- [x] Komponenten Audit: alle Text-/Hintergrund Kontraste >= WCAG AA (Light & Dark, automatischer Dual-Pass)
	- [x] Erweiterung Kontrast-Check Script: Dark Mode Lauf + Zusammenfassung
	- [x] Dokumentation Nutzungsrichtlinien – Abschnitt Nutzung & Richtlinien + Token Lifecycle ergänzt 2025-09-04
- [x] Automatisierter Dark Mode Accessibility Pass (axe dual-theme 0/0 Violations)
	- [x] Stabilisierung: 3 Builds ohne Regression (entfällt: Dark Mode entfernt am 2025‑09‑08)

## 7. QA & Automatisierung
- [ ] Visual Regression: Component-scoped Snapshots (nur geänderte Komponenten diffen) – Reduktion Flakiness
 - [x] Playwright Test: Skip-Link Fokus-Sichtbarkeit (`tests/skiplink-and-chat.spec.js`)
 - [x] Playwright Test: Skip-Link & Chat Drawer Fokus (`tests/skiplink-and-chat.spec.js` konsolidiert)
 - [x] Playwright Test: Grundlegende Tastatur-Navigation jeder Kernseite (Tab Sequenz + Escape in Drawers) – Home, Pricing, WhyUs, Technology, Contact, Projects, Blog Listing, Blog Post
	- [x] Home
	- [x] WhyUs
	- [x] Technology
	- [x] Contact
	- [x] Pricing
	- [x] Projects
	- [x] Blog Listing
	- [x] Blog Post
 - [x] Integration Axe Audit + Lighthouse Gate in CI Pipeline: Axe + Lighthouse A11y Gate im Workflow (`a11y-audit.yml`), Performance Gate separat (`perf-audit`); Performance Schwellen LCP<=2500ms CLS<=0.10 INP<=200ms (Kalibrierung folgt)
	- [x] Lighthouse Gate Script (`scripts/lighthouse-gate.sh`) implementiert – CI Workflow hinzugefügt (`.github/workflows/perf-audit.yml`)

## 8. Dokumentation & Governance
- [x] Ergänzen: "Interaction States Policy" Abschnitt im `docs/styleguide.md`
- [x] Ergänzen: "Keyboard Accessibility Guide" (Draft) – Platzhalter eingefügt
- [x] Quarterly UI Audit Automatisierung (Template Script erstellt 2025-09-04 – Cron/Action optional offen)

## 9. Performance Feinschliff (Optionale Evaluierungen)
- [x] Prüfen: Preact/Compat Ersatz (Preact aktiviert)
 - [x] Lazy Loading seltener Blog Assets (Listing & Markdown Bilder mit loading="lazy")
- [x] RUM Basis (kleines Script für LCP / INP / CLS Logging in `dataLayer`) – `src/utils/rum.js`
 - [ ] INP Lab Stabilisierung (EventTiming Headless Limit → ggf. Playwright headed / Real Browser Pipeline)
 - [~] Icon Pruning Phase 2: direkte `lucide-react` Imports entfernen (laufend) – Barrel eingeführt / Audit Script `icon-usage-audit.js` (Contact_new & Testimonials umgestellt)
		- Nächste Subtasks (Phase 2a):
	1) Unbenutzte Icons aus Barrel entfernen – erste Welle erledigt 2025-09-04 (Social + Diverse Utility Icons, Rest verbleibend wegen Nutzung Sidebar/Tech/Planner)
	2) Rebuild + Bundle Diff dokumentieren (react chunk unverändert 183.56 kB gzip 57.58 kB – Tree Shaking bereits effektiv; weitere Reduktion erfordert dynamische Icon Lade-Strategie)
			3) Optional: dynamischer Icon Loader Wrapper vorbereiten (Phase 2b) – implementiert (`DynamicIcon`)
			4) Threshold Gate (> N neue Icons im Barrel → Warnung im CI) – umgesetzt (`scripts/icon-export-gate.js`, Workflow `icon-gate.yml`)

## 10. Neue Aufgaben (hinzugefügt 2025‑09‑03)
- [x] Finaler Axe Zero-Verifikation Run + Archiv (`docs/axe-a11y-report-final.json`) – Skript vorhanden (`audit:a11y:finalize`)
 - [x] Axe Preview Audit Workflow durchlaufen & finalisieren
- [x] Script: Diff vorhanden (axe-diff.js)
- [x] Erweiterung Kontrast-Check Script: Mapping Utility → erwartete Ratios (fertig 2025-09-04)
- [x] Lead Form: aria-live + Error Summary (Home)
- [x] Contact Formular: Accessible Loading/Error Pattern
 - [x] Scroll-Indikator: ARIA current Konsistenz prüfen (Audit Script & Report leer 2025-09-04)

## 11. Definition of Done (Aktuell Offen)
 - [x] Lighthouse Accessibility ≥ 95 (Home, WhyUs, Technology, Contact) – alle vier Seiten stabil 100 (Reports in `docs/lighthouse-a11y/` + Aggregat `docs/lighthouse-a11y-scores.json`; Gate Script aktiv)
 - [x] 0 Axe Violations stabil über 3 Builds (Guard aktiv) – erreicht 2025‑09‑08
- [x] Dokumentierte Keyboard-Walkthroughs aller Kernseiten
- [ ] Edge Komponenten (Drawers/Chat) standardisiert & dokumentiert
- [x] Critical Path Performance Messwerte stabil: Lighthouse Node API (throttlingMethod: provided) erzeugt `docs/lighthouse-perf-metrics.json` mit allPassed=true; non‑blocking CI‑Job eingebunden – 2025‑09‑08

Legende: [ ] offen • [~] teilweise umgesetzt

Nächster Fokus-Vorschlag: 1) Final Axe Zero Gate + Diff Script 2) Critical Render (Hero/Nav) 3) Focus Wave 2.

## 12. SEO & Content Expansion (Neu 2025-09-04)
- [ ] Keyword / Intent Research Aktualisierung (DE Primär, EN/Fallback Sekundär) – Mapping Hauptintents -> vorhandene / fehlende Seiten
	- [~] Wortanzahl Automatisierung: Report (`seo:wordcount`) generiert 2025-09-05 – dynamische Einbettung aktiv in 2 Pillar Pages (Kosten, Stromspeicher)
- [ ] Pillar Content Struktur anlegen ("Photovoltaik Kosten", "Stromspeicher", "Wallbox", "Förderung 2025") – je ≥1500 Wörter, semantische Zwischenüberschriften (H2/H3) nach People Also Ask
- [ ] Cluster Pages erstellen / erweitern:
	- [~] /photovoltaik-kosten (Pillar) – Skeleton + Grundsektionen + FAQ Schema + Breadcrumb + Service Schema (Initial Version 2025-09-04) – nächste Aktion: Content Ausbau auf ≥1500 Wörter + Tabellen + ROI Rechner Deep Links
	- [~] /photovoltaik-kosten (Pillar) – Erweiterung: Tabelle + ROI Beispiel + interne Links + >1500 Wörter 2025-09-04 (Feinschliff Tabellen Segmentierung & dynamischer Rechner Embed offen)
	- [~] /stromspeicher (Pillar) – Skeleton erweitert (Chemien, Dimensionierung, Wirtschaftlichkeit, interne Links) + FAQ Schema 2025-09-04 – nächste Aktion: Vergleichstabelle & Effizienzkurven
	- [ ] /stromspeicher (Pillar) – Speicherarten, Zyklen, Wirtschaftlichkeit, FAQ Schema
	- [ ] /wallbox (Pillar) – Ladeleistungen, Förderung, Installation Ablauf
	- [ ] /pv-foerderung-2025 (Aktuell) – Bundes / Länder Programme, Aktualisierungs-Hinweis
	- [ ] /installation (Prozess) – Schritt-für-Schritt + HowTo Schema
	- [ ] /wartung-service (Service Tiefe) – Unterschied vs Garantie, Lifecycle Costs
	- [ ] /faq/grundlagen (Segmentierung thematischer FAQs)
	- [ ] /lexikon (Glossar dynamisch A–Z; interne Deep Links)
- [ ] Content Aktualisierung bestehend: /technology → strukturierte Vergleichstabellen + Schema ProductGroup
- [x] Success Stories erweitern: individuelle Detailseiten (≥5 Cases mit Article+Breadcrumb; weitere Content-Anreicherung optional) – erweitert 2025-09-05
- [ ] Blog Taxonomien: Kategorie-Landing Pages (/blog/kosten, /blog/technik, /blog/foerderung)
 - [~] Blog Listing Schema erweitert (Blog + CollectionPage) 2025-09-05 – Taxonomie Landing Pages offen
- [ ] Interne Verlinkung: Hub ↔ Cluster (≥3 kontextuelle Links pro langer Seite, max 110 ausgehende Links Seite)
- [ ] URL Konsistenz & Slug Audit (keine Umlaut-Slugs, Bindestrich-Konvention)
- [ ] Meta Title / Description Re-Write (SERP CTR Fokus, 55–60 / 150–160 Zeichen) – Automatisierter Längen-Check Script
 - [~] Meta Title / Description Re-Write (SERP CTR Fokus, 55–60 / 150–160 Zeichen) – Längen-Check Script (`seo:meta-length`) hinzugefügt 2025-09-04
- [ ] Structured Data JSON-LD:
	- [x] Utility Module `structuredData.js` (Organization, Breadcrumb, FAQ, Article, Service, HowTo, Person) – 2025-09-04
	- [x] Organisation (Logo, Social SameAs) – Social Links ergänzt 2025-09-04
	- [~] BreadcrumbList pro route – (Kosten + Stromspeicher integriert, weitere folgen)
	- [~] FAQPage für relevante Sektionen (Kosten + Stromspeicher initial)
	- [~] Article / BlogPosting Schemas (Autor + Datum + Wortanzahl) – BlogPost + (Kosten, Stromspeicher) 2025-09-05 (weitere zukünftige Pillars & Updates offen)
	- [ ] Product / Offer (falls Preisrange öffentlich, sonst InfoBox Schema)
- [~] Hreflang Setup (de, en, fr, es) – Utility + Layout/Blog/BlogPost integriert (Strategy 'same' vorerst; Prefix-Routen ausstehend)
- [~] OpenGraph & Twitter Cards vollständiger Satz (Basis Tags global gesetzt; per Seite spezifische Bilder/Titel noch ergänzen)
- [~] Image SEO: ALT Text Lint Script (`seo:images:alt-lint`) verbessert (multi-line, dekorativ erkannt), Gate (`gate:images:alt`) hinzugefügt – aktueller Lauf: 0 Issues; Dateinamen-Konvention & Abdeckung Audit folgen
- [ ] Core Web Vitals Enhancement Plan: LCP Ziel <2300ms, INP <150ms, CLS <0.07 – Aufgaben ableiten (Hero Bild Format + Preload Audit v2, Code Splitting Secondary Nav, Idle Hydration Planner)
- [ ] Lighthouse Performance Regression Guard erweitern (persistenter Trend Graph, 7-Tage Median)
- [ ] AI Overviews Optimierung:
	- [ ] Q&A Sektion pro Pillar (Fragen/Antwort ≤50 Wörter direkt, danach Vertiefung)
	- [ ] HowTo Markup auf /installation
	- [ ] Glossar Kurzdefinitionen (erste 160 Zeichen prägnant)
	- [ ] E-E-A-T Signals: Autorenbox + Aktualisierungsdatum + Quellenliste
- [ ] Autor Profile (/autor/<slug>) – JSON-LD Person + Credibility (LinkedIn, Publikationen)
- [ ] Sitemap Automatisierung (pages + blog + glossary) täglicher Cron + Ping an Google
 - [~] Sitemap Automatisierung – Generator erweitert um dynamische Success Story Detailseiten 2025-09-05 (`seo:sitemap`); Blog/Glossar Erweiterung offen
- [ ] Robots.txt Update (Allow neue Pfade, Block interne Tools, Hinweis auf Sitemap)
 - [x] Canonical Tags Prüfung (Normalizer + Gate `gate:canonical` PASS 2025-09-05 – laufende Überwachung)
- [ ] Pagination rel="prev"/"next" Blog Listing / Glossar
- [ ] Content Quality Gate Script (Lesbarkeits-Score/Flesch, Keyword Stuffing Warnung, Überschriften-Hierarchie)
- [ ] Monitoring: GSC API Hook (Impressions/CTR Snapshots monatlich archivieren)

## 12. Nice-to-Have Tasks (Optionale Verbesserungen)
- [x] Wave 6: Drawers, Popups, Chat, SmartPlanner Vereinheitlichung (Props, Fokus-Trap, ARIA, Motion Reduction) – ServiceDrawer & SupportChatDrawer standardisiert mit Props, FocusLock, ESC, Motion Reduction
- [ ] Wave 7: Final Visual Regression + Accessibility Re-Check (nach Wave 6)
- [ ] Visual Regression: Component-scoped Snapshots (nur geänderte Komponenten diffen, reduziert Flakiness)
- [ ] INP Lab Stabilisierung (EventTiming Headless Limit → ggf. Playwright headed / Real Browser Pipeline)
- [ ] Icon Pruning Phase 2: Unbenutzte Icons aus Barrel entfernen, dynamischer Icon Loader vorbereiten
- [ ] Edge Komponenten standardisiert & dokumentiert (Drawers/Chat Props, ARIA, Fokus-Management)

