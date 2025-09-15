#!/usr/bin/env node
/**
 * rum-outliers.mjs
 * Extrahiert Top-N langsamste LCP & INP Events aus rum-metrics.jsonl.
 * Ausgabe:
 *  - docs/rum-outliers.json
 *  - docs/rum-outliers.md (Markdown Tabelle) optional (immer erzeugt)
 * Env:
 *  - OUTLIER_LIMIT (Default 5)
 */
import fs from 'fs';
import path from 'path';

const docsDir = path.resolve('docs');
const src = path.join(docsDir,'rum-metrics.jsonl');
let lines=[]; try { lines = fs.readFileSync(src,'utf8').trim().split(/\n+/); } catch { lines=[]; }
const lcp=[]; const inp=[];
for(const ln of lines){
  try { const o = JSON.parse(ln); if(o.metric==='LCP') lcp.push(o); if(o.metric==='INP') inp.push(o); } catch {}
}
const LIMIT = Number(process.env.OUTLIER_LIMIT || 5);
function top(arr){
  return arr.sort((a,b)=> b.value - a.value).slice(0,LIMIT).map(e=>({value:e.value, url:e.url||e.path||e.location||null, ts:e.t||e.ts||null }));
}
const out = {
  generatedAt: new Date().toISOString(),
  limit: LIMIT,
  lcp: top(lcp),
  inp: top(inp)
};
fs.writeFileSync(path.join(docsDir,'rum-outliers.json'), JSON.stringify(out,null,2),'utf8');
// Markdown
function fmtMs(v){ return v!=null? (v.toFixed? v.toFixed(0):v)+'ms':'-'; }
const md=[];
md.push('### RUM Outliers');
md.push('');
function table(label, rows){
  md.push(`#### ${label}`);
  md.push('| Wert | URL | Timestamp |');
  md.push('|------|-----|-----------|');
  rows.forEach(r=> md.push(`| ${fmtMs(r.value)} | ${r.url||'-'} | ${r.ts||'-'} |`));
  md.push('');
}
table('LCP', out.lcp);
table('INP', out.inp);
fs.writeFileSync(path.join(docsDir,'rum-outliers.md'), md.join('\n'),'utf8');
console.log('[rum-outliers] geschrieben:', out.lcp.length, 'LCP /', out.inp.length, 'INP Events');
