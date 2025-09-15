# SEO · GEO · AEO Audit (15.09.2025)

## Zusammenfassung (Executive Snapshot)
Aktueller Stand solide bei strukturierten Daten (Breadcrumb, FAQ, LocalBusiness, HowTo) und starker Geo-Skalierung über viele Standortseiten. Fehlend bzw. ausbaufähig: Core Web Vitals Messbarkeit (Lighthouse Skripte fehlerhaft), systematische interne Verlinkung für thematische Hub-Architektur, E-E-A-T Signale (Team/Expertise), dynamische Aktualisierungsdaten (lastmod), Content Tiefe zu wirtschaftlichen Kennzahlen (LCOE, ROI Modelle), programmatische SERP-Abdeckung (Longtail: "pv förderung <stadt>"). AEO-Potenzial (FAQs) vorhanden – zusätzliche Q&A / HowTo-Cluster noch nicht voll ausgeschöpft.

## Technische SEO
| Bereich | Status | Empfehlung | Priorität |
|---------|--------|------------|-----------|
| Sitemap & alternateRefs | vorhanden (custom transform) | Automatisierten hreflang-Rollout für Locale /en erst aktivieren wenn Content paritätisch | Mittel |
| Canonicals | Nicht explizit sichtbar (vermutlich Next Defaults) | Explizit `<link rel="canonical">` via Metadata API setzen für kritische Seiten (Standorte, Blog) | Hoch |
| Robots.txt | Minimal, ok | Ergänze Block für Staging-Parameter /preview, falls vorhanden | Niedrig |
| Security Headers | Stark (CSP Nonce) | Reporting Endpoint + `report-to` Gruppe einführen | Niedrig |
| Performance Messung | Lighthouse Skripte fehlschlagen | Ursachen: Headless Chrome Pfad / Build Not Running. CI Task reparieren & Web Vitals Logging persistieren | Hoch |
| Image Optimierung | Annahme: Next/Image (nicht gesichtet) | Audit: Prüfen ob alle `<img>` durch Next Image Komponente ersetzt | Mittel |
| Structured Data Vielfalt | FAQ, HowTo, LocalBusiness, Breadcrumb | Ergänze Service + Product (PV Anlage Paket), Review/AggregateRating (nach Policies) | Mittel |
| Last-Modified Signale | repoLastMod global für Sitemap | Pro Seite generisches `lastModified` basierend auf Content Timestamp implementieren | Mittel |

## Structured Data (Schema.org)
Vorhanden:
- BreadcrumbList (mehrere Seiten)
- FAQPage (Start, FAQ, Standorte, thematische Seiten)
- HowTo (Netzanschluss)
- LocalBusiness (global + standortspezifisch)

Fehlt / empfohlen:
- Service (Photovoltaik Planung, Installation, Speicherintegration)
- Product (Standard PV-Pakete / Bundle) – ermöglicht Preisanker & Offering-Kontext
- WebSite + potentialAction (SearchAction) für Sitelinks Search Box
- Organization (separat mit `foundingDate`, `logo`, `contactPoint`, `vatID`)
- Article / BlogPosting (für Blog Slug Seiten – prüfen ob vorhanden, nicht gesichtet)
- FAQ Konsolidierung: Vermeide redundante identische Q/A auf zu vielen Standortseiten (Kann Flaggings verursachen). Variation + lokale Spezifika ausbauen.

## Geo / Local SEO
Stärken:
- Umfangreiche Standort-Deckung (>=20 Städte) mit lokal differenzierten FAQs & Kennzahlen
- LocalBusiness JSON-LD pro Stadt (angepasste `areaServed`)

