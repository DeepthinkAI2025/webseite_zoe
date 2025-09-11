#!/usr/bin/env node
/**
 * Playwright + axe-core Accessibility Audit (Fallback zu Lighthouse)
 * Lädt definierte Seiten, injiziert axe-core von CDN und sammelt Violations.
 */
import fs from 'fs';
import http from 'http';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve('dist');
const EMBED = process.env.AXE_EMBED_SERVER === '1';
let server; let dynamicPort = 4173;
async function startServer(){
  return new Promise((resolve,reject)=>{
    server = http.createServer((req,res)=>{
      const reqPath = req.url.split('?')[0];
      let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);
      if(!filePath.startsWith(DIST_DIR)) { res.writeHead(403); return res.end(); }
      fs.stat(filePath,(err,stat)=>{
        if(err || stat.isDirectory()) filePath = path.join(DIST_DIR,'index.html');
        fs.readFile(filePath,(e,data)=>{ if(e){res.writeHead(500); return res.end('ERR');} res.writeHead(200); res.end(data); });
      });
    }).listen(0,()=>{ dynamicPort = server.address().port; resolve(); }).on('error',reject);
  });
}
if(EMBED){
  if(!fs.existsSync(DIST_DIR)) { console.error('[axe-audit] dist/ fehlt – build ausführen'); process.exit(2);} await startServer();
}
const BASE = process.env.AXE_BASE || `http://localhost:${dynamicPort}`;
// Routes should reflect real app paths (German slugs)
const PAGES = ['/', '/warum-zoe', '/technologie', '/kontakt'];

const results = [];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
async function runPass(bucket){
 for (const p of PAGES) {
  const page = await context.newPage();
  const url = BASE + p;
  try {
    // Immer zuerst Root laden (SPA Fallback), dann via History API routen – verhindert 404 bei fehlendem static fallback
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 65000 });
    if (p !== '/') {
      await page.evaluate((path) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
      }, p);
    }
    // Warten auf React-Hydration & mögliche Helmet Updates
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(()=>{});
  // Zusätzlich aktiv warten bis <main> und eine erste <h1> existieren (Client gerendert)
  await page.waitForFunction(() => !!document.querySelector('main') && !!document.querySelector('h1'), { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(500); // kurzer Puffer
    // axe-core injizieren (nach client navigation)
    await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.9.1/axe.min.js' });
    const data = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run({
        resultTypes: ['violations'],
        reporter: 'v2'
      });
    });
    bucket.push({
      page: p,
      url,
      violations: data.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(n => ({
          target: n.target,
          html: n.html,
          failureSummary: n.failureSummary
        }))
      }))
    });
  } catch (e) {
    bucket.push({ page: p, url, error: e.message });
  } finally {
    await page.close();
  }
 }
}

await runPass(results);
await browser.close();
if(server) server.close();

const summary = {
  generated: new Date().toISOString(),
  base: BASE,
  totals: {
    pages: results.length,
    violations: results.reduce((a,r)=> a + (r.violations? r.violations.reduce((x,v)=>x+v.nodes.length,0):0), 0)
  },
  results
};

// Kompatibilität für Stability-Gate: top-level violationsCount
summary.violationsCount = summary.totals.violations;

if(!fs.existsSync('docs')) fs.mkdirSync('docs');
const OUT = process.env.AXE_OUT || 'docs/axe-a11y-report.json';
fs.writeFileSync(OUT, JSON.stringify(summary,null,2));
console.log(`axe-core Accessibility Report -> ${OUT}`);
console.log(JSON.stringify(summary, null, 2));
