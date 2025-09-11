# webseite_zoe

Webseite für ZOE Solar – Ihr Energiezukunft-Partner. Planung, Lieferung und Montage von Photovoltaik-Anlagen inkl. Speicher und Wallbox zum Festpreis.

## Über das Projekt

Diese Webseite ist eine moderne, responsive Single-Page-Application (SPA) für ZOE Solar, ein Unternehmen, das sich auf Photovoltaik-Komplettanlagen spezialisiert hat. Die Seite bietet Informationen zu Dienstleistungen, Technologien, Preisen und Kontaktmöglichkeiten, optimiert für Barrierefreiheit (A11y), Suchmaschinenoptimierung (SEO) und Performance.

### Hauptfunktionen
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile.
- **Mehrsprachig**: Unterstützt Deutsch, Englisch, Französisch und Italienisch via i18next.
- **Barrierefreiheit**: Axe-Core Audits, Lighthouse A11y Gates, Skip-Links, Fokus-Management.
- **Performance**: Lighthouse Performance Gates, Preact für kleinere Bundles, Lazy Loading, Critical CSS.
- **SEO**: Strukturierte Daten (JSON-LD), Canonical URLs, Sitemap, Meta-Tags.
- **CI/CD**: Automatisierte Gates für A11y, SEO und Performance via GitHub Actions.

## Technologien

- **Frontend**: React mit Preact-Compat (VITE_USE_PREACT=1), React Router für Routing.
- **Build-Tool**: Vite für schnelle Entwicklung und Produktions-Builds.
- **Styling**: Tailwind CSS für Utility-First CSS.
- **Internationalisierung**: i18next mit on-demand Lokalisierung.
- **Icons**: Lucide React Icons.
- **SEO**: react-helmet-async für Meta-Tags.
- **Testing**: Playwright für Smoketests, Axe-Core für A11y-Audits.
- **Performance**: Lighthouse CLI und Node API für Messungen.

## Projektstruktur

```
webseite_zoe/
├── Arbeitsverzeichnis/          # Hauptprojekt-Verzeichnis
│   ├── src/
│   │   ├── components/          # Wiederverwendbare Komponenten
│   │   ├── pages/               # Seiten-Komponenten
│   │   ├── context/             # React Context für globale Zustände
│   │   ├── locales/             # Übersetzungsdateien
│   │   ├── styles/              # Globale Styles
│   │   ├── utils/               # Hilfsfunktionen (SEO, Tracking, etc.)
│   │   └── main.jsx             # Einstiegspunkt
│   ├── public/                  # Statische Assets
│   ├── scripts/                 # Build- und Audit-Skripte
│   ├── tests/                   # Playwright Tests
│   ├── vite.config.js           # Vite-Konfiguration
│   ├── tailwind.config.js       # Tailwind-Konfiguration
│   └── package.json             # Abhängigkeiten und Skripte
├── docs/                        # Dokumentation und Audit-Berichte
├── scripts/                     # Globale Skripte (z.B. Lighthouse Gates)
├── .github/workflows/           # CI/CD Pipelines
├── tasks.md                     # Roadmap und Aufgaben
├── CONTRIBUTING.md              # Beitragsrichtlinien
└── README.md                    # Diese Datei
```

## Installation und Setup

### Voraussetzungen
- Node.js 18+ und npm
- Git

### Schritte
1. **Repository klonen**:
   ```bash
   git clone https://github.com/hallo-prog/webseite_zoe.git
   cd webseite_zoe
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   cd Arbeitsverzeichnis
   npm install
   ```

3. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```
   Die Seite ist dann unter `http://localhost:5173` verfügbar.

4. **Produktions-Build erstellen**:
   ```bash
   npm run build
   ```

5. **Build lokal testen**:
   ```bash
   npx serve dist -l 4173 -s
   ```
   Öffne `http://localhost:4173` im Browser.

## Skripte und Befehle

### Im Arbeitsverzeichnis (`Arbeitsverzeichnis/`)
- `npm run dev`: Entwicklungsserver starten.
- `npm run build`: Produktions-Build erstellen.
- `npm run preview`: Build lokal previewen.
- `npm run test`: Smoketests mit Playwright ausführen.
- `npm run audit:a11y`: A11y-Audit mit Axe-Core.
- `npm run audit:seo`: SEO-Audit.
- `npm run audit:perf`: Performance-Audit mit Lighthouse.

### Globale Skripte (Projekt-Root)
- `./scripts/lighthouse-gate.sh`: Hartes Performance-Gate (mobil, throttled).
- `./scripts/lighthouse-perf-node.js`: Node-basierte Performance-Messung.
- `./scripts/axe-guard.js`: A11y-Gate.

## CI/CD und Gates

Das Projekt verwendet GitHub Actions für automatisierte Qualitätskontrollen:
- **A11y & SEO Gate**: Axe-Core und Lighthouse A11y Audits (stabil, 3× Zero-Verstöße).
- **Performance Gate**: Lighthouse Performance mit mobilen Throttling (LCP ≤ 3000ms, INP ≤ 200ms, CLS ≤ 0.1). Hinweis: In der aktuellen Umgebung (Codespace) kann Lighthouse nicht ausgeführt werden, da Chromium nicht installiert ist. In Produktionsumgebungen (z.B. GitHub Actions) läuft das Gate korrekt.
- **Smoketests**: Playwright für grundlegende Funktionalität.

### Lokale Gates ausführen
```bash
# A11y & SEO
npm run audit:a11y && npm run audit:seo

# Performance (hartes Gate)
LH_MODE=mobile ./scripts/lighthouse-gate.sh

# Smoketests
npm run test
```

## Beitragen

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Richtlinien zu Beiträgen, Code-Style und Pull-Requests.

### Entwicklungstipps
- Verwende Preact für kleinere Bundles (VITE_USE_PREACT=1).
- Optimiere Bilder mit AVIF/WebP und srcset.
- Stelle sicher, dass alle Änderungen die Gates passieren.
- Teste auf verschiedenen Geräten und Browsern.

## Lizenz

Dieses Projekt ist proprietär und gehört ZOE Solar. Für kommerzielle Nutzung wende dich an den Projektverantwortlichen.

## Kontakt

Für Fragen oder Support: hallo@zoe-solar.de

---

**Letzte Aktualisierung**: September 2025