Lücken & Empfehlungen:
- NAP Konsistenz: Ein zentrales physisches Office? Wenn nur eine rechtliche Anschrift existiert, sekundäre Städte klar als Servicegebiete kennzeichnen statt identische Adresse überall zu implizieren.
- Ergänze Geokoordinaten spezifisch je Stadt (derzeit globaler Satz?). Lokale Seiten können ungefähre Koordinate (Zentrum Stadt) nutzen – Kennzeichnung "Serviceregion".
- Interne Verlinkung Cluster: Standortseiten untereinander nach Bundesland gruppieren (Breadcrumb Pfad /standorte/bayern/muenchen). Bessere thematische Silo-Struktur.
- Regional Authority Signale: Einbindung externer Daten (Globalstrahlung Quellenangabe DWD) + verlinkte Referenzprojekte (mit Geo Tagging /schema Place).

## AEO (Answer Engine Optimization)
- FAQ Abdeckung gut, jedoch Gefahr von Thin / repetitivem Muster. Antwortlängen teils sehr kurz -> Erweiterung mit konkreten numerischen Spannbreiten + Quellen steigert Vertrauenssignal.
- Ergänze Q&A Format zu Förderungen, Netzanschluss Dauer nach Netzbetreiber, Speicher-Dimensionierung Formeln, Amortisationspfade.
- HowTo Cluster erweitern: "PV Anmeldung", "Fördermittel Beantragen", "Stromspeicher Dimensionieren" als eigenständige HowTo Pages.
- Zero-Click SERP Strategie: Prägnante definierende Absätze (Definition Photovoltaik Leistungsfaktor etc.) für Featured Snippets.

## Content & E-E-A-T
Empfehlungen:
- Autorenprofile (Elektromeister, Energieberater) mit Qualifikationen + Person Schema (`Person` + `knowsAbout`).
- Referenzprojekte mit Kennzahlen (kWp, kWh/Jahr, Autarkiegrad, Amortisationszeit) + Bildmaterial (mit Alt-Texte standardisiert: schema Place/ImageObject).
- Transparente Methodik: Berechnungsgrundlagen für Wirtschaftlichkeit (LCOE, ROI) + Annahmen.

## Interne Verlinkung & Informationsarchitektur
- Baue Topic Hubs: /wissen/ (Technik), /foerderung/, /wirtschaftlichkeit/ mit Pillar Content + interne Deep Links zu Blog/Standorte.
- Nutze Breadcrumb JSON-LD bereits – erweitere URL-Struktur für thematische Segmente (jetzt flache Struktur).
- Standortseiten: Querverweise zu thematisch relevanten Serviceseiten (Netzanschluss, Speicher, Förderung) systematisch am Ende.

## Performance & Core Web Vitals
Aktuell keine Messwerte (Lighthouse Fehler). Maßnahmen:
1. CI Fix: Sicherstellen, dass Produktions-Build läuft bevor Lighthouse startet (next build + start, dann audits).
2. RUM: Web Vitals Listener existiert (VitalsListener Komponente). Persistiere Werte (POST an /api/vitals -> Speicherung BigQuery / JSONL).
3. Priorisierte Optimierungen (vermutet):
   - Kritisches CSS minimieren (Tailwind purge okay; prüfen Custom Fonts Preload + font-display:swap)
   - LCP Elemente (Hero Headline/Bild) – Falls Bild fehlt: Hero Illustration `priority` Attribut in Next/Image.
   - INP: Event Delegation für Navigation / Interaktive Komponenten (keine Overhead Libraries einführen).

## Monitoring & Governance
- KPI Matrix (Traffic organisch, CTR, Anteil Non-Brand Top 10, Local Pack Impressions, SERP Feature Coverage, Web Vitals real-user).
- 30/60/90 Tage Setup unten.
- Automatisierte Tests: Add schema validation test (JSON-LD parse + required fields) in Playwright.

