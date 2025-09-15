# Performance Instrumentation & RUM

Dieses Dokument beschreibt den Aufbau der Performance Mess-Infrastruktur (Lab + RUM) der Next.js App.

## Ziele
- Kontinuierliches Monitoring kritischer Metriken (LCP, CLS, INP, TBT) sowohl in Laborbedingungen (Lighthouse) als auch mit echten Nutzern (RUM).
- Verhinderung von Regressionen via Threshold Gate im CI.
- Erweiterbarkeit für zukünftige KPI (Conversion, Engagement).

## Komponenten Überblick
| Ebene | Quelle | Datei / Script | Zweck |
|-------|--------|----------------|-------|
| Lab | Lighthouse Batch | `scripts/seo/lighthouse-baseline.mjs` | Erzeugt Snapshots pro Seite |
| Aggregation (Lab) | Dashboard | `scripts/seo/kpi-dashboard.mjs` | Aggregiert Metriken & Structured Data |
| Governance | CI Gate | `scripts/seo/ci-threshold-gate.mjs` | Erzwingt Schwellen (LCP/CLS/TBT) + Warnung für INP |
| Orchestrierung | Build + Server + Analyse | `scripts/seo/kpi-orchestrator.mjs` | End-to-End Pipeline |
| RUM Erfassung | Client Web Vitals | `src/components/VitalsListener.tsx` | Sendet Web Vitals an API |
| RUM Ingestion | API Route | `src/app/api/vitals/route.ts` | Persistiert Events (NDJSON) |
| RUM Aggregation | Batch | `scripts/seo/aggregate-web-vitals.mjs` | Aggregiert NDJSON → JSON |

## Web Vitals (RUM)
Aktuell werden folgende Metriken gemessen:
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)

Jede Metrik wird beim ersten stabilen Wert (oder finalen Messpunkt) an `/api/vitals` gesendet. Die Daten werden in `docs/web-vitals-rum.ndjson` persistiert (eine Zeile pro Event) und können per Aggregationsscript in Kennzahlen (Average & Perzentile) überführt werden.

### Datenschutz & Sicherheit
Es werden keine personenbezogenen Daten, keine IPs, keine Cookies oder Pfade gespeichert – ausschließlich reine Messwerte. Falls Pfad-Differenzierung gewünscht ist, könnte zukünftig die Page Route anonymisiert (Hash) ergänzt werden.

## Structured Data Coverage
Im KPI Dashboard (`docs/seo-kpi-dashboard.json`) wird zusätzlich die Abdeckung der Schema.org Typen erfasst. Aktuell verfügbar: Organization, WebSite, OfferCatalog (+Offer/AggregateOffer), FAQPage, LocalBusiness, HowTo, BreadcrumbList usw. Dies stützt SEO & AI Overview Signale.

## Threshold Strategie
Aktuell harte Fails (= Exit Code 2):
- LCP > 3000 ms (Durchschnitt)
- CLS > 0.1 (Durchschnitt)
- TBT > 250 ms (Durchschnitt)
- Structured Data Typen < 4

Warnung (Exit Code 1):
- INP > 200 ms (es sei denn `FORCE_INP=1`)
- Fehlende einzelne Metriken

Begründung: TBT korreliert frühzeitig mit Interaktivität & ist deterministischer als INP in frühen Phasen. INP bleibt beobachtbar aber nicht blockierend. Optional kann man später reale INP P75 Werte aus RUM Aggregation heranziehen.

## Nutzung
Lab Pipeline lokal:
```
cd next-app
npm run kpi:orchestrate
```
RUM Aggregation (nachdem realer Traffic Events erzeugt hat):
```
node scripts/seo/aggregate-web-vitals.mjs
```

## Erweiterungsideen
- Orchestrator: Automatische Ausführung des RUM Aggregators wenn NDJSON vorhanden.
- Export RUM P75 Werte zurück ins Threshold Gate zur Vergleichbarkeit mit Lighthouse.
- Persistenz in externe Time-Series DB (z.B. Influx, ClickHouse) für Trends.
- Verbindung mit Business KPIs (Conversion Rate vs. LCP Buckets).

## Wartung
- Alte Lighthouse Snapshot Dateien können periodisch rotiert werden (z.B. nur letzte 20 behalten).
- RUM NDJSON sollte regelmäßig aggregiert & geleert werden um Größe zu begrenzen.

---
Stand: Automatisierter Aufbau initial abgeschlossen. Weitere Optimierung jederzeit möglich.
