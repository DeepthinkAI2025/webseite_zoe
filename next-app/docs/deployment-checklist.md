# Deployment Checklist (Next.js App)

Diese Checkliste stellt sicher, dass ein Release der Next.js Anwendung produktionsreif ist.

## 1. Build & Static Assets
- [ ] `pnpm build` ohne Fehler / Warnings akzeptabel
- [ ] Keine übergroßen Bundles (> 300kb First Load JS pro Route laut Analyzer)
- [ ] Kritische Bilder optimiert (`next/image` oder statisch AVIF/WebP)

## 2. Environment Variablen
- [ ] `NEXT_PUBLIC_SITE_URL` korrekt gesetzt (inkl. https)
- [ ] API Keys / Secrets in Vercel Project hinterlegt (nicht `.env` committed)
- [ ] Optional: `SLACK_WEBHOOK` gesetzt für Reports / Alerts

## 3. SEO & Strukturierte Daten
- [ ] Sitemap generiert (`next-sitemap`) & erreichbar `/sitemap.xml`
- [ ] `robots.txt` korrekt (Allow/Disallow, Host, Sitemap)
- [ ] Kernseiten liefern strukturierte Daten (Organization, LocalBusiness, WebSite, Breadcrumb, FAQ)
- [ ] Canonical URLs vorhanden

## 4. Performance
- [ ] Lighthouse Performance >= 90 (Home + Pricing + Technology)
- [ ] Kein LCP Bild ohne `priority`
- [ ] Dynamische Komponenten lazy geladen (`HeavyChart` verifiziert)
- [ ] Unnötige Polyfills entfernt

## 5. Barrierefreiheit
- [ ] Lighthouse A11y >= 95
- [ ] Axe Audit keine kritischen Fehler
- [ ] Fokusreihenfolge & Skip Links funktionieren

## 6. RUM & Monitoring
- [ ] `/api/rum` schreibt Events lokal (funktionaler Test durchgeführt)
- [ ] Aggregation Script einmal ausgeführt → `docs/rum-summary.json` vorhanden
- [ ] KPI Zielwerte in README definiert (LCP < 2500ms, INP < 200ms)

## 7. Sicherheit
- [ ] Keine geheimen Keys im Repo (grep nach API Keys ok)
- [ ] Headers (Security Middleware optional) – ToDo Phase 2

## 8. Inhalte & Lokalisierung
- [ ] Deutsch & Englisch Kernseiten (Home, Contact, Projects, Locations, Why-Us, FAQ) vollständig
- [ ] Metadaten für EN Seiten korrekt (`<title>`, description)

## 9. Tests
- [ ] Playwright Smoke Tests grün
- [ ] Visuelle Regression akzeptiert (Snapshots aktualisiert falls beabsichtigt)

## 10. Post-Deployment
- [ ] Erste RUM Events prüfen (Browser DevTools Network → /api/rum)
- [ ] Production Lighthouse gegen Live URL laufen lassen (Baseline speichern)
- [ ] Alerting / Weekly Report Workflows aktiv

---

Bei Abweichungen Issues anlegen mit Label `deployment-blocker`.
