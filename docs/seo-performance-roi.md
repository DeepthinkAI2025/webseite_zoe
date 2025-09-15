# SEO & Performance Maßnahmen → ROI Mapping

| Maßnahme | Erwarteter Hebel (KPI) | Mechanismus / Warum | Aufwand (S/M/L) | Priorität (P1..P3) | Bezug Debt / KPI | Erfolgsindikator |
|----------|------------------------|---------------------|-----------------|-------------------|------------------|------------------|
| Hero / Above-the-Fold Bildoptimierung (WebP + Dimension + Lazy) | LCP p75 ↓, Debt ↓ | Reduziert Render-Blocker & Bytes | M | P1 | Höchste LCP URLs | - Δ LCP Top 3 ↓ >15% |
| `<Image />` Migration kritischer Seiten | LCP/CLS Stabilität | Built-in Optimierung & Layout Reserve | M | P1 | Debt Aggregat | - CLS stabil, LCP Debt ↓ |
| Render-blocking Script Defer/Inline Audit | LCP p75 ↓ | Weniger Hauptthread Block | M | P1 | Langsamste URLs | - TBT / LCP Verbesserung |
| Critical CSS / Above-the-Fold Extract | LCP (Lab) ↓ | Schnellere First Render | L | P2 | High Traffic Pages | - Lab LCP ↓ 10% |
| INP Event Handler Optimierung (debounce Interaktionen) | INP p75 ↓ | Kürzere lange Tasks | M | P2 | RUM INP Top URLs | - INP p75 < Ziel |
| Font Loading Optimierung (Swap / Preload) | LCP & CLS | Verhindert FOIT/FOUT Verzögerungen | S | P2 | Global | - LCP -5% |
| Query Set Erweiterung (GAIO) + neue Q&A Blöcke | Exposure Normalized ↑ | Mehr thematische Abdeckung | S | P1 | Exposure Historie | - Normalized Score > 70 |
| Interne Verlinkung / Content Hub Aufbau | Brand Ratio, Exposure ↑ | Thematische Autorität / Crawl Depth | L | P2 | Coverage Map | - Brand Ratio Trend + |
| FAQ / HowTo Erweiterung (Longtail) | GAIO Presence ↑ | Mehr Antwortsnippets möglich | S | P3 | Query Coverage | - Anzahl Queries mit AnswerBlock |
| Internationalisierung (hreflang + /en Inhalte) | Gesamt Traffic Potenzial ↑ | Neue Märkte / SERPs | L | P3 | hreflang Plan | - hreflang Deployment |
| RUM Segmentierung (Device / Connection) | Präzisere Priorisierung | Targeted Maßnahmen | M | P2 | Debt Weighted | - Segment Debt Differenz sichtbar |
| Lazy Loading nicht kritischer Komponenten | LCP / INP ↓ | Weniger Initial JS | M | P2 | Hydration Profil | - JS Payload ↓ |
| Preconnect / DNS Prefetch für externe Ressourcen | TTFB / LCP | Schnellere Verbindungen | S | P3 | Netzwerk Audit | - Resource Timing Gains |
| Bild-CDN / AVIF Rollout | LCP / Bytes ↓ | Höhere Kompression | L | P3 | Media Inventory | - Durchschnitt Bildgröße ↓ 25% |
| Automatisierte AI Citation Tracking Erweiterung | Brand/Exposure Validierung | SERP/AI Erwähnungen messen | M | P3 | Citation Logs | - 5+ dokumentierte Zitationen |

## Priorisierungslogik
P1 = Hoher direkter KPI Effekt + moderater Aufwand + unmittelbare Debt Reduktion.
P2 = Mittelbarer Effekt oder Abhängigkeit von P1-Ergebnissen.
P3 = Strategisch / langfristig wertvoll, aber kein unmittelbarer KPI Blocker.

## Erfolgskontrolle Framework
1. Snapshot vor Maßnahme sichern (Debt Sum, p75 Werte, Exposure Score).
2. Maßnahme implementieren.
3. 3–5 Tage RUM Daten sammeln (Traffic Voraussetzung beachten).
4. Δ bewerten (Signifikanzbasis: genügend Events / kein `(low n)`).
5. Wenn Ziel nicht erreicht → Gegenmaßnahme oder Nachjustierung (Hypothese überprüfen).
