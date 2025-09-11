# SEO Tasks - ZOE Solar Website

## ✅ Erledigte Aufgaben (2025-09-11)

### Lokale SEO-Optimierung
- [x] 39 lokale Landing-Pages für Deutschland erstellt
- [x] LocalBusiness Schema-Markups implementiert
- [x] Lokale Navigation mit Dropdown-Menü integriert
- [x] Sitemap-Struktur überarbeitet (Index, Haupt, Lokal)
- [x] Lokales SEO-Monitoring-System implementiert
- [x] Suchmaschinen-Einreichung automatisiert

### Google My Business
- [x] Setup-Anleitung und Daten-Dateien erstellt
- [x] Vollständige Unternehmensdaten vorbereitet
- [x] Lokale SEO-Integrations-Tipps dokumentiert

## 🔄 Laufende Aufgaben

### Google My Business Einrichtung
- [x] Google My Business Daten aktualisiert (Kurfürstenstraße 124, 10785 Berlin, +49-156-78876200)
- [x] Erweiterte Öffnungszeiten: Mo-Fr 08:00-20:00, Sa 10:00-15:00
- [x] Detaillierte Setup-Anleitung erstellt (docs/google-my-business-setup-guide.html)
- [ ] Google My Business Profil manuell einrichten
  - Gehe zu: https://www.google.com/business/
  - Verwende aktualisierte Daten aus: `docs/google-my-business-setup.json`
  - Folge Schritt-für-Schritt Anleitung in: `docs/google-my-business-setup-guide.html`
  - Wähle Postkarten-Verifizierung an: Kurfürstenstraße 124, 10785 Berlin
  - Füge mindestens 10-15 hochwertige Fotos hinzu
  - Aktiviere Q&A-Bereich für Kundenfragen
- [ ] GMB-Verifizierung abschließen (2-3 Wochen Wartezeit)
- [ ] Erste Kundenbewertungen sammeln (Ziel: 5 Sterne)
- [ ] Regelmäßige Beiträge posten (wöchentlich über neue Projekte)
- [ ] Google Ads lokale Suchkampagnen für "Solaranlagen Berlin" einrichten

### Suchmaschinen-Verifizierung
- [ ] Google Search Console einrichten
  - Gehe zu: https://search.google.com/search-console
  - Domain: zoe-solar.de hinzufügen/verifizieren
  - Sitemaps manuell einreichen:
    - `https://zoe-solar.de/sitemap.xml`
    - `https://zoe-solar.de/sitemap-main.xml`
    - `https://zoe-solar.de/sitemap-local.xml`
  - Indexierungsstatus überwachen
  - Crawling-Fehler beheben

- [ ] Bing Webmaster Tools einrichten
  - Gehe zu: https://www.bing.com/webmasters
  - Domain hinzufügen und verifizieren
  - Sitemaps einreichen
  - Indexierungsstatus prüfen

- [ ] Yandex Webmaster (optional)
  - Gehe zu: https://webmaster.yandex.com/
  - Domain hinzufügen
  - Sitemap einreichen

### Sitemap-Einreichung und Suchmaschinen-Optimierung
- [x] Sitemap-Index erstellt: `public/sitemap.xml`
- [x] Hauptseiten-Sitemap: `public/sitemap-main.xml` (12 URLs)
- [x] Lokale Sitemaps: `public/sitemap-local.xml` (39 lokale Landingpages)
- [x] XML-Format korrigiert und validiert
- [x] Automatisches Sitemap-Submission-Script erstellt: `scripts/search-engine-submission.js`
- [ ] Sitemaps manuell in Suchmaschinen einreichen:
  - **Google Search Console**: https://search.google.com/search-console
    - Property hinzufügen: https://zoe-solar.de
    - Sitemap einreichen: `sitemap.xml`
    - Indexierungsstatus überwachen
  - **Bing Webmaster Tools**: https://www.bing.com/webmasters
    - Website hinzufügen: https://zoe-solar.de
    - Sitemap einreichen: `sitemap.xml`
  - **Yandex Webmaster**: https://webmaster.yandex.com
    - Website hinzufügen: https://zoe-solar.de
    - Sitemap einreichen: `sitemap.xml`
- [ ] Indexierungsstatus überwachen (täglich für erste Woche)
- [ ] Crawling-Fehler beheben falls auftretend
- [ ] Rich Snippets in Google Search Console prüfen

## 🎯 Nächste Schritte (Priorität)

### Sofort (diese Woche)
1. **Google My Business einrichten** - Höchste Priorität für lokale Sichtbarkeit
2. **Google Search Console verifizieren** - Sitemaps manuell einreichen
3. **Sitemap-Indexierungsprobleme diagnostizieren** - Warum werden Sitemaps nicht indexiert?

### Kurzfristig (nächste 2 Wochen)
4. **Erste Kundenbewertungen sammeln** - Für GMB-Sterne-Bewertung
5. **Lokale Backlinks aufbauen** - Kontaktiere lokale Partner
6. **Google Ads lokale Kampagnen testen** - Für "Solaranlagen [Stadt]"

### Mittelfristig (nächster Monat)
7. **Lokale Blog-Inhalte erstellen** - "Solaranlagen in Berlin 2025", etc.
8. **Lokale Fallstudien sammeln** - Mit Kunden-Erlaubnis
9. **IndexNow aktivieren** - Für beschleunigte Indexierung

## 📊 Monitoring & KPIs

### Wöchentlich überwachen:
- Lokale Suchergebnisse für "Solaranlagen Berlin", "Photovoltaik München", etc.
- Google My Business Profilaufrufe und Klicks
- Sitemap-Indexierungsstatus in GSC
- Neue lokale Backlinks

### Monatlich berichten:
- Ranking-Verbesserungen für lokale Keywords
- Traffic-Zuwachs von lokalen Suchen
- Conversion-Rate von lokalen Landing-Pages
- Google My Business Performance

## 🛠️ Technische Tools

### Verfügbare Scripts:
```bash
npm run seo:local:monitor      # Lokale Seiten überwachen
npm run seo:submit:sitemaps    # Sitemaps neu einreichen
npm run seo:gmb:guide         # GMB-Anleitung anzeigen
```

### Wichtige Dateien:
- `docs/google-my-business-guide.html` - Vollständige GMB-Anleitung
- `docs/google-my-business-setup.json` - Unternehmensdaten
- `public/sitemap.xml` - Sitemap-Index
- `public/sitemap-local.xml` - Alle lokalen Seiten

## 🚨 Kritische Probleme

### Sitemap-Indexierung
- **Problem**: Sitemaps werden nicht indexiert (laut Screenshot)
- **Mögliche Ursachen**:
  - URLs beginnen nicht mit korrekter Domain
  - Seiten geben HTTP-Fehler zurück
  - Robots.txt blockiert Crawling
  - SSL-Zertifikat-Probleme
  - Sitemap-Syntax-Fehler

- **Diagnose-Schritte**:
  1. Teste alle Sitemap-URLs manuell
  2. Überprüfe robots.txt
  3. Validiere XML-Syntax
  4. Teste HTTPS-Zertifikat
  5. Prüfe Server-Logs auf Crawling-Fehler

## 📝 Notizen

- Brandenburg ist bereits in der lokalen SEO abgedeckt (`solaranlagen-brandenburg.html`)
- Alle 16 Bundesländer sind vorhanden
- Lokale Navigation ist in der Hauptnavigation integriert
- Deutschland-Übersichtsseite ist verlinkt
- Vollständige LocalBusiness Schema-Markups implementiert