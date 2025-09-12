# Aufgabenplan: Umstieg von Vite-React auf Next.js

## 1. Vorbereitung
- [ ] Backup des aktuellen Projekts erstellen
- [ ] Alle Abhängigkeiten und verwendeten Tools notieren (Tailwind, i18n, etc.)

## 2. Neues Next.js-Projekt anlegen
- [ ] Neues Next.js-Projekt mit `npx create-next-app` im Workspace erstellen
- [ ] TypeScript optional aktivieren
- [ ] Notwendige Abhängigkeiten installieren (Tailwind, react-helmet, etc.)

## 3. Projektstruktur anpassen
- [ ] `src/`-Ordner analysieren: Komponenten, Seiten, Styles, Assets
- [ ] Seiten in das Next.js `pages/`- oder `app/`-Verzeichnis übertragen
- [ ] Komponenten in `components/` übernehmen
- [ ] Statische Assets (Bilder, Icons) in `public/` verschieben
- [ ] Stylesheets und Tailwind-Konfiguration übernehmen

## 4. Routing & Navigation
- [ ] React Router entfernen, Next.js Routing nutzen
- [ ] Alle Routen als Seiten (`pages/*.jsx`) anlegen
- [ ] Navigation/Links auf Next.js `<Link>`-Komponente umstellen

## 5. Head & SEO
- [ ] `react-helmet` durch Next.js `<Head>` ersetzen
- [ ] Meta-Tags, Titel, OpenGraph, etc. in jeder Seite anpassen
- [ ] Sitemap und robots.txt prüfen/neu generieren

## 6. State Management & Context
- [ ] Context-Provider und globale States übernehmen
- [ ] Prüfen, ob Anpassungen für SSR/SSG nötig sind

## 7. API & Datenanbindung
- [ ] Falls vorhanden: API-Routen in `/pages/api/` umziehen
- [ ] Datenfetching ggf. auf `getStaticProps`/`getServerSideProps` umstellen

## 8. Tests & Feinschliff
- [ ] Alle Seiten und Funktionen testen
- [ ] 404- und Error-Pages anlegen
- [ ] Build & Deployment auf Vercel testen

## 9. Dokumentation & Übergabe
- [ ] README und Hinweise für das neue Setup ergänzen
- [ ] Hinweise zu Deployment, DNS, E-Mail, Datenbank aktualisieren

---

**Hinweis:**
Jeder Schritt kann einzeln abgearbeitet und getestet werden. Bei Fragen oder Problemen einfach im Chat melden!