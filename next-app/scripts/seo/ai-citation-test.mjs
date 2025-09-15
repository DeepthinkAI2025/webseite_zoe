#!/usr/bin/env node
/**
 * AI Citation Test Harness (Baseline Skeleton)
 * Liest Query Liste (JSON) und erzeugt eine Ergebnis-Datei mit Placeholder Feldern
 * für spätere manuelle/automatisierte Auswertung (Perplexity / ChatGPT / Gemini etc.).
 *
 * Input Format (default queries file):
 * [{ "id":"q1", "query":"Was ist Photovoltaik?", "intent":"definition", "targetUrl":"/technology" }]
 *
 * Output: docs/ai-citation-results.json
 * Structure:
 * {
 *   generatedAt, queries:[{
 *     id, query, intent, targetUrl,
 *     cited:false, // manuell oder automatisiert später auf true setzen
 *     positions:{ perplexity:null, chatgpt:null, gemini:null, grok:null },
 *     notes: ""
 *   }]
 * }
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();
const queriesFile = argv.queries || 'seo/gaio-queries.json';
const outFile = argv.out || 'docs/ai-citation-results.json';

if(!fs.existsSync(queriesFile)){
  console.error('Queries file not found', queriesFile); process.exit(1);
}
let queries = [];
try { queries = JSON.parse(fs.readFileSync(queriesFile,'utf-8')); } catch(e){ console.error('Parse error', e); process.exit(1); }
if(!Array.isArray(queries)){
  console.error('Queries file must be an array'); process.exit(1);
}

const enriched = queries.map(q => ({
  id: q.id,
  query: q.query,
  intent: q.intent || null,
  targetUrl: q.page || q.targetUrl || null,
  cited: false,
  positions: { perplexity: null, chatgpt: null, gemini: null, grok: null },
  notes: ''
}));

const payload = { generatedAt: new Date().toISOString(), queries: enriched };
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
console.log('AI citation scaffold written:', outFile);
