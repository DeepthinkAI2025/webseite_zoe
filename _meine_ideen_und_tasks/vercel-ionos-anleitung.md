# Anleitung: Domain, E-Mail & Datenbank bei IONOS, Website bei Vercel

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