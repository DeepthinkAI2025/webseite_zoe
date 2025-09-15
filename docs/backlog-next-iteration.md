# Backlog – Nächste Iteration

## Priorisierungsschlüssel
- P1 = Unmittelbarer Einfluss auf zentrale KPIs (LCP p75, Exposure Normalized, Debt Sum)
- P2 = Mittelbarer Hebel / Voraussetzung für Skalierung
- P3 = Strategisch / langfristig

## Übersicht
| ID | Priorität | Item | Kurzbeschreibung | KPI Zielbezug | Akzeptanzkriterien | Blocker |
|----|-----------|------|------------------|---------------|--------------------|---------|
| 1  | P1 | Top 3 Debt URL Optimierung Welle 1 | Optimierungen (Bilder, Fonts, Inline-CSS) für größte Debt URLs | LCP p75 ↓, Debt Sum ↓ | Debt der Top 3 URLs jeweils ≥15% reduziert (Δ vs. Baseline Snapshot) | Keine |
| 2  | P1 | `<Image />` Migration Kernseiten | Ersetzt `<img>` + setzt `sizes` & responsive SrcSets | LCP, CLS | Alle Above-the-Fold Bilder nutzen `<Image />`, kein CLS Anstieg | Keine |
| 3  | P1 | Query Set Erweiterung (10 neue High-Intent Queries) | Ausbau thematische Abdeckung & Answer Blocks | Exposure Normalized | 10 neue Queries in `gaio-queries.json`, Exposure Score +5 Punkte nach 2 Wochen | Ausreichend Content |
| 4  | P2 | RUM Segmentierung (Device / Connection) | Getrennte Aggregation + Debt pro Segment | Präzision Priorisierung | Segmentierte Dateien: `rum-url-aggregate-mobile.json`, `...-desktop.json` + UI Umschalter | Traffic Volumen pro Segment |
| 5  | P2 | INP Long Task Profiling | Identifikation > 200ms Tasks | INP p75 ↓ | Report Datei mit Task Ursprungs-Funktionen & >50ms Bucket Liste | Tools Setup |
| 6  | P2 | Internal Linking / Content Hub Kickoff | 1 Pillar + 3 Cluster Pages | Exposure, Brand Ratio | Sitemap zeigt neue Cluster; Breadcrumb & JSON-LD korrekt | Content Erstellung |
| 7  | P2 | Automatisierte Debt Threshold Issues | Auto-Issue falls URL Debt > X | LCP Debt | Script erzeugt Issue mit Template (Label: perf-debt) | Entscheidung Schwellenwert |
| 8  | P3 | Internationalisierung (EN Minimal Launch) | `/en` Strukturen, hreflang Rollout | Organic Traffic (International) | hreflang validiert (Search Console Test), EN Pages Build | Übersetzungen |
| 9  | P3 | AI Citation Tracking Erweiterung | SERP / AI Overview Sichtbarkeit messen | Brand / Exposure | Mind. 5 Citation Snapshots persistent | API/Parsing Aufwand |
| 10 | P3 | Media CDN / AVIF Rollout Konzept | Modernes Format & Delivery Plan | LCP / Bytes | Architektur-Doku + Test Deploy 1 Seite | Budget / Hosting Wahl |

## Notizen
- Baseline Debt Snapshot fixieren vor Start Item 1.
- Segmentierung kann zusätzliche ENV Keys einführen (z.B. `RUM_SEGMENT_DIMENSIONS`).
- INP Profiling bevorzugt im Produktions-Build lokal mit Performance Profiler / Long Tasks Aggregation.

