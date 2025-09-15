# Broken Link Audit

Script: `next-app/scripts/seo/broken-link-audit.mjs`

## Zweck
Findet defekte interne Links (4xx/5xx) zur Sicherung technischer SEO-Qualität und Nutzererlebnis.

## Features
- BFS Crawl ab Basis-URL (Default: `SITE_BASE` oder `--base`)
- Alternativ: Alle Sitemap URLs prüfen (`--sitemap`)
- Depth Limit (`--depth 3` Standard)
- HEAD Requests (Fallback GET)
- Ausschluss: mailto:, tel:, javascript:, #
- JSON Report via `--out`
- Exit Code 1 bei defekten Links ⇒ geeignet für CI Gate

## Nutzung
```bash
# Standard Crawl bis Tiefe 2
pnpm seo:links

# Tiefe 4
node scripts/seo/broken-link-audit.mjs --base https://www.zoe-solar.de --depth 4

# Nur Sitemap prüfen
node scripts/seo/broken-link-audit.mjs --sitemap https://www.zoe-solar.de/sitemap.xml --out docs/broken-links-report.json

# Crawl begrenzen (Performance)
node scripts/seo/broken-link-audit.mjs --base https://www.zoe-solar.de --limit 150
```

## Output
- Zeilenformat: ✓ 200 URL oder ✖ 404 URL
- Zusammenfassung + optional JSON Report

## Erweiterungsideen
- Externe Links separater Report
- Retry bei transienten 5xx Status
- Integration mit Lighthouse Gate

---
Stand: Initiale Implementierung ✅
