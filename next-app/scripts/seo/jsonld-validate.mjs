#!/usr/bin/env node
/**
 * JSON-LD Validate Script (Lightweight)
 * Scannt alle .tsx unter src/app nach <script type="application/ld+json"> Blocks,
 * extrahiert JSON, parst sie und prüft Basis-Pflichtfelder je Typ.
 * Optional: --fail-on-warn um Warnings als Fehler zu behandeln.
 */
import fs from 'fs';
import path from 'path';

const root = path.join(process.cwd(), 'src', 'app');
const args = process.argv.slice(2);
const failOnWarn = args.includes('--fail-on-warn');

function walk(dir, acc=[]) {
  for(const e of fs.readdirSync(dir)) {
    const full = path.join(dir, e);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) walk(full, acc); else if(/\.tsx$/.test(e)) acc.push(full);
  }
  return acc;
}

const files = walk(root);
let warnings = 0;
let errors = 0;
const docs = [];

for(const file of files){
  const content = fs.readFileSync(file,'utf-8');
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  let idx = 0;
  while((m = regex.exec(content))){
    idx++;
    const raw = m[1].trim();
    try {
      const json = JSON.parse(raw);
      docs.push({ file, idx, json });
    } catch(e){
      console.error(`ERROR: ${file} block#${idx} JSON parse failed: ${e.message}`);
      errors++;
    }
  }
}

function check(doc){
  const { file, idx, json } = doc;
  if(!json['@type'] && !Array.isArray(json['@graph'])) {
    console.warn(`WARN: ${file} block#${idx} fehlt @type/@graph`); warnings++; return;
  }
  const types = Array.isArray(json['@graph']) ? json['@graph'].map(n=>n['@type']) : [json['@type']];
  for(const t of types){
    if(!t) { console.warn(`WARN: ${file} block#${idx} Knoten ohne @type`); warnings++; continue; }
    switch(t){
      case 'Organization':
        ['name','url'].forEach(f => { if(!json[f]) { console.warn(`WARN: ${file} Organization fehlt ${f}`); warnings++; }});
        break;
      case 'LocalBusiness':
        ['name','url','address'].forEach(f => { if(!json[f]) { console.warn(`WARN: ${file} LocalBusiness fehlt ${f}`); warnings++; }});
        break;
      case 'FAQPage':
        if(!json.mainEntity) { console.warn(`WARN: ${file} FAQPage ohne mainEntity`); warnings++; }
        break;
      case 'OfferCatalog':
        if(!json.itemListElement) { console.warn(`WARN: ${file} OfferCatalog ohne itemListElement`); warnings++; }
        break;
      default:
        // generic minimal
        break;
    }
  }
}

docs.forEach(check);

console.log(`JSON-LD Blocks gefunden: ${docs.length}`);
console.log(`Warnings: ${warnings}`);
console.log(`Errors: ${errors}`);

if(errors > 0 || (failOnWarn && warnings > 0)) {
  process.exit(1);
}
