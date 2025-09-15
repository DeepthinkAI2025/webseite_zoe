#!/usr/bin/env node
/**
 * Update City Performance Badge in README.
 * Sucht Platzhalter <!-- CITY_PERF_BADGE --> und ersetzt ihn mit Badge Markdown.
 * Fallback: falls Badge JSON nicht existiert, bleibt Platzhalter unverändert.
 *
 * Usage:
 *   node scripts/seo/update-city-badge.mjs --readme README.md --badge docs/city-perf-badge.json
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();
const readmeFile = argv.readme || 'README.md';
const badgeFile = argv.badge || 'docs/city-perf-badge.json';

if(!fs.existsSync(readmeFile)){
  console.error('README not found', readmeFile); process.exit(1);
}
let readme = fs.readFileSync(readmeFile,'utf-8');
if(!readme.includes('<!-- CITY_PERF_BADGE -->')){
  console.log('No placeholder found, skipping'); process.exit(0);
}
if(!fs.existsSync(badgeFile)){
  console.log('Badge file missing, skipping replacement'); process.exit(0);
}
let badge = null; try { badge = JSON.parse(fs.readFileSync(badgeFile,'utf-8')); } catch(e){ console.warn('Badge parse failed', e); }
if(!badge || !badge.markdownBadge){ console.log('Invalid badge JSON'); process.exit(0); }

const replacement = `${badge.markdownBadge} (Top ${badge.metric}: ${badge.top.slug})`;
readme = readme.replace('<!-- CITY_PERF_BADGE -->', replacement);
fs.writeFileSync(readmeFile, readme);
console.log('README Badge aktualisiert.');
