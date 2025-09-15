# Structured Data Validator

Script: `next-app/scripts/seo/validate-structured-data.mjs`

## Zweck
Validiert das Vorhandensein definierter Schema.org Typen auf Kernseiten. Dient als Regressionstest für SEO / SERP Rich Result Basis & AEO Signals.

## Anforderungen
| Seite | Pflichttypen |
|-------|--------------|
| / | Organization, WebSite, BreadcrumbList |
| /pricing | OfferCatalog, BreadcrumbList |
| /faq | FAQPage, BreadcrumbList |
| /contact | LocalBusiness, BreadcrumbList |
| alle | BreadcrumbList |

## Nutzung
```bash
# Remote gegen Production Domain
pnpm seo:validate

# Mit expliziter Sitemap
node scripts/seo/validate-structured-data.mjs --sitemap https://www.zoe-solar.de/sitemap.xml --out docs/structured-data-report.json

# Zusätzliche URLs aus Datei
node scripts/seo/validate-structured-data.mjs --urls-file extra-urls.txt

# Lokaler HTML Ordner (z.B. export)
node scripts/seo/validate-structured-data.mjs --local-dir dist
```

## Output
- Konsolenstatus (✓ OK / ✖ fehlt)
- JSON Report (wenn `--out` gesetzt)
- Exit Code 1 falls Pflichttypen fehlen

## Erweiterungsideen
- Validierung einzelner Property-Ketten (z.B. OfferCatalog > Offer > itemOffered)
- Integration in CI (pre-deploy Gate)
- Kombination mit Lighthouse Gate für ganzheitliche Quality Gates

---
Stand: Initiale Implementierung ✅
