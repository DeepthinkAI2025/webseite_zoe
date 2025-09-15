#!/usr/bin/env node
/**
 * SERP Snapshot Stub
 * Reads config serp-queries.json and produces docs/serp-snapshot.json & .md
 * This is a placeholder: DOES NOT fetch live Google SERPs (would require API / scraping layer).
 */
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..','..');
const cfgFile = path.join(root, 'seo','serp-queries.json');
if(!fs.existsSync(cfgFile)){
  console.error('Missing config seo/serp-queries.json');
  process.exit(1);
}
const outDir = path.join(root,'..','docs');
const config = JSON.parse(fs.readFileSync(cfgFile,'utf-8'));
const now = new Date().toISOString();

// Placeholder ranking generator
function pseudoRank(str){
  let h=0; for(let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h)%10)+1; // 1..10
}

const results = config.queries.map(q => ({
  query: q.query,
  city: q.city,
  intent: q.intent || null,
  simulatedRank: pseudoRank(q.query + '|' + q.city),
  ts: now
}));

const jsonOut = { generated: now, count: results.length, results };
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir,'serp-snapshot.json'), JSON.stringify(jsonOut,null,2));

// Markdown
let md = `# SERP Snapshot (Stub)\n\nGeneriert: ${now}\n\n| Query | City | Intent | Simulated Rank |\n|-------|------|--------|----------------|\n`;
for(const r of results){
  md += `| ${r.query} | ${r.city} | ${r.intent || ''} | ${r.simulatedRank} |\n`;
}
fs.writeFileSync(path.join(outDir,'serp-snapshot.md'), md);
console.log('SERP stub written: docs/serp-snapshot.{json,md}');
