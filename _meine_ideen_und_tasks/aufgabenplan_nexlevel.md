# Next Level Aufgabenplan – ZOE Solar (Stand: 15.09.2025)

Ziel: Dominanz in organischer Sichtbarkeit (SEO), lokaler Abdeckung (GEO / Local Packs), sowie Answer Engine / Generative SERP Präsenz (AEO) – nachhaltige Verteidigung gegen nationale Solar-Anbieter.

## 1. North Star & KPI Framework
| Dimension | North Star | 90d Ziel | 180d Ziel | Messquelle |
|-----------|-----------|---------|----------|------------|
| Organische Non-Brand Klicks | Wachstum beschleunigen | +40% | +110% | GSC Search Performance (Regex Exkl. Brand) |
| Local Pack Präsenz (Top Städte) | Konsistente Einblendung | 8 Städte stabil | 15 Städte stabil | Grid My Business / SERP API |
| Featured Snippet / PAA Slots | Autoritative Kurzantworten | +5 neue | +15 kumulativ | SERP Tracking |
| CWV LCP p75 Mobile | Schnelle Experience | <2.2s | <1.9s | CrUX + RUM |
| Conversion Rate Lead (SEO Landingpages) | Funnel Effizienz | +15% | +30% | Analytics / CRM |
| Domain Topical Authority (PV Core Cluster) | Hub-Abdeckung | 100% definierte Pillars | + Supporting Longtail 70% | Interne Content-Matrix |
| WebSite Sitelinks Search Box | Brand Trust | Erscheint | Verteidigt | Manuelle SERP Checks |
| E-E-A-T Signals (Expertenprofile) | Vertrauen | 3 Profile Live | 6 Profile + Referenzen | Onsite + Schema |

## 2. Strategische Streams
1. Technische Exzellenz (Perf, Architektur, DX, Messbarkeit)
2. Topical Authority Ausbau (Pillar & Programmatic)
3. Local SEO Skalierung (ServiceArea & Geo-Silos)
4. AEO / Structured Data Dominanz (Schema Coverage & Snippet Engineering)
5. E-E-A-T & Trust Layer (Experten, Referenzen, Methodik)
6. Conversion & UX Optimization (Lead Flow, Microcopy, Proof)
7. Growth Automation & Monitoring (Pipelines, Dashboards, QA)

## 3. Architektonische Initiativen
| Initiative | Beschreibung | Output | Abhängigkeiten | Status |
|------------|--------------|--------|----------------|--------|
| Canonical & Metadata Refactor | Zentrale Metadata Factory mit canonical, alternates, structured seeds | `lib/seo/meta.ts` | None | Open |
| JSON-LD Schema Suite | Erweiterung um WebSite, SearchAction, Service, Product, Person, Review, ServiceAreaBusiness | `lib/seo/jsonld.ts` | Metadata Refactor | Open |
| Lighthouse CI Stabilisierung | Dedicated build & healthcheck Flow | CI Job + Badge | Docker/Build | Open |
| Web Vitals RUM Pipeline | /api/vitals -> JSONL + Aggregator Script (Daily Rollup) | `data/vitals/*` + Dashboard | API Route | Open |
| Geo Silo Routing | /standorte/<bundesland>/<stadt> mit Breadcrumb Erweiterung | Routing + Migrationsredirects | Content Mapping | Planned |
| Content Hub Struktur | /wissen/, /wirtschaftlichkeit/, /foerderung/ Pillar Layouts | 3 Layout Wrapper + Nav | IA Definition | Open |
| Referenzprojekt Modul | Datenmodell & Gallery + Schema Place/Project | `content/projects/*.json` + Page | Design | Planned |
| Programmatic Longtail Engine | YAML/CSV -> Markdown Page Generator (Förderung, EEG, Speicher) | `scripts/generate/` + MD | Data Sourcing | Planned |

## 4. Backlog (Detail Tasks) – Priorisiert (P1 hoch → P3 niedrig)
### P1 (High Impact / Low-Mid Effort)
- [ ] Implement `canonical` Tag pro Seite via Metadata Hook
- [ ] Add WebSite + SearchAction JSON-LD global
- [ ] Add Service Schema (Photovoltaik Installation Deutschlandweit)
- [ ] Lighthouse CI: Build + Start + Wait + Audit (Retry 2x)
- [ ] Setup RUM Endpoint `/api/vitals` + client sender in `VitalsListener`
- [ ] Geokoordinaten Matrix je Stadt (Zentrum Lat/Lon) + Update LocalBusiness → ServiceAreaBusiness Pattern
- [ ] FAQ Variation Engine (Template Pool + Rotator) um Duplikate zu reduzieren
- [ ] Pillar Seiten Skeleton: /wissen/, /foerderung/, /wirtschaftlichkeit/
- [ ] CTA Optimierung Standortseiten (Above-the-fold Lead Box + Sticky Scroll CTA)
- [ ] Internal Link Blöcke: "Relevante Themen" Auto-List aus Taxonomie

### P2 (Medium Impact / Foundation)
- [ ] Product Schema für PV Basis Paket (kWp Range + Preisspanne Modell)
- [ ] Autorenprofile (Person Schema) + Qualifikationen + `knowsAbout`
- [ ] Referenzprojekte MVP (3 Cases) mit Leistungsdaten & Autarkie
- [ ] HowTo Seiten: Förderung beantragen, Speicher dimensionieren, Netzanschluss Ablauf vertieft
- [ ] Wirtschaftlichkeits Glossar (Definitionen für Featured Snippets)
- [ ] Programmatic Förderungsseiten (Bund + Länder 2025)
- [ ] Interne Search Intent Mapping Matrix (Commercial / Informational / Transactional)
- [ ] Structured Data Test Suite (Playwright: parse & validate JSON-LD)
- [ ] Logging Pipeline Rotation (RUM Dateien >30 Tage archivieren)

