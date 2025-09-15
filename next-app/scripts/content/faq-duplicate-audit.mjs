#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = path.join(process.cwd(), 'src', 'app', 'standorte');

function hash(str){
  return createHash('sha1').update(str.toLowerCase().replace(/\s+/g,' ')).digest('hex').slice(0,12);
}

function extractFaq(file){
  const src = fs.readFileSync(file,'utf8');
  // naive Extraktion: mainEntity FAQ JSON-LD map Konstruktionen
  const regex = /faqs?\s*=\s*\[(.*?)\];/s;
  const m = src.match(regex);
  if(!m) return [];
  try {
    const arr = eval('['+m[1]+']'); // Controlled context: Quelltext; eval mit Vorsicht
    return arr.filter(o=>o && o.q && o.a);
  } catch { return []; }
}

const stats = {};
const duplicates = {};

if(!fs.existsSync(ROOT)){
  console.error('Standorte Verzeichnis fehlt');
  process.exit(1);
}

for(const f of fs.readdirSync(ROOT)){
  const p = path.join(ROOT, f, 'page.tsx');
  if(!fs.existsSync(p)) continue;
  const faq = extractFaq(p);
  for(const item of faq){
    const h = hash(item.q + '|' + item.a);
    (stats[h] ||= { count:0, q:item.q, a:item.a, files:[] });
    stats[h].count++;
    stats[h].files.push(f);
  }
}

for(const [h, info] of Object.entries(stats)){
  if(info.count > 3){ // Schwelle
    duplicates[h] = info;
  }
}

const out = { ts: Date.now(), totalVariants: Object.keys(stats).length, duplicates };
const outFile = path.join(process.cwd(), 'docs', 'faq-duplicate-report.json');
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log('FAQ Duplicate Report geschrieben:', outFile);
