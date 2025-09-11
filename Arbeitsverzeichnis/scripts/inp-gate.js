#!/usr/bin/env node
/**
 * INP Gate
 * Liest docs/inp-lab-metrics.json und validiert, dass maxDuration (oder webVitalsINP?.value) <= Schwelle.
 * Aufruf vorher: npm run audit:inp:lab (generiert Report)
 */
import fs from 'fs';

const FILE = 'docs/inp-lab-metrics.json';
const THRESHOLD = parseInt(process.env.INP_THRESHOLD || '200', 10); // ms

if(!fs.existsSync(FILE)){
  console.error('❌ INP Gate: Report fehlt. Bitte zuerst audit:inp:lab ausführen.');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(FILE,'utf8'));
const candidate = (data.webVitalsINP && data.webVitalsINP.value) || data.maxDuration || (data.worst && data.worst.duration) || null;
if(candidate == null){
  console.error('❌ INP Gate: Kein Messwert im Report.');
  process.exit(1);
}
console.log(`INP Gate: gemessener Wert ${candidate.toFixed(1)}ms (Schwelle ${THRESHOLD}ms)`);
if(candidate > THRESHOLD){
  console.error('❌ INP Gate: Schwelle überschritten.');
  process.exit(1);
}
console.log('✅ INP Gate: bestanden.');
