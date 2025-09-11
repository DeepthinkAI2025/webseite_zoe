#!/usr/bin/env bash
set -euo pipefail

# Allow override via environment variables (defaults shown)
THRESHOLD_LCP=${THRESHOLD_LCP:-2500}
THRESHOLD_CLS=${THRESHOLD_CLS:-0.10}
THRESHOLD_INP=${THRESHOLD_INP:-200}

echo "[gate] Erzeuge Performance Report"
node scripts/lighthouse-perf-report.js || { echo "[gate] Report Generierung fehlgeschlagen"; exit 1; }

FILE="docs/lighthouse-perf-metrics.json"
if [ ! -f "$FILE" ]; then
	echo "[gate] Report fehlt"; exit 1;
fi

FAIL=0
echo "[gate] Prüfe Thresholds LCP<=${THRESHOLD_LCP}ms CLS<=${THRESHOLD_CLS} INP<=${THRESHOLD_INP}ms"

PAGES=$(jq -r '.results[].page' "$FILE")
for P in $PAGES; do
	LCP=$(jq -r --arg p "$P" '.results[] | select(.page==$p) | .lcp' "$FILE")
	CLS=$(jq -r --arg p "$P" '.results[] | select(.page==$p) | .cls' "$FILE")
	INP=$(jq -r --arg p "$P" '.results[] | select(.page==$p) | .inp' "$FILE")
	ERR=$(jq -r --arg p "$P" '.results[] | select(.page==$p) | .error // empty' "$FILE")
	if [ -n "$ERR" ]; then
		echo "[gate] $P ERROR: $ERR"; FAIL=1; continue;
	fi
	PASS_LCP=$(awk -v v="$LCP" -v t="$THRESHOLD_LCP" 'BEGIN{print (v<=t)?"ok":"fail"}')
	PASS_CLS=$(awk -v v="$CLS" -v t="$THRESHOLD_CLS" 'BEGIN{print (v<=t)?"ok":"fail"}')
	PASS_INP=$(awk -v v="$INP" -v t="$THRESHOLD_INP" 'BEGIN{print (v<=t)?"ok":"fail"}')
	echo "[gate] $P -> LCP ${LCP}ms (${PASS_LCP}), CLS ${CLS} (${PASS_CLS}), INP ${INP}ms (${PASS_INP})"
	if [ "$PASS_LCP" != "ok" ] || [ "$PASS_CLS" != "ok" ] || [ "$PASS_INP" != "ok" ]; then
		FAIL=1
	fi
done

if [ $FAIL -eq 1 ]; then
	echo "[gate] ❌ Performance Gate nicht bestanden"; exit 2; fi
echo "[gate] ✅ Performance Gate bestanden"