## Priorisierte Maßnahmen (Impact / Aufwand)
| Maßnahme | Impact | Aufwand | Phase |
|----------|--------|---------|-------|
| Lighthouse CI Pipeline reparieren | Sehr hoch | Niedrig-Mittel | 30 Tage |
| WebSite + SearchAction Schema | Hoch | Niedrig | 30 Tage |
| Canonical Tags explizit | Hoch | Niedrig | 30 Tage |
| Service + Product Schema | Mittel-Hoch | Niedrig-Mittel | 30-60 |
| Autoren/E-E-A-T Profile | Hoch | Mittel | 60 |
| HowTo Cluster Erweiterung | Mittel | Mittel | 60 |
| Interne Silo /standorte/<bundesland>/ | Hoch (Local topical) | Mittel | 60-90 |
| RUM Persistenz Web Vitals | Hoch | Mittel | 60 |
| Förderungs-/Wirtschaftlichkeits-Hubs | Sehr hoch | Hoch | 60-90 |
| Geokoordinaten je Stadtseite | Mittel | Niedrig | 30 |

## 30/60/90 Tage Plan
### 0–30 Tage
- Fix CI Lighthouse + RUM Endpoint
- Canonical Implementation + SearchAction Schema
- Add Service Schema (Photovoltaik Installation) & Product (PV Komplettpaket Basis)
- Geokoordinaten je Standortseite (Zentrum Stadt) + Klarer Hinweis "Serviceregion"

### 31–60 Tage
- Autorenprofile + Expertise Seiten
- HowTo Erweiterungen (Förderung, Speicher-Dimensionierung)
- Content Hub /wissen + Pillar Artikel
- Persistenz Web Vitals (Dashboard)

### 61–90 Tage
- Bundesland-Unterstruktur & interne Link Re-Mapping
- Erweiterte Wirtschaftlichkeitsmodule (ROI Rechner?)
- Review/AggregateRating (nach echten Kundendaten) konform Guidelines

## KPI Mapping
| KPI | Ziel 90d | Messmethode |
|-----|----------|-------------|
| Core Web Vitals (LCP p75) | < 2.2s | CrUX / RUM | 
| Organischer Non-Brand Traffic | +40% | GSC Filter Non-Brand |
| Standortseiten Top10 Keyword Coverage | +25% | Ranking Tool / GSC Positions |
| Featured Snippet / PAA Gewinnung | 5 zusätzliche | SERP Tracking |
| FAQ Rich Result Erhalt Rate | >85% | GSC Enhancement Report |
| WebSite Sitelinks SearchBox Erscheint | Ja | Markeneingabe SERP |

## Nächste konkrete Umsetzungsvorschläge (Technik)
1. Metadata API erweitern: canonical + organization data.
2. `jsonld.ts` util ergänzen für WebSite, Service, Product.
3. Playwright Test: Prüft 200 Response + `<script type="application/ld+json">` parsebar.
4. CI Workflow Schritt: `next build && next start & sleep 5 && lighthouse ...` (mit Wartezeit / Gesundheitscheck Endpoint).

## Risiko / Warnungen
- Duplizierte FAQ auf vielen Seiten könnte bei Quality Updates entwertet werden → Variation & tieferer Kontext.
- LocalBusiness mehrfach (global + je Stadt) vorsichtig: Stadtseiten eher ServiceAreaBusiness Pattern; nicht überall gleiche Adresse.
- Performance Blindflug bis CI fix: Gefahr Ranking-Verlust bei künftigen Page Experience Anpassungen.

## Fazit
Sehr guter struktureller Grundstock (skalierte Standortarchitektur + initiale Schema-Abdeckung). Um Spitzenposition gegenüber allen Solar-Anbietern in DE zu erreichen, Fokus auf: (a) Messbarkeit & Speed, (b) vertiefte fachliche Autorität, (c) differenzierende datengetriebene Inhalte (Wirtschaftlichkeit, Förderungen), (d) disziplinierte interne Architektur & Variation lokaler Signale. Umsetzung der High-Impact Quick Wins in den ersten 30 Tagen schafft Fundament für nachhaltige Dominanz.
