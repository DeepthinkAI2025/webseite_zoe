# Anleitung: Domain & E-Mail bei IONOS behalten – Webseite bei Vercel hosten

Diese Version ist für Menschen ohne Technik-Erfahrung. Du musst nichts programmieren. Folge einfach Schritt für Schritt.

---

## SUPER-KURZ (wenn du keine Zeit hast)
1. Bei https://vercel.com registrieren
2. Auf "New Project" klicken und dein GitHub Projekt auswählen
3. Deployment abwarten → Seite läuft unter `deinname.vercel.app`
4. In Vercel: Domain hinzufügen (z.B. `zoe-solar.de`)
5. Zu IONOS gehen → DNS öffnen → Einträge anpassen wie Vercel es anzeigt
6. Warten bis grün (kann 5–60 Minuten dauern) → Fertig

---

## Projekteinrichtung bei Vercel (etwas genauer)
1. Nach dem Login auf "Add New..." → "Project" klicken
2. GitHub Repo auswählen
3. Wichtig: **Root-Verzeichnis setzen** auf `next-app` (falls das Monorepo Root noch das alte Vite Projekt enthält)
4. Framework Detection: Next.js wird automatisch erkannt
5. Build Command (automatisch): `npm run build`
6. Output Directory (automatisch): `.next`
7. Environment Variablen eintragen (siehe Abschnitt unten)
8. Deploy klicken

### Notwendige Environment Variablen (Beispiele)
| Name | Beispielwert | Zweck |
|------|--------------|-------|
| NEXT_PUBLIC_SITE_URL | https://www.deine-domain.de | Absolute URLs & hreflang |
| INDEXNOW_KEY | abc123xyz | IndexNow API Key (auch als Datei optional) |
| NODE_ENV | production | Sicherstellen produktiver Modus |
| RUM_SAMPLE_RATE (optional) | 1 | Steuerung RUM Events |
| OPENAI_API_KEY (optional) | sk-... | Für AI Beschreibung im Schema Script |
| SLACK_WEBHOOK_URL (optional) | https://hooks.slack.com/services/... | Alerts für Regressions |

Nachträglich anpassbar unter: Project → Settings → Environment Variables.

Fertig = Website läuft auf Vercel, E-Mail & Datenbank bleiben wie sie sind.

---

## Was passiert hier überhaupt?
- IONOS behält: Domain, E-Mail (info@...), Datenbank (falls du eine nutzt)
- Vercel übernimmt: Auslieferung der Webseiten-Dateien (schnell & automatisch SSL)
- Du änderst nur DNS (so wie eine Adressweiterleitung im Internet-Telefonbuch)

---

