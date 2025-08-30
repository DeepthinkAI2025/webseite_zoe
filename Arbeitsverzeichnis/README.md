# ZOE Solar – Vite + React + Tailwind

## Entwicklung starten

```bash
npm i
npm run dev
```

Öffne danach die lokale URL (standardmäßig http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Struktur
- src/pages: Seiten (Home, WhyUs, Technology, Projects, About, Contact, etc.)
- src/components/ui: einfache UI-Bausteine (Button, Card, Badge, ...)
- src/layout.jsx: Header, Footer, Navigation
- src/utils/index.js: createPageUrl Routen-Mapping

## Deployment (Vercel)
Später einfach das Verzeichnis `Arbeitsverzeichnis` deployen. Vercel erkennt Vite automatisch (Build Command: `npm run build`, Output: `dist`).

### API-Basis-URL konfigurieren

- Standard in Entwicklung: `http://localhost:3001`
- Alternativ über `.env` im Frontend setzen:

	Datei `Arbeitsverzeichnis/.env` anlegen:

	VITE_API_BASE_URL=https://mein-backend.example.com

	Hinweis: Die Variable muss mit `VITE_` beginnen, damit sie im Browser verfügbar ist.
