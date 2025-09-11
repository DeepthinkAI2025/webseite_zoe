#!/usr/bin/env node
/**
 * lighthouse-perf-report.js
 * Führt Lighthouse Performance Audits für definierte Seiten durch und extrahiert Kern-Metriken (LCP, CLS, INP, TTFB, FCP).
 * Erwartet, dass ein lokaler Preview-Server unter http://localhost:4173 läuft (z.B. via `npx serve dist -l 4173`).
 * Ausgabe: docs/lighthouse-perf-metrics.json
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { execSync } from 'child_process';
import puppeteer from 'puppeteer';

const PAGES = [
  '/',
  '/whyus',
  '/technology',
  '/contact'
];

const DIST_DIR = path.resolve('dist');
const PORT = 4173;
const BASE = process.env.LH_BASE || `http://localhost:${PORT}`;
let serverStarted = false; let server;
function fileExists(p){ try { return fs.statSync(p).isFile(); } catch { return false; } }
async function startServerIfNeeded(){
  try { await fetch(BASE, { method:'HEAD' }); return; } catch {}
  if(!fs.existsSync(DIST_DIR)) { console.error('[lighthouse-perf] dist/ fehlt – zuerst build ausführen'); process.exit(2); }
  server = http.createServer((req,res)=>{
    const reqPath = decodeURIComponent(req.url.split('?')[0]);
    let fp = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);
    if(!fp.startsWith(DIST_DIR)) { res.writeHead(403); return res.end(); }
    if(!fileExists(fp) || fs.statSync(fp).isDirectory()) fp = path.join(DIST_DIR,'index.html');
    fs.readFile(fp,(e,data)=>{ if(e){res.writeHead(500); return res.end('ERR');} res.writeHead(200); res.end(data); });
  }).listen(PORT,()=>{ serverStarted = true; console.log('[lighthouse-perf] server', BASE); });
  const start = Date.now();
  while(Date.now()-start < 8000){ try { await fetch(BASE,{method:'HEAD'}); break;} catch { await new Promise(r=>setTimeout(r,250)); } }
}

await startServerIfNeeded();
const results = [];
const chromePath = puppeteer.executablePath();
const MODE = process.env.LH_MODE || 'desktop'; // 'desktop' oder 'mobile'
const baseFlags = `--chrome-path='${chromePath}' --chrome-flags='--headless=new --no-sandbox --disable-gpu'`;
const preset = MODE === 'mobile' ? '' : '--preset=desktop';
const mobileFlags = MODE === 'mobile' ? '--form-factor=mobile --throttling-method=provided' : '';
function runLighthouse(url){
  return execSync(`npx --yes lighthouse ${url} --only-categories=performance --output=json --quiet ${preset} ${mobileFlags} ${baseFlags}`, { stdio: 'pipe', maxBuffer: 20*1024*1024 });
}
for(const p of PAGES){
  const url = BASE + p;
  let metrics = { page: p };
  let attempts = 0; let success = false; let lastErr;
  while(attempts < 2 && !success){
    attempts++;
    try {
      const raw = runLighthouse(url);
      const json = JSON.parse(raw.toString());
      const audits = json.audits || {};
      metrics = {
        page: p,
        mode: MODE,
        lcp: audits['largest-contentful-paint']?.numericValue ?? null,
        cls: audits['cumulative-layout-shift']?.numericValue ?? null,
        inp: audits['interaction-to-next-paint']?.numericValue ?? audits['interactive']?.numericValue ?? null,
        fcp: audits['first-contentful-paint']?.numericValue ?? null,
        ttfb: audits['server-response-time']?.numericValue ?? null,
        performanceScore: (json.categories?.performance?.score ?? 0) * 100,
        attempts
      };
      success = true;
    } catch(e){
      lastErr = e;
      if(attempts < 2) {
        console.warn(`[lighthouse-perf] Retry (${attempts}) ${url}: ${e.message.split('\n')[0]}`);
      }
    }
  }
  if(!success){ metrics.error = lastErr?.message?.split('\n')[0] || 'unknown'; metrics.attempts = attempts; }
  results.push(metrics);
}

function fmtMs(v){ return v==null? null : +v.toFixed(0); }
function fmtCls(v){ return v==null? null : +v.toFixed(3); }

const summarized = results.map(r => ({
  ...r,
  lcp: fmtMs(r.lcp),
  fcp: fmtMs(r.fcp),
  inp: fmtMs(r.inp),
  ttfb: fmtMs(r.ttfb),
  cls: fmtCls(r.cls)
}));

const thresholds = { lcp: 2500, cls: 0.1, inp: 200 }; // Zielwerte Definition of Done
const compliance = summarized.filter(r => !r.error).map(r => ({
  page: r.page,
  lcp_ok: r.lcp != null ? r.lcp <= thresholds.lcp : false,
  cls_ok: r.cls != null ? r.cls <= thresholds.cls : false,
  inp_ok: r.inp != null ? r.inp <= thresholds.inp : false
}));

const report = {
  generated: new Date().toISOString(),
  base: BASE,
  thresholds,
  results: summarized,
  compliance,
  allPassed: compliance.length && compliance.every(c => c.lcp_ok && c.cls_ok && c.inp_ok)
};

if(!fs.existsSync('docs')) fs.mkdirSync('docs');
fs.writeFileSync('docs/lighthouse-perf-metrics.json', JSON.stringify(report,null,2));
console.log('Lighthouse Performance Metrics written to docs/lighthouse-perf-metrics.json');
console.log(JSON.stringify({ summary: { allPassed: report.allPassed } }, null, 2));
if(serverStarted){ server.close(); }