### P3 (Expansion / Moats)
- [ ] Review & AggregateRating (nach Policy & realen Daten erst)
- [ ] ROI / Autarkie Rechner (Interactive) + Schema `SoftwareApplication`
- [ ] API Integration DWD oder PVGIS (Strahlung) für dynamische Stadt Kennzahlen
- [ ] Chat/Advisor Widget (Solar Konfigurator Light) → Captures Lead Qualifiers
- [ ] Video HowTo Serie + VideoObject Schema
- [ ] Multi-Language (en) erst nach Content Parität / International Roadmap
- [ ] Content Freshness Automation (Timestamp Diff -> lastmod pro Seite)

## 5. Programmatic Content Modell
```
content/
  foerderung/
    bundesweit-2025.yml
    bayern-2025.yml
    ...
  wirtschaftlichkeit/
    lcoe-grundlagen.md
    speicher-wirtschaftlichkeit.md
  wissen/
    solar-wechselrichter-basis.md
```
Generator Script (`scripts/generate/programmatic.ts`) konvertiert YAML → MDX mit auto-injektiertem Schema (FAQ / HowTo) & Source Attribution.

## 6. Schema Coverage Matrix
| Schema Typ | Ziel | Status | Owner |
|------------|------|--------|-------|
| WebSite | SearchAction aktiv | Open | Tech SEO |
| Organization | Vollständig (foundingDate, logo, contactPoint) | Open | Content |
| Service | Installation + Planung | Open | Tech SEO |
| Product | PV Paket Basis | Open | Content/Tech |
| Person | 3 Expertenprofile | Planned | Content |
| FAQPage | Variiert & nicht redundant | Needs Variations | Content |
| HowTo | 4 Kernprozesse | Partial (1) | Content |
| LocalBusiness / ServiceAreaBusiness | Global + Stadt | Partial | Tech SEO |
| Article / BlogPosting | Alle Blogartikel | Review Needed | Content |
| Review / AggregateRating | Nach Datenbasis | Deferred | Legal |

## 7. Risiko & Mitigation
| Risiko | Auswirkung | Mitigation |
|--------|------------|------------|
| FAQ Devaluation | Verlust Rich Results | Variation + tieferer Kontext |
| Performance Blindflug | Ranking-Erosion | CI + RUM Priorisieren (P1) |
| Duplicate LocalBusiness Adressen | Local Spam Signals | ServiceAreaBusiness Modell |
| Fehlende E-E-A-T Signale | Niedriger Trust in YMYL Kontext | Expertenprofile + Quellen |
| Over-Scope early (International) | Verwässerte Ressourcen | Später nach Domestic Dominanz |

## 8. 30 / 60 / 90 Tage Phasen
### 0–30 (Foundation)
- P1 Tasks abschließen (siehe Liste)
- Launch Pillar Skeletons + Grundschema
- CI & RUM betriebsbereit

### 31–60 (Authority Build)
- P2 Kern: Autoren, Referenzen, HowTo Cluster, Programmatic Förderungen
- Structured Data Test Suite stabil

### 61–90 (Moat & Expansion)
- Geo Silo Routing + interne Link Optimierung
- Rechner / Interaktiver Mehrwert MVP
- Review Schema (falls Daten) + DWD/PVGIS Integration Plan

## 9. Monitoring Dashboard (Konzept)
- Panel 1: Daily Web Vitals (LCP/FID/INP/CLS) – p75 & Trend
- Panel 2: GSC Non-Brand Clicks & Impressions (7d avg)
- Panel 3: Top 20 Standort Keywords Ranking Distribution
- Panel 4: Schema Coverage (% Seiten mit FAQ/HowTo/Service/Organization)
- Panel 5: Lead Conversion Rate (SEO Segment)

## 10. Definition of Done (Beispiele)
| Item | DoD |
|------|-----|
| Canonical Refactor | Alle Hauptseiten liefern `<link rel=canonical>` + Self-Canonical Tests grün |
| Service Schema | Valid im Rich Results Test, erscheint 2x in SERP Inspection |
| Lighthouse CI | Pipeline generiert JSON + Score Badge (>90) |
| RUM | Tägliches Rollup File vorhanden + <5% Missing Sessions |
| FAQ Variation Engine | Max 30% identische Q/A Strings über Städte |

## 11. Tooling Ideen
- `scripts/schema/validate.mjs` – Lädt Seiten HTML, extrahiert JSON-LD, validiert Pflichtfelder.
- `scripts/perf/lcp-elements.mjs` – extrahiert Largest Contentful Paint Kandidaten (per Puppeteer Performance Entry).
- `scripts/content/faq-audit.mjs` – Hashing von Q/A zur Duplikatstatistik.

## 12. Nächste Sofortaktionen (Sprint 1 Vorschlag)
1. Canonical Implementation
2. WebSite + SearchAction Schema
3. RUM Endpoint + Client Hook
4. Lighthouse CI Reparatur
5. Geokoordinaten Datenbasis anlegen (CSV -> JSON Import)
6. FAQ Variation Pool definieren
7. Pillar Skeletons deployen

---
Created programmatically—bereit zur iterativen Erweiterung.
