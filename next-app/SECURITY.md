# SECURITY

Diese Datei dokumentiert die aktuelle Sicherheits- und Härtungsstrategie der Next.js Anwendung.

## 1. Content Security Policy (CSP)
Wir erzwingen eine strikte CSP mit Nonce-basiertem Script-Loading. Ziel: Verhindern von XSS & ungeprüftem Third-Party Code.

Typische Direktiven (vereinfachtes Beispiel – exakte Version siehe `middleware.ts`):
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RUNTIME_NONCE}' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.vercel.com;  
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### 1.1 Nonce Handling
- Pro Request wird in der Middleware ein kryptographisch starker Nonce generiert (z.B. `crypto.randomUUID()` oder randomBytes → Base64).
- Der Nonce wird als HTTP-Header (z.B. `x-nonce`) oder Request-Scoped Context in Server Components weitergereicht.
- Alle erlaubten Inline-Skripte (JSON-LD, kleine Bootstraps) werden über Komponenten gerendert, die den Nonce injizieren – nicht manuell.
- Keine Verwendung statischer `'unsafe-inline'` für Skripte.

### 1.2 Entfernung unsicherer Inline JSON-LD
Alle früheren `<script type="application/ld+json">` Blöcke wurden durch die React Server Component `JsonLd` ersetzt.
Diese liest den Nonce und gibt: `<script id="..." nonce="..." type="application/ld+json">{Serialisiertes JSON}</script>` aus.

### 1.3 Erweiterung der CSP bei neuen Integrationen
Wenn neue externe Skriptquellen benötigt werden:
1. Prüfen ob wirklich notwendig (alternativ serverseitige Einbindung / Edge Processing?).
2. Domain zu `script-src` ergänzen – BEVOR deploy.
3. Falls Subresource Integrity (SRI) möglich: bevorzugen.
4. Keine Wildcards wie `*` oder breit `https:` einsetzen.
5. In Review prüfen: Liefert Quelle ausführbaren JS-Code? Tracking Pixel (IMG) genügt oft ohne script-src Änderung.

## 2. Zusätzliche Security Header
Weitere Header werden zentral (siehe Middleware) gesetzt:

| Header | Zweck |
|--------|-------|
| Strict-Transport-Security | Erzwingt HTTPS Nutzung (HSTS Preload optional). |
| X-Frame-Options / frame-ancestors (CSP) | Clickjacking Schutz. |
| X-Content-Type-Options: nosniff | MIME Sniffing verhindern. |
| Referrer-Policy: strict-origin-when-cross-origin | Privatsphäre & Analytics Balance. |
| Permissions-Policy | Deaktiviert unnötige Browser APIs (z.B. Geolocation, Camera, Mic). |
| Cross-Origin-Opener-Policy | Isoliert Browsing Context gegen Spectre. |
| Cross-Origin-Embedder-Policy | Ermöglicht sichere Nutzung bestimmter Web APIs. |
| Cross-Origin-Resource-Policy | Reduziert ungewolltes Fremd-Embedding. |

## 3. Strukturierte Daten (SEO & Sicherheit)
- JSON-LD wird ausschließlich aus whitelisten Quellen (interne Builder in `@/lib/seo/jsonld`) erzeugt.
- Keine direkte User-Eingabe fließt ungefiltert in strukturierte Daten.
- Serialisierung immer über `JSON.stringify` ohne String-Konkat.

## 4. Abhängigkeiten & Supply Chain
Empfehlungen (ausbaufähig, nächste Iteration):
- Aktivieren Dependabot / Renovate für `package.json`.
- `npm audit --production` im CI prüfen.
- Lockfile Commit Pflicht.

## 5. Umgang mit Third-Party Skripten
Checkliste vor Aufnahme:
- Geschäftlicher Mehrwert klar? (Conversion / Monitoring / Core Feature)
- Datenschutz Bewertung (DSGVO – Opt-In nötig?)
- Security Review (Lieferkette, integrierter Code Umfang)
- Fallback / Degradationsverhalten vorhanden?

## 6. Reporting & Monitoring
Nächste Ausbaustufe (optional):
- CSP Reporting Endpoint (`report-uri` oder `report-to`).
- Sentry o.ä. für Frontend Error Monitoring mit Quellcode-Mapping.
- Automatisierte Lighthouse Security/A11y Checks in CI.

## 7. Lokales Development vs. Produktion
- Dev Modus kann gelockerte CSP (z.B. ohne Nonce) für DX nutzen – Produktion bleibt strikt.
- Niemals Test-Skripte direkt in Produktions-Layout lassen.

## 8. Änderungsvorgang (Governance)
1. Issue oder PR anlegen mit Begründung für Änderung (z.B. neue externe Domain).
2. Risikoanalyse (XSS Oberfläche, Datenschutz, Performance Impact).
3. Review durch Maintainer.
4. Merge + Deployment + Nachbeobachtung.