## 1. Voraussetzungen
- Domain und E-Mail bei IONOS (z.B. zoe-solar.de, info@zoe-solar.de)
- Website-Projekt (z.B. React/Vite) bereit für Deployment
- Vercel-Account (https://vercel.com, kostenlos)

---

## 2. Website auf Vercel deployen
1. Repository (z.B. GitHub) mit deinem Projekt anlegen (falls noch nicht geschehen)
2. Bei Vercel anmelden und "New Project" wählen
3. Repository verbinden und Build-Settings prüfen (z.B. Build Command: `npm run build`, Output: `dist`)
4. Deploy klicken – Vercel baut und veröffentlicht deine Seite unter einer .vercel.app-URL

---

## 3. Domain von IONOS mit Vercel verbinden
1. In Vercel unter "Settings" → "Domains" deine Domain (z.B. zoe-solar.de) hinzufügen
2. Vercel zeigt dir die nötigen DNS-Einträge an (meist CNAME für www, A-Record für Root-Domain)
3. Bei IONOS ins Domain/DNS-Panel gehen
4. Die von Vercel angegebenen DNS-Einträge setzen:
   - CNAME für www auf z.B. cname.vercel-dns.com
   - A-Record für @ (Root) auf die Vercel-IP
5. Änderungen speichern – es kann bis zu 24h dauern, meist aber schneller
6. In Vercel auf "Verify" klicken, bis die Domain verbunden ist

Tipp: Wenn du unsicher bist, mach einen Screenshot der alten DNS-Einträge bevor du änderst.

---

## 4. E-Mail & Datenbank bei IONOS weiter nutzen
- E-Mail (MX-Records) und Datenbank-Einstellungen bei IONOS bleiben unverändert
- Du kannst weiterhin info@zoe-solar.de nutzen (Webmail, Outlook, etc.)
- Datenbank-Zugang (z.B. für Formulare) bleibt bestehen, du kannst per API von deiner Vercel-Seite darauf zugreifen

---

## 5. Wichtige Hinweise
- Die Website läuft jetzt ultraschnell auf Vercel, E-Mail und Datenbank bleiben bei IONOS
- SSL (https) wird von Vercel automatisch eingerichtet
- Bei Problemen mit E-Mail: Prüfe, dass die MX-Records bei IONOS nicht verändert wurden
- Bei Problemen mit der Domain: Prüfe die DNS-Einträge und warte ggf. auf die DNS-Propagation

---

## 6. Optional: Weiterleitungen & SEO
- Leite ggf. www. auf die Root-Domain oder umgekehrt (in Vercel einstellbar)
- Prüfe, ob sitemap.xml und robots.txt nach dem Deployment erreichbar sind
- Reiche die neue Domain in der Google Search Console ein

---

**Fertig!**

Du hast jetzt das Beste aus beiden Welten: ultraschnelle Website, professionelle E-Mail und Datenbank – alles unter deiner eigenen Domain.

Bei Fragen oder Problemen einfach melden!

---

## FAQ (häufige Fragen)
**Wie lange dauert das, bis die Domain funktioniert?**
Meist 5–30 Minuten, offiziell bis zu 24h.

**Geht meine E-Mail währenddessen kaputt?**
Nein – solange du die MX-Einträge nicht löscht oder veränderst.

**Brauche ich einen Programmierer?**
Nein – nur Klicks im Browser.

**Muss ich Dateien hochladen?**
Nein, Vercel holt sich den Code automatisch aus GitHub beim Deploy.

**Kann ich später wieder zurück?**
Ja. Du änderst dann einfach die DNS-Einträge wieder auf die alten Werte.

---

## Schnell-Fehlerhilfe (Troubleshooting)
| Problem | Ursache | Lösung |
|---------|---------|--------|
| Domain zeigt weiter alte Seite | DNS noch nicht aktualisiert | 10–30 Min warten, Cache im Browser leeren (Strg+Shift+R) |
| SSL (https) funktioniert nicht | Zertifikat noch nicht ausgestellt | In Vercel Domain öffnen → warten bis Lock-Symbol aktiv |
| E-Mail kommt nicht mehr an | MX verändert oder gelöscht | Bei IONOS MX Einträge prüfen (sollten auf IONOS Mailserver zeigen) |
| "Verify" in Vercel schlägt fehl | Falscher Eintragstyp oder Tippfehler | DNS Einträge genau mit Vercel vergleichen (Copy/Paste) |
| www funktioniert, Root nicht (oder umgekehrt) | Nur ein Eintrag gesetzt | Beide Varianten (A + CNAME / Redirect) korrekt setzen |

Wenn festhängst: Erst prüfen → Screenshot → dann Hilfe fragen.

---

## Checkliste zum Abhaken
- [ ] Vercel Account erstellt
- [ ] Projekt deployed (`*.vercel.app` URL funktioniert)
- [ ] Domain zu Vercel hinzugefügt
- [ ] DNS Einträge bei IONOS angepasst
- [ ] Domain erfolgreich verifiziert
- [ ] SSL aktiv (https grün)
- [ ] E-Mail getestet (senden & empfangen)

Danach optional: Google Search Console + Sitemap einreichen.

Fertig ✅