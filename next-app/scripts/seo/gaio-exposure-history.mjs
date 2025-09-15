#!/usr/bin/env node
/**
 * GAIO Exposure History
 * Liest gaio-exposure.json und hängt weightedBrand Wert an Verlauf an.
 * Erzeugt/aktualisiert: docs/exposure-history.json & docs/exposure-sparkline.md
 */
import fs from 'fs';
import path from 'path';

const docsDir = path.resolve('docs');
const exposureFile = path.join(docsDir,'gaio-exposure.json');
if(!fs.existsSync(exposureFile)){
  console.error('⚠️  exposure-history: gaio-exposure.json fehlt – erst Exposure Index Script ausführen.');
  process.exit(0);
}
let exposure; try { exposure = JSON.parse(fs.readFileSync(exposureFile,'utf8')); } catch(e){
  console.error('⚠️  exposure-history: ungültiges JSON', e.message); process.exit(0);
}
const value = typeof exposure.weightedBrand === 'number' ? exposure.weightedBrand : null;
if(value == null){
  console.error('⚠️  exposure-history: weightedBrand fehlt – überspringe');
  process.exit(0);
}
const historyPath = path.join(docsDir,'exposure-history.json');
let history = [];
try { history = JSON.parse(fs.readFileSync(historyPath,'utf8')); if(!Array.isArray(history)) history=[]; } catch{}

const date = new Date().toISOString().slice(0,10);
// Falls letzter Eintrag gleiches Datum -> überschreiben
if(history.length && history[history.length-1].date === date){
  history[history.length-1].value = value;
} else {
  history.push({date, value});
}
if(history.length>180) history = history.slice(-180);
// Normalisierung berechnen (min/max über aktuellen Verlauf)
const values = history.map(h=>h.value);
const minVal = Math.min(...values);
const maxVal = Math.max(...values);
const range = (maxVal - minVal) || 1;
history = history.map(h=> ({...h, norm: ((h.value - minVal)/range)*100 }));
fs.writeFileSync(historyPath, JSON.stringify(history,null,2),'utf8');
// Aktuellen Normalized Score separat schreiben
const currentNorm = ((value - minVal)/range)*100;
try { fs.writeFileSync(path.join(docsDir,'exposure-normalized.json'), JSON.stringify({date, value, normalized: currentNorm, min:minVal, max:maxVal},null,2)); } catch{}

// Sparkline generieren
function spark(values){
  const ticks = '▁▂▃▄▅▆▇█';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map(v=>{
    const idx = Math.round(((v - min)/range) * (ticks.length-1));
    return ticks[idx];
  }).join('');
}
const sparkline = spark(history.map(h=>h.value));
const normSparkline = spark(history.map(h=>h.norm));
fs.writeFileSync(path.join(docsDir,'exposure-sparkline.md'), `${sparkline}`,'utf8');
fs.writeFileSync(path.join(docsDir,'exposure-sparkline-normalized.md'), `${normSparkline}`,'utf8');
console.log('✅ exposure-history: Aktualisiert', history.length,'Samples.');
