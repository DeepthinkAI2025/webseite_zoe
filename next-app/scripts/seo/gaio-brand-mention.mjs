#!/usr/bin/env node
/**
 * gaio-brand-mention.mjs
 * Platzhalter: Liest GAIO Query Report & simuliert Brand Mention Erkennung.
 * Später: Integration einer SERP / AI Overview API oder gespeicherter Crawl Ergebnisse.
 */
import fs from 'fs';
import path from 'path';

const REPORT = path.resolve('next-app','docs','gaio-query-report.json');
const OUT = path.resolve('next-app','docs','gaio-brand-mentions.json');
if(!fs.existsSync(REPORT)){
  console.error('[gaio-brand] Report fehlt. Bitte zuerst gaio-check ausführen.');
  process.exit(1);
}
let data;
try { data = JSON.parse(fs.readFileSync(REPORT,'utf-8')); } catch(e){
  console.error('[gaio-brand] Ungültiges JSON:', e.message); process.exit(1);
}
if(!Array.isArray(data.results)){
  console.error('[gaio-brand] results fehlt / ungültig');
  process.exit(1);
}

// Placeholder Heuristik: Markiere Queries deren Text Markenname enthält.
const BRAND = (process.env.BRAND_NAME || 'ZOE').toLowerCase();
const enriched = data.results.map(r => ({
  ...r,
  brandHeuristic: r.query.toLowerCase().includes(BRAND)
}));

const summary = {
  generatedAt: new Date().toISOString(),
  brand: BRAND,
  total: enriched.length,
  mentions: enriched.filter(r=> r.brandHeuristic).length,
  ratio: enriched.length ? (enriched.filter(r=> r.brandHeuristic).length / enriched.length) : 0,
  results: enriched
};

fs.writeFileSync(OUT, JSON.stringify(summary,null,2));
console.log('[gaio-brand] Brand Mention Heuristik Summary geschrieben:', OUT);