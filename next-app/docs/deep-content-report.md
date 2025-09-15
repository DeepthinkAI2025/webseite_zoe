# Deep Content Initiative – Abschlussbericht

Generiert: 2025-09-13

## Zielsetzung
Reduktion von Near-Duplicate Risiken & Erhöhung fachlicher Relevanz der City Landing Pages durch:
- Regionale Kennzahlen (Globalstrahlung, spezifischer Ertrag, Netzanschlussprozess, Verschattungs-/Dachstruktur)
- Strukturierte, semantisch differenzierende Abschnitte
- Vorbereitung für zukünftige datengetriebene Updates (externe Quellen)

## Implementierte Komponenten
| Komponente | Pfad | Zweck |
|------------|------|-------|
| Datensatz | `src/content/geo/city-data.json` | Basis-Kennzahlen & Kontext je Stadt |
| Generator Erweiterung | `scripts/generate-city-page.mjs` | Automatische Einfügung des Kennzahlenblocks bei neuen Seiten |
| Retro Augment | `scripts/augment-city-deep-content.mjs` | Nachträglicher Insert in bestehende Seiten |
| Weighted Similarity | `scripts/seo/city-content-audit.mjs` | Berücksichtigt Term-Gewichte (fachliche Diversität) |
| Term Gewichte | `src/content/geo/similarity-weighted-terms.json` | Verstärkung fachlicher Tokens |
| Dokumentation | `README.md` Abschnitt "City Deep Content" | Pflege & Erweiterung |

## Aktueller Abdeckungsstatus
- Städte mit Kennzahlenblock: 15 (Initial-Datensatz)
- Gesamte City Pages: (siehe `src/content/geo/cities.json`)
- Coverage % = 15 / Gesamt * 100 (Automatisierbar durch kleines Script)

## Similarity Wirkung (erwartet)
Vor dem vollständigen Rollout lagen viele City Seiten bei hoher Textgleichheit (Template-Kern). Durch zusätzliche differenzierende Terme sollte:
- Cosine Similarity um 3–8 Prozentpunkte pro erweiterten Pair sinken
- Overlap in Jaccard stabil bleiben (Template Core) – Weighted Score spiegelt besser echte inhaltliche Variation

## Erste Audit Ergebnisse (Weighted)
Siehe `docs/city-content-similarity.md`. HIGH-Paare stammen überwiegend aus Gruppen ohne Kennzahlenblock.

**Priorisierung Maßnahmen (Top 5 HIGH Cluster):**
1. kiel ↔ rostock ↔ luebeck ↔ oldenburg (Nord-Template) – Ergänze Offshore-Wind Bezug, Küsten-Korrosion, Dachneigung Unterschiede, Salz-/Feuchte Einfluss auf Hardware Wartung.
2. darmstadt ↔ kassel ↔ wiesbaden (Mitteldeutschland) – Regionale Netzbetreiber Taktung, Verschattungsprofil (Hügel vs. Flach), Speicherdurchdringung.
3. augsburg ↔ ingolstadt ↔ regensburg ↔ wuerzburg – Kontinentales Strahlungsprofil, Nebelhäufigkeit, typische Gewerbedachgrößen.
4. erfurt ↔ jena ↔ magdeburg – Kontinentale Winterbedingungen, Förderprogramme Land Thüringen vs. Sachsen-Anhalt Unterschiede.
5. heidelberg ↔ ulm (bereits unter HIGH Schwelle aber nahe) – Unterschied akademische Cluster / Innovationsprojekte (Pilot Anlagen / Forschung).

## Geplante Erweiterungen
| Bereich | Idee | Nutzen |
|--------|------|--------|
| Datenfelder | `feedInTariffNote`, `localIncentiveHint` | Mehr ökonomische Differenzierung |
| Automatisierung | Externer Fetch (PVGIS API Cache) | Objektivierte Strahlungsdaten |
| Audit | Coverage Script + Δ Similarity Trend | KPI zur Content-Diversität im Zeitverlauf |
| Alerting | CI Fail wenn Coverage < Ziel | Sicherung gegen Regression |
| Variation Lock | Persistente Auswahl der USP/FAQ Sets | Reproduzierbare Tests / A/B |

## KPI Vorschläge
| KPI | Formel | Ziel (initial) |
|-----|--------|----------------|
| Coverage% | (# Seiten mit Block / # Gesamt) * 100 | ≥ 60% kurzfristig, 100% mittelfristig |
| HighPairs | Anzahl severity=HIGH | 0 |
| MedPairs | Anzahl severity=MED | ≤ 3 |
| ΔAvgSim | Ø Similarity (Top 20 Pairs) vor/nach Erweiterung | -5pp in 2 Iterationen |

## Sofortige Empfehlungen
1. Datensatz sukzessive auf alle übrigen Städte ausweiten (Batch 2 = alle HIGH/ MED Pair Beteiligten).
2. Weighted Terms feinjustieren nach 2. Lauf (evtl. Reduktion wenn Oversensitivity).
3. Editor Guidelines ergänzen: Mindestens 2 lokal-qualitative Faktoren pro Stadt nachtragen.
4. Optional kleines Script `scripts/seo/city-deep-coverage.mjs` für Badge.

## Risiken / Watchouts
- Zu aggressive Gewichte -> False Positives (Monitoring nach Justierung).
- Manuelle Pflege ohne Quelle -> Inkonsistenzen (Quelle Feld planen).
- Template Drift -> Generator & Augment Divergenz (regelmäßig diffen).

## Nächste Schritte (Empfohlen Reihenfolge)
1. Batch 2 city-data Einträge (HIGH + MED Paare) hinzufügen.
2. Re-Run Audit mit `--prev` zur Delta Bewertung.
3. Coverage Script & Badge implementieren.
4. Weighted Terms Review (Anpassung falls >30% Pairs unverändert HIGH bleiben).
5. Externe Datenquellen Evaluierung (Machbarkeit, Lizenz).

---
Bericht Ende.
