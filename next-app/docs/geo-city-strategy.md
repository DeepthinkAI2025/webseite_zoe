# GEO City Landing Strategy

## Ziele
- Lokale Relevanz & E-E-A-T Signale für Kernregionen stärken
- Modular skalierbares Muster für weitere Städte (Berlin, Potsdam, Leipzig, ...)
- Strukturierte Daten (LocalBusiness, Breadcrumb, optional FAQ / Service) bereitstellen
- Interne Verlinkung zwischen /standorte Übersicht und einzelnen City Pages

## Seitenstruktur
```
/standorte           -> Übersicht Regionen + LocalBusiness mit areaServed
/standorte/berlin    -> Detailseite Berlin (USP, Leistungen, lokale FAQ)
/standorte/<city>    -> Weitere Städte nach Template
```

## JSON-LD Ebenen
1. BreadcrumbList
2. LocalBusiness (City-spezifische URL, areaServed erweitert)
3. Optional FAQPage für lokale Fragen
4. (Optional) Service / OfferCatalog falls städtespezifische Pakete

## Copy Guidelines
- H1: "Photovoltaik Installation <Stadt>"
- Intro Absatz: Nutzen + Prozess (Planung → Montage → Monitoring)
- USP Liste (4–6 Punkte) mit lokalem Bezug (Dachtypen, Netzbetreiber, Urban vs. ländlich)
- Leistungen Block (Standardisierte Stichpunkte)
- Lokale Besonderheiten (Regulatorik, Verschattung, Denkmalschutz etc.)
- FAQ (4–6 kurze, high-intent Fragen)

## Interne Verlinkung
- Von City Pages zurück zur Übersicht (/standorte)
- Querlinks (später) zwischen thematisch ähnlichen Städten (z.B. urbane Cluster)
- Blogartikel, die lokale Themen behandeln, können City Page verlinken (Authority Bridge)

## Skalierung Workflow (neue Stadt)
1. Ordner `src/app/standorte/<slug>/` anlegen
2. `page.tsx` per bestehender Berlin-Vorlage kopieren
3. Text & FAQ anpassen (mind. 30% unique phrasing)
4. LocalBusiness JSON-Aufruf: URL & areaServed anpassen
5. Interne Links prüfen (Breadcrumb, Rücklink)
6. Deployment & Indexierung (Sitemap update automatisch falls App generiert)

## KPI Monitoring
- Organic Landing Impressions je Stadt (Search Console)
- CTR Entwicklung nach strukturiertem Daten Rollout
- Lead Conversion Rate je Region (FAPRO Lead Source + PLZ)
- Time-to-Index (Days from deploy to first impression)

## Technische Notizen
- Rate Limiting für Lead Endpoint implementiert (5 req / 60s / IP – in-memory)
- Für höhere Skalierung: Redis / Edge KV + Geo Weighting
- Optionaler Ausbau: City spezifische OfferBundles + AggregateOffer

## Nächste Ausbauten
- Weitere Städte: Potsdam, Leipzig
- FAQPage Schema für Berlin ergänzen
- Dynamische Sitemap-Sektion für /standorte/*
- Interne Metrik: Ranking-Veränderung je City (Positionsdiff Script)

## Maintenance
- Halbjährliche Überprüfung lokaler FAQ Relevanz
- Monitoring Core Web Vitals je City Page (RUM Dashboard Filter: path prefix)

