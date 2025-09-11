#!/usr/bin/env node
/**
 * web-vitals-collect.js (v2)
 * Puppeteer-basierte Approximation von LCP / CLS / INP für SPA Routen.
 * Startet einen einfachen Static Server mit SPA Fallback (index.html) falls keiner läuft.
 * Strategy:
 *   1. Root laden (Hydration) -> dann History API Navigation zu Zielroute (verhindert 404).
 *   2. PerformanceObserver früh registrieren.
 *   3. Nach Navigation kurze Idle-Phase + leichte Interaktion für Event-Timings.
 * Output: docs/web-vitals-metrics.json
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import puppeteer from 'puppeteer';

const DIST_DIR = path.resolve('dist');
const PORT = 4173;
const BASE = process.env.WV_BASE || `http://localhost:${PORT}`;
const PAGES = ['/', '/whyus', '/technology', '/contact'];

function fileExists(p){ try { return fs.statSync(p).isFile(); } catch { return false; } }

let serverStarted = false; let server;
async function startServerIfNeeded(){
  try { await fetch(BASE, { method:'HEAD' }); return; } catch {}
  if(!fs.existsSync(DIST_DIR)) { console.error('[web-vitals] dist/ fehlt – zuerst build ausführen'); process.exit(2); }
  server = http.createServer((req,res)=>{
    const reqPath = decodeURIComponent(req.url.split('?')[0]);
    let fp = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);
    if(!fp.startsWith(DIST_DIR)) { res.writeHead(403); return res.end(); }
    if(!fileExists(fp) || fs.statSync(fp).isDirectory()) fp = path.join(DIST_DIR,'index.html');
    fs.readFile(fp,(e,data)=>{ if(e){res.writeHead(500); return res.end('ERR');} res.writeHead(200); res.end(data); });
  }).listen(PORT,()=>{ serverStarted = true; console.log('[web-vitals] server', BASE); });
  const start = Date.now();
  while(Date.now()-start < 8000){ try { await fetch(BASE,{method:'HEAD'}); break;} catch { await new Promise(r=>setTimeout(r,250)); } }
}

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function measure(route){
  const browser = await puppeteer.launch({ headless: 'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(()=>{
    window.__wvMetrics = { lcp: null, cls: 0, inp: null };
    try { new PerformanceObserver(list=>{ for(const e of list.getEntries()){ window.__wvMetrics.lcp = (e.renderTime||e.loadTime||e.startTime); } }).observe({type:'largest-contentful-paint', buffered:true}); } catch {}
    try { new PerformanceObserver(list=>{ for(const e of list.getEntries()){ if(!e.hadRecentInput) window.__wvMetrics.cls += e.value; } }).observe({type:'layout-shift', buffered:true}); } catch {}
    try { window.__wvMaxEvent = 0; new PerformanceObserver(list=>{ for(const e of list.getEntries()){ if(e.duration && e.duration > window.__wvMaxEvent) window.__wvMaxEvent = e.duration; } }).observe({type:'event', buffered:true, durationThreshold:40}); setInterval(()=>{ if(window.__wvMaxEvent) window.__wvMetrics.inp = window.__wvMaxEvent; },400); } catch {}
  });
  try {
    await page.goto(BASE+'/', { waitUntil:'networkidle0', timeout:60000 });
    if(route !== '/'){
      await page.evaluate((r)=>{ window.history.pushState({},'',r); window.dispatchEvent(new Event('popstate')); }, route);
      await page.waitForFunction(()=>!!document.querySelector('main') && (document.querySelector('h1')||document.querySelector('h2')), { timeout:12000 }).catch(()=>{});
      await sleep(1600);
    } else {
      await sleep(1200);
    }
    // Interaktion simulieren zur INP Generierung
    await page.mouse.move(25,25);
    await page.mouse.click(30,30).catch(()=>{});
    await page.keyboard.press('Tab').catch(()=>{});
    await sleep(1200);
    const metrics = await page.evaluate(()=>({ ...window.__wvMetrics }));
    await browser.close();
    return { page: route, lcp: metrics.lcp && +metrics.lcp.toFixed(0), cls: metrics.cls && +metrics.cls.toFixed(3), inp: metrics.inp && +metrics.inp.toFixed(0) };
  } catch(e){
    await browser.close();
    return { page: route, error: e.message.split('\n')[0] };
  }
}

(async()=>{
  await startServerIfNeeded();
  const results = [];
  for(const r of PAGES){
    console.log('[web-vitals] measuring', r);
    results.push(await measure(r));
  }
  const thresholds = { lcp: 2500, cls: 0.1, inp: 200 };
  const compliance = results.filter(r=>!r.error).map(r=>({
    page: r.page,
    lcp_ok: r.lcp!=null ? r.lcp <= thresholds.lcp : false,
    cls_ok: r.cls!=null ? r.cls <= thresholds.cls : false,
    inp_ok: r.inp!=null ? r.inp <= thresholds.inp : false
  }));
  const report = { generated:new Date().toISOString(), base: BASE, results, thresholds, compliance, allPassed: compliance.length && compliance.every(c=>c.lcp_ok && c.cls_ok && c.inp_ok) };
  if(!fs.existsSync('docs')) fs.mkdirSync('docs');
  fs.writeFileSync('docs/web-vitals-metrics.json', JSON.stringify(report,null,2));
  console.log('web-vitals metrics written to docs/web-vitals-metrics.json');
  console.log(JSON.stringify({ summary:{ allPassed: report.allPassed } }, null, 2));
  if(serverStarted){ server.close(); }
})();
