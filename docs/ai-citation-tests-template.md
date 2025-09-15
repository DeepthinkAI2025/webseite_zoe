# AI Citation Tests – Vorlage

Ziel: Dokumentierte Nachweise, ob Kernseiten (Home, Pricing, Technology, FAQ, Why Us) in AI Overviews / generativen Antworten (Google AI Overview, Perplexity, DuckDuckGo AI, Bing Copilot) erscheinen.

## Vorgehensweise je Testfall
1. Query definieren (realistische Nutzerintention; Short & Long Tail mix).
2. Zielseite bestimmen (Welche URL unserer Domain sollte für diese Query ideal erscheinen?).
3. Tool / Plattform öffnen (z.B. Google → AI Overview, Perplexity, Bing Copilot).
4. Query ausführen – Warte auf finale Antwort / Quellenliste.
5. Prüfen ob Domain erwähnt / verlinkt.
6. Evidenz festhalten (Screenshot-Dateiname + Hash oder archivierter Link).
7. Bewertung eintragen (FOUND / NOT_FOUND / PARTIAL).
8. Optional: Notizen (z.B. konkurrierende Domains, Antwortqualität, fehlender Intent-Aspekt).

## Bewertungsstatus
- FOUND: Domain klar als Quelle / Zitat.
- PARTIAL: Kontext erwähnt aber ohne direkten Link ODER nur in erweiterten Aufklapp-Elementen.
- NOT_FOUND: Keine Erwähnung.
- IRRELEVANT: Query nicht sinnvoll für unsere Inhalte (sollte dann nicht in finalem Set bleiben).

## Metriken / KPIs
- Coverage (%) = FOUND / (FOUND + NOT_FOUND + PARTIAL).
- Brand Penetration = Anteil Queries mit Domain + Brandnamen-Ko-Erwähnung.
- Intent Gaps = Queries mit NOT_FOUND aber passender Zielseite.

## Struktur (JSON Datenspeicherung)
Datei: `docs/ai-citation-tests.json` (siehe Schema `docs/ai-citation-tests.schema.json`)

```jsonc
[
  {
    "id": "q1",
    "query": "photovoltaik amortisation 10 kwp 2025",
    "intent": "Kosten & Wirtschaftlichkeit",
    "targetUrl": "https://www.zoe-solar.de/pricing",
    "platform": "google-ai-overview",
    "executedAt": "2025-09-13T10:15:00Z",
    "status": "FOUND", // FOUND | PARTIAL | NOT_FOUND | IRRELEVANT
    "evidence": {
      "screenshot": "screenshots/q1-google-ai.png",
      "hash": "sha256:...",
      "archiveUrl": "https://archive.example/q1"
    },
    "notes": "Preisrange wurde korrekt zusammengefasst, Wettbewerber X ebenfalls Quelle."      
  }
]
```

## Markdown Tabelle (zum schnellen manuellen Ausfüllen)
| ID | Query | Intent | Platform | Target URL | Status | Evidence | Notes |
|----|-------|--------|----------|------------|--------|----------|-------|
| q1 |  |  |  |  |  |  |  |
| q2 |  |  |  |  |  |  |  |
| q3 |  |  |  |  |  |  |  |
| q4 |  |  |  |  |  |  |  |
| q5 |  |  |  |  |  |  |  |
| q6 |  |  |  |  |  |  |  |
| q7 |  |  |  |  |  |  |  |
| q8 |  |  |  |  |  |  |  |
| q9 |  |  |  |  |  |  |  |
| q10 |  |  |  |  |  |  |  |

## Evidence Ablage
- Screenshots: `docs/ai-citations/screenshots/`
- Hash Berechnung (optional): `shasum -a 256 screenshot.png`
- Archivierung: Externe Dienste (perma.cc, archive.today) wenn zulässig.

## Erweiterung (Automatisierung – Backlog)
- Headless Capture (Playwright) für SERP / Antwort HTML.
- Diffing (Query erneut nach n Tagen → Statusänderungen).
- Exposure Index (Score) = Gewicht( Intent ) * (FOUND=1, PARTIAL=0.5, NOT_FOUND=0).

---
Letzte Aktualisierung: 2025-09-13
