#!/usr/bin/env node
/**
 * Lighthouse Accessibility Gate
 * Liest docs/lighthouse-a11y-scores.json (vorher via audit:a11y:lh erzeugen)
 * und bricht ab, falls minScore < Schwelle.
 * Env:
 *   LH_A11Y_MIN (default 95)
 */
import fs from 'fs';
import path from 'path';

const threshold = Number(process.env.LH_A11Y_MIN || 95);
const file = path.resolve('docs','lighthouse-a11y-scores.json');
if(!fs.existsSync(file)){
  console.error('❌ A11y Gate: Report nicht gefunden – bitte zuerst `npm run audit:a11y:lh` ausführen.');
  process.exit(1);
}
let data;
try { data = JSON.parse(fs.readFileSync(file,'utf-8')); } catch(e){
  console.error('❌ A11y Gate: Report JSON ungültig:', e.message);
  process.exit(1);
}
const { minScore, results = [] } = data;
if(minScore == null){
  console.error('❌ A11y Gate: Keine Scores im Report.');
  process.exit(1);
}
if(minScore < threshold){
  console.error(`❌ A11y Gate: minScore ${minScore} < Ziel ${threshold}`);
  results.forEach(r=> console.error(`  - ${r.page}: ${r.score ?? 'n/a'}`));
  process.exit(1);
}
console.log(`✅ A11y Gate: minScore ${minScore} ≥ Ziel ${threshold}`);
results.forEach(r=> console.log(`  - ${r.page}: ${r.score}`));