#!/usr/bin/env node
/**
 * lighthouse-perf-node.js
 * Führt Performance Audits über Lighthouse Node API aus (ohne CLI execSync) und nutzt denselben Chromium wie Puppeteer.
 * SPA Handling: Erst Root laden, dann History API Navigation.
 * Output: docs/lighthouse-perf-metrics.json (gleiches Format wie CLI Variante).
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';

const DIST_DIR = path.resolve('dist');
const PORT = 4173;
const BASE = process.env.LH_BASE || `http://localhost:${PORT}`;
const PAGES = ['/', '/whyus', '/technology', '/contact'];

function fileExists(p){ try { return fs.statSync(p).isFile(); } catch { return false; } }

let serverStarted=false; let server;
async function startServer(){
  try { await fetch(BASE,{method:'HEAD'}); return; } catch {}
  if(!fs.existsSync(DIST_DIR)){ console.error('[lh-node] dist fehlt – build zuerst'); process.exit(2); }
  server = http.createServer((req,res)=>{
    const reqPath = decodeURIComponent(req.url.split('?')[0]);
    let fp = path.join(DIST_DIR, reqPath === '/' ? 'index.html': reqPath);
    if(!fp.startsWith(DIST_DIR)){ res.writeHead(403); return res.end(); }
    if(!fileExists(fp) || fs.statSync(fp).isDirectory()) fp = path.join(DIST_DIR,'index.html');
    fs.readFile(fp,(e,d)=>{ if(e){res.writeHead(500); return res.end('ERR');} res.writeHead(200); res.end(d); });
  }).listen(PORT,()=>{ serverStarted=true; console.log('[lh-node] server', BASE); });
  const start = Date.now();
  while(Date.now()-start < 8000){ try { await fetch(BASE,{method:'HEAD'}); break; } catch { await new Promise(r=>setTimeout(r,250)); } }
}

function fmtMs(v){ return v==null? null : +v.toFixed(0); }
function fmtCls(v){ return v==null? null : +v.toFixed(3); }

async function auditPage(browser, route){
  // Lighthouse braucht eine URL – wir auditieren Root (damit keine 404) und navigieren ggf. danach clientseitig.
  const page = await browser.newPage();
  await page.goto(BASE+'/', { waitUntil:'networkidle0', timeout:60000 });
  if(route !== '/'){
    await page.evaluate(r=>{ window.history.pushState({},'',r); window.dispatchEvent(new Event('popstate')); }, route);
    await page.waitForFunction(()=>!!document.querySelector('main'), { timeout:12000 }).catch(()=>{});
  }
  // Lighthouse über bestehenden Browser (Chrome DevTools Protocol) laufen lassen
  const endpoint = browser.wsEndpoint();
  const lhr = await lighthouse(page.url(), {
    port: new URL(endpoint).port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance'],
  throttlingMethod: 'provided',
    disableFullPageScreenshot: true,
    formFactor: 'desktop',
    screenEmulation: { disabled: true }
  });
  const audits = lhr.lhr.audits;
  return {
    page: route,
    lcp: audits['largest-contentful-paint']?.numericValue ?? null,
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    inp: audits['interaction-to-next-paint']?.numericValue ?? audits['interactive']?.numericValue ?? null,
    fcp: audits['first-contentful-paint']?.numericValue ?? null,
    ttfb: audits['server-response-time']?.numericValue ?? null,
    performanceScore: (lhr.lhr.categories?.performance?.score ?? 0) * 100
  };
}

(async()=>{
  await startServer();
  const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
  const results = [];
  for(const r of PAGES){
    console.log('[lh-node] auditing', r);
    try { results.push(await auditPage(browser, r)); } catch(e){ results.push({ page:r, error:e.message.split('\n')[0] }); }
  }
  await browser.close();
  const summarized = results.map(r=>({
    ...r,
    lcp: fmtMs(r.lcp), fcp: fmtMs(r.fcp), inp: fmtMs(r.inp), ttfb: fmtMs(r.ttfb), cls: fmtCls(r.cls)
  }));
  const thresholds = { lcp:2500, cls:0.1, inp:200 };
  const compliance = summarized.filter(r=>!r.error).map(r=>({
    page:r.page,
    lcp_ok: r.lcp!=null ? r.lcp <= thresholds.lcp : false,
    cls_ok: r.cls!=null ? r.cls <= thresholds.cls : false,
    inp_ok: r.inp!=null ? r.inp <= thresholds.inp : false
  }));
  const report = { generated:new Date().toISOString(), base:BASE, thresholds, results:summarized, compliance, allPassed: compliance.length && compliance.every(c=>c.lcp_ok && c.cls_ok && c.inp_ok) };
  if(!fs.existsSync('docs')) fs.mkdirSync('docs');
  fs.writeFileSync('docs/lighthouse-perf-metrics.json', JSON.stringify(report,null,2));
  console.log('Lighthouse Node Performance Metrics -> docs/lighthouse-perf-metrics.json');
  console.log(JSON.stringify({ summary:{ allPassed: report.allPassed } }, null, 2));
  if(serverStarted) server.close();
})();
