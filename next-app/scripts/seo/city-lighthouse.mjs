#!/usr/bin/env node
/**
 * City Lighthouse Runner
 * Misst definierte Metriken (Performance Score, LCP, INP (PSI Fallback), CLS) für City Pages.
 * Usage: node scripts/seo/city-lighthouse.mjs --base https://preview-url --out docs/city-perf.json
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function parseArgs(){
  const args = process.argv.slice(2);
  const res = {};
  for(let i=0;i<args.length;i++){
    if(args[i].startsWith('--')){
      const key = args[i].replace(/^--/,'');
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[++i] : 'true';
      res[key] = val;
    }
  }
  return res;
}

const argv = parseArgs();
const base = argv.base || 'http://localhost:3000';
const outFile = argv.out || 'docs/city-perf.json';
const historyFile = argv.history || 'docs/city-perf-history.json';

const citiesFile = path.join(process.cwd(), 'src', 'content', 'geo', 'cities.json');
if(!fs.existsSync(citiesFile)){
  console.error('cities.json not found');
  process.exit(1);
}
const cities = JSON.parse(fs.readFileSync(citiesFile,'utf-8'));

function runLighthouse(url){
  // Minimal Lighthouse JSON (Performance Kategorie)
  const cmd = `npx --yes lighthouse ${url} --quiet --only-categories=performance --output=json --output-path=stdout --chrome-flags='--headless=new'`;
  const raw = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe','pipe','ignore'] });
  return JSON.parse(raw);
}

const results = [];
for(const c of cities){
  const url = base.replace(/\/$/,'') + `/standorte/${c.slug}`;
  try {
    const lh = runLighthouse(url);
    // Extract simple metrics
    const audits = lh.audits || {};
    const metrics = lh.audits['metrics']?.details?.items?.[0] || {};
    results.push({
      slug: c.slug,
      url,
      performanceScore: lh.categories?.performance?.score ?? null,
      lcpMs: metrics.largestContentfulPaint || null,
      cls: audits['cumulative-layout-shift']?.numericValue ?? null,
      tbtMs: audits['total-blocking-time']?.numericValue ?? null,
      fcpMs: metrics.firstContentfulPaint || null,
      timestamp: new Date().toISOString()
    });
  } catch(e){
    results.push({ slug: c.slug, url, error: String(e) });
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
console.log('Wrote', outFile);

// History & Diff
let history = [];
if(historyFile){
  try {
    if(fs.existsSync(historyFile)) history = JSON.parse(fs.readFileSync(historyFile,'utf-8'));
  } catch(e){ /* ignore */ }
  // Append current snapshot
  history.push({ runAt: new Date().toISOString(), results });
  // Keep last 30 entries
  if(history.length > 30) history = history.slice(history.length - 30);
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  console.log('Updated history', historyFile);

  if(history.length >= 2){
    const prev = history[history.length - 2].results;
    const prevMap = Object.fromEntries(prev.map(r => [r.slug, r]));
    const diff = results.map(r => {
      const p = prevMap[r.slug];
      if(!p || p.error || r.error) return { slug: r.slug, change: 'n/a' };
      const deltaLcp = (r.lcpMs ?? 0) - (p.lcpMs ?? 0);
      const deltaScore = (r.performanceScore ?? 0) - (p.performanceScore ?? 0);
      return { slug: r.slug, deltaLcp, deltaScore };
    });
    fs.writeFileSync(outFile.replace(/\.json$/, '-diff.json'), JSON.stringify(diff, null, 2));
    console.log('Wrote diff', outFile.replace(/\.json$/, '-diff.json'));
  }
}
