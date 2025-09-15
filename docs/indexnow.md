# IndexNow Submission

Dieses Projekt enthält ein Script zur Übermittlung aktualisierter URLs an Suchmaschinen, die das **IndexNow** Protokoll unterstützen (z.B. Bing, Seznam, Yandex u.a.).

## Ziele
- Schnellere Indexierung neuer oder geänderter Seiten
- Geringere Crawl-Latenz nach Deployments
- Basis für zukünftige Automatisierung (z.B. Trigger nach Build / Content Update)

## Script
`next-app/scripts/seo/indexnow-submit.mjs`

### Features
- Einzelne URL: `--url https://www.zoe-solar.de/pricing`
- Mehrere URLs aus Datei: `--urls changed.txt`
- Sitemap-Modus: `--from-sitemap https://www.zoe-solar.de/sitemap.xml`
- Automatischer Fallback: Wenn keine URL angegeben -> Haupt-Sitemap laden
- Key Handling: Automatische Generierung falls nicht vorhanden (`.indexnow-key.txt` + public/`<key>.txt`)
- Endpoint Override via `--endpoint` (Standard: `https://www.bing.com/indexnow`)

### Nutzung
```bash
# Im next-app Verzeichnis
pnpm seo:indexnow --url https://www.zoe-solar.de/

# Alle URLs aus Haupt-Sitemap
pnpm seo:indexnow --from-sitemap https://www.zoe-solar.de/sitemap.xml

# URLs aus Datei
pnpm seo:indexnow --urls changed.txt
```

### ENV Variablen
- `SITE_BASE` (Default: `https://www.zoe-solar.de`)
- `INDEXNOW_KEY` (Optional: Falls gesetzt, wird dieser Key genutzt statt Generierung)

### Output
- Response Status & Kurzfassung der Antwort
- Fehlermeldung bei nicht 2xx HTTP Status (Exit Code 1)

### Key Verifikation
Das Script legt im `public/` Verzeichnis automatisch die Datei `<key>.txt` an. Diese muss unter `https://www.zoe-solar.de/<key>.txt` erreichbar sein.

### Nächste Schritte (optional)
- Automatischer Trigger nach erfolgreichem Production Deployment
- Diff-Ermittlung (Git) für geänderte Paths → Übergabe via `--urls`
- Kombination mit Lighthouse Orchestrator für End-to-End Post-Deployment Pipeline

---
Stand: Initiale Implementierung ✅