## 9. Ausblick / Backlog Security Hardening
- Subresource Integrity für statische Third-Party Skripts (falls eingeführt).
- Trusted Types (wenn Build-Pipeline angepasst).
- Header `Sec-Fetch-*` basierte Anomalieauswertung (Server Log Layer).
- Automatisches Secret Scanning (GitHub Native / Gitleaks).

## 10. Schnelle Prüfliste vor Release
- [ ] Keine verbleibenden Inline `<script>` ohne Nonce.
- [ ] grep nach `dangerouslySetInnerHTML` → nur whitelisted Stellen.
- [ ] CSP Build stimmt mit Doku überein.
- [ ] Alle JSON-LD Blöcke via `JsonLd` Komponente.
- [ ] Security Header aktiv (stichprobenartig im Browser / curl prüfen).

## 11. Legacy Migrationsstrategie
Der Legacy-Bereich (`src/legacy/**`) ist eine bewusst isolierte Übergangszone für Altseiten (historisches Markup / Inline JSON-LD / `dangerouslySetInnerHTML`). Er bleibt so kurz wie möglich erhalten und unterliegt strikten Einschränkungen.

### 11.1 Scope & Ausnahmen
- Erlaubt: Bestehende Inline `<script type="application/ld+json">` Blöcke & vorhandene `dangerouslySetInnerHTML`-Verwendungen innerhalb `src/legacy/`.
- Nicht erlaubt: Neue Features, neue Third-Party Skripte, zusätzliche Inline-Skripte oder erweiterte dynamische Inhalte.
- Guard: Der JSON-LD CI Guard ignoriert bewusst `src/legacy/` bis zur vollständigen Migration.

### 11.2 Sunset-Kriterien
Der Legacy-Bereich wird entfernt, sobald ALLE folgenden Punkte erfüllt sind:
1. Funktionale Ersatzseiten im App Router live ≥ 14 Tage ohne kritische Fehler.
2. Organischer Traffic (GSC / Analytics) auf Legacy-Routen < definierter Schwellwert (z.B. < 5 Sitzungen / Woche).
3. Interne Links zeigen nur noch auf neue Routen (Link-Audit abgeschlossen).
4. Redirect-Strategie (301) oder Canonical-Strategie dokumentiert & umgesetzt.
5. Keine offenen SEO-Risiken (Indexierung / Ranking / Rich Snippets stabil für neue Seiten).

### 11.3 Review-Zyklus
- Alle 30 Tage: Ausführung des Legacy Audits (`npm run ci:legacy-audit`) & Protokollierung im zugehörigen PR / Issue.
- Entscheidung: weiter beobachten vs. Migrations-Removal starten.

### 11.4 Removal-Prozess
1. Vollständiges Entfernen der Legacy-Dateien.
2. Aktualisierung des JSON-LD Guards: Entfernen der Ignore-Regel für `src/legacy/`.
3. Deployment + Monitoring (Crawl-Fehler, 404, Ranking-Drift).
4. Abschlussnotiz im Changelog / README.

### 11.5 Verbotene Änderungen im Legacy-Bereich
- Keine neue Business-Logik.
- Keine Erweiterung von Tracking / Analytics.
- Keine zusätzlichen Inline Skripte.

## 12. (Optional) CSP Report Endpoint
Ein zukünftiger Endpunkt `/api/csp-report` kann CSP Verletzungen entgegennehmen:
```
POST /api/csp-report
{
  "csp-report": {
    "document-uri": "...",
    "blocked-uri": "...",
    "violated-directive": "..."
  }
}
```
Umsetzungshinweise:
- Minimal validieren & loggen (kein PII speichern).
- Rate Limiting / Sampling bei hohem Volumen.
- Korrelation mit Release-Version für Regressionserkennung.

## 13. CSS / Style Quality & Sicherheitsaspekte
Zur Reduktion von Style-Regressions- und Kompatibilitätsrisiken wird ein CSS Lint Schritt (Stylelint) innerhalb `ci:verify` ausgeführt.
Schwerpunkte:
1. Erkennen fehlerhafter / zukünftiger inkompatibler At-Rules (ausgenommen Tailwind interne Direktiven via Ignore-Liste).
2. Konsistente Nutzung von Custom Properties (Tokens in `:root`).
3. Optionale spätere Policy: Verbieten von `!important` außerhalb definierter Ausnahmen; Audit auf potenziell gefährliche Filter-/Blend-Modi.

Nicht-Ziele (derzeit): Automatischer kritischer CSS Purge (erfolgt über Tailwind) oder Security Scanning von externen Font- / Icon-Quellen (separat).

---
Letzte Aktualisierung: 2025-09-15 (Legacy Strategie & CSP Report Abschnitt ergänzt)
