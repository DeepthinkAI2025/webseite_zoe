# Deep Content – Delta Summary

Datum: 2025-09-13

## Coverage
- Vor Batch3: 75.61%
- Nach Batch3: 100%

## Similarity Delta (Threshold 0.78, Weighted Terms aktiv)
| Pair | New Similarity | Prev Similarity | Δ (pp) | Severity Neu |
|------|----------------|-----------------|--------|--------------|
| augsburg ↔ ingolstadt | 78.4% | 92.6% | -14.2 | OK |

Alle früheren HIGH / MED Paare eliminiert (unter Threshold gefallen oder unterhalb 80% Bereich). Keine HIGH / MED Paare mehr.

## Wirkung
- Term Diversität signifikant erhöht, Weighted Ranking zeigt nur noch ein OK Pair nahe Schwelle.
- Risiko von Template-Duplikaten mitigiert; verbleibendes Pair im akzeptablen Bereich.

## Gate
- Workflow `deep-content-coverage.yml` aktiviert (Fail <90%).

## Empfehlungen
1. In 2 Wochen erneut Lauf (Monitoring Stabilität nach redaktionellen Änderungen).
2. Optional: Weitere qualitative Felder (feedInTariffNote) vorbereiten ohne sofort zu gewichten.
3. Weighted Terms jährlich prüfen (Relevanz & Overfitting vermeiden).

-- Ende --
