#!/usr/bin/env node
/**
 * Icon Export Gate
 * Vergleicht aktuelle Barrel-Exports mit einer Baseline. Schlägt fehl wenn:
 *  - Anzahl > BASELINE_COUNT + ALLOWANCE (Default 5) ODER
 *  - Ein Icon hinzugefügt wurde ohne Kommentar im PR-Beschreibung (nur CI Check, heuristisch optional TODO)
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const BARREL = path.join(ROOT, 'src/components/icons/index.js');
const BASELINE = path.join(ROOT, 'docs/icon-export-baseline.json');
const ALLOWANCE = Number(process.env.ICON_ALLOWANCE || 5);

function parseExports(src){
  // naive: look for export { ... } and split by commas
  const match = src.match(/export\s*{([^}]*)}/s);
  if(!match) return [];
  return match[1]
    .split(/[,\n]/)
    .map(s=>s.replace(/\/\/.*$/,'').trim())
    .filter(Boolean)
    .map(name => name.split(/\s+as\s+/)[0]) // ignore aliases (Home as HomeIcon)
    .filter(n=>!/^(\/\/|$)/.test(n));
}

function main(){
  if(!fs.existsSync(BARREL)){
    console.error('[icon-gate] Barrel nicht gefunden');
    process.exit(2);
  }
  if(!fs.existsSync(BASELINE)){
    console.error('[icon-gate] Baseline fehlt – bitte erstellen: docs/icon-export-baseline.json');
    process.exit(2);
  }
  const currentSrc = fs.readFileSync(BARREL,'utf8');
  const current = parseExports(currentSrc);
  const baseline = JSON.parse(fs.readFileSync(BASELINE,'utf8'));
  const baselineSet = new Set(baseline.icons);

  const added = current.filter(i=>!baselineSet.has(i));
  const removed = baseline.icons.filter(i=>!current.includes(i));

  const limit = baseline.count + ALLOWANCE;
  const failReasons = [];
  if(current.length > limit){
    failReasons.push(`Icon Gesamtzahl ${current.length} > Limit ${limit} (Baseline ${baseline.count} + Allowance ${ALLOWANCE})`);
  }
  if(added.length){
    failReasons.push(`Neue Icons hinzugefügt: ${added.join(', ')}`);
  }

  console.log(`[icon-gate] Baseline: ${baseline.count}, Aktuell: ${current.length}, Allowance: +${ALLOWANCE}`);
  if(added.length) console.log('[icon-gate] Added:', added.join(', '));
  if(removed.length) console.log('[icon-gate] Removed:', removed.join(', '));

  if(failReasons.length){
    console.error('[icon-gate] ❌ FEHLER:\n - ' + failReasons.join('\n - '));
    process.exit(3);
  }
  console.log('[icon-gate] ✅ OK');
}

main();
