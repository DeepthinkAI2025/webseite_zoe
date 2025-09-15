# Deployment, DNS & E-Mail Setup

Stand: 2025-09-13

## 1. Zielumgebung
- Hosting: Vercel (empfohlen für Next.js App Router)
- Alternative: Selbsthosting mit Node 20 + Reverse Proxy (NGINX / Caddy)

## 2. Build & Artefakt
- Befehl: `npm run build` im Verzeichnis `next-app/`
- Output: `.next` + statische Assets unter `next-app/public`
- Node Version: 20.x
- Empfohlen: Vercel Projekt root = Repository Root, Framework preset: Next.js

## 3. Environment Variablen (Beispiele / Platzhalter)
| Variable | Zweck | Beispiel |
|----------|-------|----------|
| NEXT_PUBLIC_SITE_URL | Kanonische Basis-URL | https://www.zoe-solar.de |
| INDEXNOW_KEY | (Optional) IndexNow Key für Push | zufälliger 32-64 hex |
| LOG_LEVEL | Logging Granularität | info |

> Sensible Secrets nicht in Repo commiten. Lokal `.env.local`, bei Vercel über Dashboard setzen.

## 4. DNS Records
Angenommene Hauptdomain: `zoe-solar.de`

| Typ | Host | Wert (Beispiel) | TTL | Zweck |
|-----|------|-----------------|-----|------|
| A | @ | 76.76.21.21 | 300 | Vercel Edge |
| A | www | 76.76.21.21 | 300 | www Alias (alternativ CNAME) |
| CNAME | www | cname.vercel-dns.com. | 300 | Falls bevorzugt statt A |
| TXT | @ | v=spf1 include:_spf.mx.cloudflare.net ~all | 3600 | SPF Basis |
| MX | @ | mx1.mailprovider.de. (prio 10) | 3600 | Mail Eingang |
| MX | @ | mx2.mailprovider.de. (prio 20) | 3600 | Redundanz |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:dmarc@zoe-solar.de | 3600 | DMARC Policy |
| TXT | default._domainkey | (DKIM-Selector vom Mailprovider) | 3600 | DKIM Signatur |
| TXT | @ | google-site-verification=... (optional) | 3600 | Search Console |
| TXT | @ | MS=msXXXXXXXX (optional) | 3600 | Bing Site Auth |

> Falls E-Mail über externen Dienst (z.B. Postmark, Mailjet, Brevo) → zusätzliche DKIM & Tracking CNAMEs hinzufügen.

## 5. Domain & Kanonische URL
- `SITE_URL` / Metadata Helper in `src/lib/seo/constants.ts` auf endgültige Domain setzen.
- Weiterleitungen: `www` → Root (oder umgekehrt, konsistent per 301).
- HTTP → HTTPS erzwungen durch Plattform.
- i18n aktiv (locales: `de`, `en`, defaultLocale `de`) – englische Seiten unter `/en/*`.
- hreflang Alternates im `RootLayout` und der Sitemap (`next-sitemap.config.js`) hinterlegt.

## 6. Caching & Headers
| Ressource | Cache-Control Empfehlung |
|-----------|--------------------------|
| Statische Assets (.js, .css, images) | public, max-age=31536000, immutable |
| HTML (SSR) | no-cache oder public, max-age=0, must-revalidate |
| API Routen | abhängig Semantik (z.B. no-store für dynamisch) |

Vercel: Build Output API + `next.config` nutzen (Image Optimization, Headers). Optional `headers()` Funktion für Security:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## 7. Security / Hardening Checklist
- `next.config.ts`: `poweredByHeader: false`
- CSP optional (Nonce-Basierend) – Aufwand höher wegen Inline JSON-LD.
- Regelmäßige Dependency Updates (monatlich + bei Security Advisories).

## 8. Monitoring & KPIs
- Weekly KPI Workflow vorhanden: Artefakte (Lighthouse / Broken Links / Structured Data / GAIO Queries)
- RUM Pipeline aktiv (Client Beacon → JSONL → Aggregation → optionales Gate via `USE_RUM=1`).
- Performance Re-Audit nach Migration `<img>` → `next/image` (Ziel: LCP p75 < 2500ms real) – Script vorhanden (`lighthouse-baseline.mjs`), lokal mit installiertem Chromium ausführen.
- Remote PageSpeed Insights optional: `scripts/seo/pagespeed-fallback.mjs` + `PSI_API_KEY` ENV.
- Optionale Ergänzung: Sentry (Errors), Vercel Analytics.

## 9. Rollback Strategie
| Szenario | Aktion |
|----------|--------|
| Deployment Regression | Vercel Dashboard → vorheriges Deployment „Promote“ |
| Kritische SEO Fehler | Sofortige Hotfix Branch + Fast Re-Deploy |
| DNS Fehlkonfiguration | TTL niedrig halten (300) für schnelle Korrekturen |

## 10. Manuelle Post-Deploy Checks (Go-Live Liste)
- [ ] Startseite lädt ohne Fehler (Console clean)
- [ ] Core Pages HTTP 200 (/, /pricing, /technology, /faq, /contact)
- [ ] JSON-LD valid (Validator Script / Rich Results Test)
- [ ] Lighthouse (Performance > 0.85, Accessibility > 0.95)
- [ ] Broken Link Audit ohne 4xx/5xx intern
- [ ] Canonical & OG Tags korrekt auf Kernseiten
- [ ] Favicon & OG Image auslieferbar (200)
- [ ] robots.txt & sitemap erreichbar (Sitemap de/en alternateRefs prüfen)
- [ ] IndexNow Key (falls genutzt) erreichbar
- [ ] Security Header vorhanden (HSTS, X-Content-Type-Options, usw.)
- [ ] Google Business Profile JSON-LD vorhanden (RootLayout Script Tag)
- [ ] LocalBusiness + OfferCatalog + FAQ + Breadcrumb Schema ohne Fehler
- [ ] `docs/rum-summary.json` generiert & Gate (falls aktiviert) PASS

## 11. E-Mail Setup Hinweise
- SPF: Nur einen SPF Record – mehrere „v=spf1“ vermeiden.
- DMARC Anfang mit `p=none` zum Monitoring möglich, später `quarantine` oder `reject`.
- DKIM: Mindestens 1024 Bit, besser 2048 Bit.

## 12. Weiterführende Verbesserungen
- CDN Image Handling (next/image + AVIF/WebP) Feintuning
- Edge Middleware für Geo-Routing (später, falls relevant)
- Automatisierte Sitemap Generation & IndexNow Trigger nach Build
- Vollständige EN Content Parität (Pricing, Technology, FAQ etc.)
- AI Citation Tracking Ausbau (SERP Parsing statt Heuristik)

---
Fragen / Änderungen: siehe Issue Tracker oder `docs/` Ordner erweitern.
