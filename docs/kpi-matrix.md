# KPI Matrix

| Initiative | KPI | Ziel (Quartal) | Messquelle | Frequenz | Owner | Status |
|------------|-----|---------------|------------|----------|-------|--------|
| Core Web Vitals Stabilisierung | LCP p75 | < 2500 ms | `rum-summary.json` (LCP p75) | Weekly | Tech Lead | In Progress |
| Core Web Vitals Stabilisierung | INP p75 | < 200 ms | `rum-summary.json` (INP p75) | Weekly | Tech Lead | Pending RUM Volume |
| Core Web Vitals Stabilisierung | CLS p75 | < 0.1 | `rum-summary.json` (CLS p75) | Weekly | Tech Lead | On Track |
| Performance Debt Abbau | LCP Debt Sum | -30% vs. Baseline | `rum-url-aggregate.json` (Sum debt>0) | Weekly | Perf Champion | New |
| Exposure Ausbau (GAIO) | Exposure Normalized | > 70 | `exposure-normalized.json` | Weekly | Content/SEO | In Progress |
| Brand Visibility | Brand Ratio | +10% vs. Start | `brand-history.json` | Weekly | Marketing | In Progress |
| Strukturierte Daten Qualität | Validation Errors | 0 Critical | `structured-data-report.json` | Weekly | Tech Lead | Green |
| Broken Links Hygiene | Critical Broken Links | 0 | `broken-links-report.json` | Weekly | Tech Lead | Green |
| Anomalie Früherkennung | Repeated Anomaly Issues | <=1 pro Quartal | GitHub Issues label: `anomaly` | Weekly | Perf Champion | New |
| Alert Hygiene | Duplicated Alerts | <=5% | `alert-cache.json` log eval | Monthly | DevOps | New |
| Query Set Pflege | GAIO Query Coverage | 100% definierte Queries | `gaio-query-report.json` | Monthly | Content/SEO | New |
| Internationalisierung Vorbereitung | hreflang Coverage | Konzept + Plan abgenommen | docs/hreflang-strategy.md | Once | Product | Backlog |
| Content Hub Aufbau | Cluster Pages Live | 5 Pillars + 15 Cluster | Site Map / Routing | Quarterly | Content/SEO | Backlog |

Legende Status: Green / In Progress / New / Backlog / Risk.

## Hinweise
- "Pending RUM Volume": INP Aussagekraft steigt mit mehr realen Interaktionen.
- Debt Sum Reduktion wird nach jeder Optimierungswelle neu gemessen (Basis = erster Snapshot nach Aktivierung Debt Feature).
- Alert Hygiene: später optional separate Metrik-Datei generieren (z.B. `alert-events.jsonl`).
