#!/usr/bin/env node
/**
 * GAIO Exposure Index
 * Berechnet gewichteten Exposure Score basierend auf importance Feldern in gaio-snapshot.json
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const docsDir = path.join(root,'docs');
const file = path.join(docsDir,'gaio-snapshot.json');

let snapshot=null;
try { snapshot = JSON.parse(fs.readFileSync(file,'utf8')); } catch {}
if(!snapshot){
  console.error('Kein gaio-snapshot.json gefunden');
  process.exit(0);
}

const queries = snapshot.queries || [];

// Optional Override Map aus Env
let overrideMap = {};
if(process.env.IMPORTANCE_WEIGHTS){
  try { overrideMap = JSON.parse(process.env.IMPORTANCE_WEIGHTS); } catch { console.warn('[gaio-exposure-index] IMPORTANCE_WEIGHTS JSON parse Fehler'); }
}

let totalWeight=0;
let weightedBrand=0;
const appliedWeights=[];
for(const q of queries){
  // Key Bildung: bevorzugt query String, fallback id
  const key = q.query || q.id || '';
  let base = typeof q.importance==='number' ? q.importance : 1;
  if(key && Object.prototype.hasOwnProperty.call(overrideMap,key)){
    const ov = overrideMap[key];
    if(typeof ov === 'number' && ov > 0) base = ov;
  }
  totalWeight += base;
  if(q.brandMention) weightedBrand += base;
  appliedWeights.push({key, weight: base, brandMention: !!q.brandMention});
}
const exposure = totalWeight? weightedBrand/totalWeight : 0;

const out={
  generatedAt: new Date().toISOString(),
  totalQueries: queries.length,
  totalWeight,
  weightedBrand,
  exposure,
  weightOverridesUsed: Object.keys(overrideMap).length>0,
  appliedWeights
};
fs.writeFileSync(path.join(docsDir,'gaio-exposure.json'), JSON.stringify(out,null,2),'utf8');
console.log(JSON.stringify(out));
