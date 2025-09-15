#!/usr/bin/env node
// Prüft welche Seiten OfferCatalog Schema enthalten (rudimentär via Fetch & JSON-LD Parse)
import fs from 'fs';
import fetch from 'node-fetch';

const base = process.env.BASE_URL || 'http://localhost:3000';
const paths = ['/', '/pricing', '/technology', '/faq', '/contact'];

async function extractOfferCatalog(url){
  const res = await fetch(url);
  const html = await res.text();
  const matches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  let found = false;
  for(const m of matches){
    try {
      const json = JSON.parse(m[1]);
      const scan = (obj)=>{
        if(Array.isArray(obj)) return obj.forEach(scan);
        if(obj && typeof obj === 'object'){
          if(obj['@type'] === 'OfferCatalog') found = true;
          Object.values(obj).forEach(scan);
        }
      };
      scan(json);
    } catch { /* ignore */ }
  }
  return found;
}

(async () => {
  const results = [];
  for(const p of paths){
    const url = base + p;
    try {
      const has = await extractOfferCatalog(url);
      results.push({ path: p, offerCatalog: has });
    } catch (e) {
      results.push({ path: p, error: e.message });
    }
  }
  const coverage = results.filter(r=>r.offerCatalog).length;
  const summary = { generatedAt: new Date().toISOString(), base, coverage, total: results.length, results };
  fs.writeFileSync('offer-catalog-audit.json', JSON.stringify(summary,null,2));
  console.log('Wrote offer-catalog-audit.json');
})();
