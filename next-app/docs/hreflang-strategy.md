# Hreflang & Internationalisierungs-Strategie

## Ziele
- Korrekte Sprach-/Regionszuordnung für Suchmaschinen
- Vermeidung von Duplicate Content Signalen bei mehrsprachigem Ausbau
- Vorbereitung für zukünftige Expansion (zunächst de → en → fr/es)

## Ansatz
1. URL-Strategie: Prefix-Pfade (`/en/...`, `/fr/...`) – Root (`/`) bleibt deutsch (Primärmarkt DACH)
2. Technische Grundlage: Dynamische Generierung von `link rel="alternate" hreflang="..."` Tags pro Seite
3. Fallback: `x-default` verweist auf deutsche Root solange keine globale Landing existiert
4. Inhaltliche Priorisierung: Zuerst High-Intent Seiten (Pricing, Contact, Technology, Home) – danach Blog/Pillar Content
5. Lokalisierungsebene:
   - UI Strings via i18next
   - SEO Meta (Title, Description) pro Sprache in zentraler Config
   - Strukturierte Daten (Organization, WebSite, OfferCatalog) sprachspezifisch übersetzte Felder (`name`, `description`)

## Technische Komponenten
- Helper Funktion `buildHreflang({ origin, path, locales, strategy })` (bereits im Legacy Verzeichnis vorhanden – wird ins Next SEO Modul portiert)
- Metadata Factory Erweiterung: akzeptiert optional `alternates: { languages: { en: '/en/...', fr: '/fr/...' } }`
- Middleware (optional): Sprache via Accept-Language vorschlagen, aber kein Auto-Redirect (Soft UX)

## Schritte zur Implementierung
1. Port `buildHreflang` Helper in `src/lib/seo/hreflang.ts`
2. Konfiguration Datei `i18n-locales.ts` mit aktivierten Locales + Mapping
3. Erweiterung `buildMetadata` für dynamische `alternates`
4. Seite `app/layout.tsx`: `<html lang="de">` dynamisch machen (server side detection optional später)
5. Für jede lokalisierte Seite: Datenquelle für Title/Description (JSON Map) + Fallback deutsch
6. Structured Data Anpassungen: `inLanguage` Felder ergänzen (Where sinnvoll: Article, WebSite, LocalBusiness)

## Skalierungsplan
Phase 1 (Tech Debt Low): Nur hreflang + statische Übersetzungen für Pricing + Contact
Phase 2 (Trust & Content): Technology + Home + Why Us
Phase 3 (Topical Authority): Blog Landing + 5 Kern-Pillar Artikel
Phase 4 (AEO/GAIO Feinschliff): Übersetzte FAQ, HowTo und GAIO KeyTakeaways pro Sprache

## Qualitätsmetriken
- Keine Search Console Hreflang Fehler
- CTR Veränderung in Nicht-DE Märkten (Baseline vs +60d)
- Anteil International Sessions

## Offene Punkte
- Locale spezifische Sitemaps (optional) `sitemap-en.xml` etc.
- Region Targeting (de-AT, de-CH) erst bei ausreichender Signalsammlung
- Automatisierte Konsistenz-Prüfung für hreflang Paare im CI

---
Stand: Initiale Strategie definiert – Umsetzungsschritte folgen nach Priorisierung.