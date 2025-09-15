# Migration & Legacy Hintergrund

Dieses Dokument erläutert die historische Vite / SPA Codebasis (ehem. Verzeichnis `Arbeitsverzeichnis/`) und die Gründe für die vollständige Migration zur Next.js App (`next-app/`).

## Ausgangslage (Legacy Stack)
- Vite + React Router
- Preact Compat Layer zur Bundle Größenreduktion
- Inline strukturierte Daten verstreut in Komponenten
- Manuelle Sitemap / Meta Tag Steuerung via react-helmet-async
- Getrennte Skripte für Performance / A11y außerhalb klarer CI Gates

## Limitierungen
| Bereich | Problem | Effekt |
|--------|---------|--------|
| SEO Governance | Dezentral verteilte JSON-LD Fragmente | Inkonsistenz, höheres Fehler-Risiko |
| Performance Pipeline | Manuell angestoßene Lighthouse Läufe | Keine kontinuierliche Regressionserkennung |
| Programmatic Content | Fehlende strukturierte Erzeugung (City/Förderung) | Skalierung erschwert |
| Security / CSP | Keine einheitliche Nonce / Inline Kontrolle | Erhöhtes XSS Risiko |
| Internationalisierung | Ad-hoc i18next Integration | Komplexeres Routing |

## Migrationsziele
1. Einheitliche Server gerenderte SEO / Structured Data Schicht.
2. Programmatic Content Pipeline (City Pages, Förder-MDX) automatisierbar.
3. Qualitäts-Gates (A11y, Perf, JSON-LD) als harte CI Schritte.
4. Zukunftsfähige App Router Architektur (Streaming, RSC, Edge Optionen).
5. Sicherheitsmodell mit CSP + Nonce + Guard Scripts.

## Erreichte Ergebnisse (Stand Jetzt)
- Vollständige Portierung kritischer Seiten & Komponenten in `next-app/`.
- Zentrale `JsonLd` Server Component + Guard.
- Förderprogramm Automatisierung & Merge Pipeline.
- City Generator & Deep Content Block.
- KPI / Exposure Weekly Reporting Workflow.
- Platzhalter A11y & Performance Workflows vorbereitet (Feinjustierung nächste Iteration).

## Sunset-Kriterien Legacy
| Kriterium | Status |
|----------|--------|
| Keine produktiven Routen mehr aus Legacy ausgeliefert | Erreicht |
| Alle JSON-LD Blöcke durch zentrale Komponente ersetzt | Erreicht |
| Performance & A11y Gates unter Next.js aktiv | Teilweise (A11y/Perf Feinschliff ausstehend) |
| CI Workflows ohne Referenzen auf `Arbeitsverzeichnis` | Erreicht |
| Entwickler-Dokumentation verweist ausschließlich auf Next.js | Erreicht |

## Entfernte Artefakte
- Verweisstruktur auf `Arbeitsverzeichnis/` im Root README (bereinigt)
- Alte Build-Anweisungen (Vite dev/build) – ersetzt durch Next.js Skripte

## Offene Nacharbeiten
- Erweiterte A11y Coverage (Formulare, Dialoge)
- Performance Regression Tracking (Trend / Delta Reports)
- Entfernung letzter evtl. ungenutzter Abhängigkeiten (nach 2 Release Zyklen verifizieren)

## Lessons Learned
- Frühzeitige Zentralisierung von strukturierten Daten reduziert spätere Drift.
- Programmatic Content erfordert Validierung + Merge Strategie, um Overwrites transparent zu machen.
- CI Gates zuerst minimal implementieren (Fail Fast), dann schrittweise granular erweitern.

---
Dieses Dokument wird aktualisiert, bis sämtliche offenen Nacharbeiten abgeschlossen sind und die Legacy Phase offiziell beendet wird.