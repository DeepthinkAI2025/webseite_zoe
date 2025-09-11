#!/usr/bin/env node
/**
 * Enhanced lighthouse-perf-report (Arbeitsverzeichnis Variante)
 * - Dynamische Portwahl (vermeidet Konflikte in parallelen Pipelines)
 * - Mehrere Versuche pro Seite (Retry bei flakey Headless Messungen)
 * - MODE (desktop/mobile) via LH_MODE (Default mobile – realer Engpass)
 * - Konfigurierbare Pages via LIGHTHOUSE_PAGES
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cwd = process.cwd();
const OUTPUT = path.resolve(cwd, 'docs/lighthouse-perf-metrics.json');
const DIST = path.resolve(cwd, 'dist');
const PAGES = (process.env.LIGHTHOUSE_PAGES || '/,/whyus,/technology,/contact,/pricing,/projects').split(',').map(p => p.trim()).filter(Boolean);
const MODE = process.env.LH_MODE === 'desktop' ? 'desktop' : 'mobile';
const MAX_ATTEMPTS = Number(process.env.LH_ATTEMPTS || 2);

async function build(){
  console.log('[perf] build start');
  await new Promise((res, rej) => {
    const c = spawn('npm', ['run','build','--silent'], { stdio: 'inherit' });
    c.on('exit', code => code===0?res():rej(new Error('build failed '+code)));
    c.on('error', rej);
  });
  console.log('[perf] build done');
}

async function findPort(preferred=[4173,5173,5174]){
  for(const p of preferred){
    const free = await isFree(p); if(free) return p;
  }
  // fallback random 0
  return await getRandomPort();
}
function isFree(port){
  return new Promise(r=>{ const srv = net.createServer(); srv.once('error',()=>r(false)); srv.listen(port,()=>{ srv.close(()=>r(true)); }); });
}
function getRandomPort(){
  return new Promise((res,rej)=>{ const srv = net.createServer(); srv.listen(0,()=>{ const p = srv.address().port; srv.close(()=>res(p)); }); srv.on('error',rej); });
}

function serve(distDir, port){
  if(!fs.existsSync(distDir)) throw new Error('dist/ fehlt (build nicht erfolgreich?)');
  const server = http.createServer((req,res)=>{
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let fp = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);
      if(!fp.startsWith(distDir)) { res.writeHead(403); return res.end(); }
      if(!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) fp = path.join(distDir,'index.html');
      fs.readFile(fp,(e,data)=>{ if(e){ res.writeHead(500); res.end('ERR'); } else { res.writeHead(200); res.end(data); } });
    } catch(e){ res.writeHead(500); res.end('ERR'); }
  });
  return new Promise((res,rej)=>{ server.listen(port,()=>{ console.log('[perf] server', 'http://localhost:'+port); res(server); }); server.on('error',rej); });
}

async function runLighthouse(url){
  const lighthouse = (await import('lighthouse')).default;
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'] });
  let result; let error;
  try {
    const endpointURL = new URL(browser.wsEndpoint());
    const port = Number(endpointURL.port);
    result = await lighthouse(url, {
      port,
      logLevel: 'error',
      output: 'json',
      preset: MODE,
      onlyCategories: ['performance']
    });
  } catch(e){ error = e; }
  try { await browser.close(); } catch{}
  if(error) throw error;
  return result.lhr;
}

function extractMetrics(lhr){
  const audits = lhr.audits||{};
  const v = id => audits[id]?.numericValue ?? null;
  return {
    lcp: v('largest-contentful-paint'),
    cls: v('cumulative-layout-shift'),
    inp: v('interaction-to-next-paint') ?? v('interactive'),
    fcp: v('first-contentful-paint'),
    ttfb: v('server-response-time'),
    performanceScore: (lhr.categories?.performance?.score ?? 0)*100
  };
}

function fmtMs(v){ return v==null?null:Math.round(v); }
function fmtCls(v){ return v==null?null:+v.toFixed(3); }

async function main(){
  await build();
  const port = await findPort();
  const server = await serve(DIST, port);
  const BASE = `http://localhost:${port}`;
  const results = [];
  for(const page of PAGES){
    const url = BASE + page;
    console.log('[perf] lighthouse', url);
    let attempts=0; let success=false; let metrics={}; let lastError;
    while(attempts < MAX_ATTEMPTS && !success){
      attempts++;
      try {
        const lhr = await runLighthouse(url);
        metrics = { page, mode: MODE, attempts, ...extractMetrics(lhr) };
        success = true;
      } catch(e){ lastError = e; if(attempts < MAX_ATTEMPTS) console.warn('[perf] retry', attempts, page, e.message.split('\n')[0]); }
    }
    if(!success) metrics = { page, mode: MODE, attempts, error: lastError?.message?.split('\n')[0] || 'unknown' };
    results.push(metrics);
  }
  server.close();
  const summarized = results.map(r=>({
    ...r,
    lcp: fmtMs(r.lcp), fcp: fmtMs(r.fcp), inp: fmtMs(r.inp), ttfb: fmtMs(r.ttfb), cls: fmtCls(r.cls)
  }));
  const thresholds = { lcp: 2500, cls: 0.1, inp: 200 };
  const compliance = summarized.filter(r=>!r.error).map(r=>({
    page: r.page,
    lcp_ok: r.lcp!=null && r.lcp <= thresholds.lcp,
    cls_ok: r.cls!=null && r.cls <= thresholds.cls,
    inp_ok: r.inp!=null && r.inp <= thresholds.inp
  }));
  const report = { generated: new Date().toISOString(), base: BASE, mode: MODE, thresholds, results: summarized, compliance, allPassed: compliance.length && compliance.every(c=>c.lcp_ok && c.cls_ok && c.inp_ok) };
  if(!fs.existsSync(path.dirname(OUTPUT))) fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(report,null,2));
  console.log('[perf] metrics written', OUTPUT);
  console.log(JSON.stringify({ summary: { allPassed: report.allPassed } }));
}

main().catch(e=>{ console.error('[perf] FAILED', e); process.exit(1); });
