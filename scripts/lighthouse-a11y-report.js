#!/usr/bin/env node
/**
 * Lighthouse Accessibility Runner (verbessert)
 * - Verwendet den von Puppeteer bereitgestellten Chrome (garantierte Binary)
 * - Erzeugt pro Seite einen vollständigen Lighthouse JSON Report in docs/lighthouse-a11y/<slug>.json
 * - Aggregiert Scores in docs/lighthouse-a11y-scores.json
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chromeLauncher = require('chrome-launcher');

const PAGES = [
  '/',
  '/whyus',
  '/technology',
  '/contact'
];

// Server Handling
const EMBED = process.env.LH_EMBED_SERVER === '1';
let server; // embedded server instance
let basePort = Number(process.env.LH_PORT || 4173);
let resolvedPort = basePort;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startEmbeddedServer(){
  const distDir = path.resolve(__dirname,'..','Arbeitsverzeichnis','dist');
  // Simple static server (SPA fallback)
  const indexPath = path.join(distDir,'index.html');
  if(!fs.existsSync(indexPath)){
    console.error('[lighthouse-a11y] dist build nicht gefunden – bitte vorher bauen.');
    process.exit(1);
  }
  const indexHtml = fs.readFileSync(indexPath,'utf-8');
  const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif'};
  function attempt(port){
    return new Promise((resolve,reject)=>{
      const s = http.createServer((req,res)=>{
        const urlPath = decodeURI(req.url.split('?')[0]);
        let filePath = path.join(distDir, urlPath);
        if(urlPath.endsWith('/')) filePath = path.join(distDir,urlPath,'index.html');
        const ext = path.extname(filePath);
        if(!ext || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()){
          res.writeHead(200,{ 'Content-Type':'text/html; charset=utf-8'});
            res.end(indexHtml); return;
        }
        try {
          const data = fs.readFileSync(filePath);
          res.writeHead(200,{ 'Content-Type': mime[ext] || 'application/octet-stream'});
          res.end(data);
        } catch(e){
          res.writeHead(404,{ 'Content-Type':'text/plain; charset=utf-8'});
          res.end('Not found');
        }
      });
      s.on('error', err => reject(err));
      s.listen(port, ()=> resolve(s));
    });
  }
  let tries = 0;
  while(tries < 5){
    try {
      server = await attempt(resolvedPort);
      console.log(`[lighthouse-a11y] Embedded Server auf Port ${resolvedPort}`);
      return;
    } catch(e){
      if(e.code === 'EADDRINUSE'){
        resolvedPort++; tries++; continue;
      }
      throw e;
    }
  }
  console.error('[lighthouse-a11y] Kein freier Port gefunden.');
  process.exit(1);
}

if(EMBED){
  await startEmbeddedServer();
}

const BASE = process.env.LH_BASE || `http://localhost:${resolvedPort}`;

const results = [];
const outDir = path.resolve('docs','lighthouse-a11y');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});

let chromeController; // unified controller { close: fn, port }
async function launchChromeWithFallback(){
  try {
    const chrome = await chromeLauncher.launch({chromeFlags:['--headless=new','--no-sandbox','--disable-setuid-sandbox']});
    return { port: chrome.port, close: async ()=> { try { await chrome.kill(); } catch {} } };
  } catch(err){
    console.warn('[lighthouse-a11y] chrome-launcher fehlgeschlagen, versuche Puppeteer Fallback:', err.message);
    let basePort = 9222 + Math.floor(Math.random()*2000);
    for(let i=0;i<5;i++){
      try {
        const browser = await puppeteer.launch({headless: 'new', args:[`--remote-debugging-port=${basePort}`,'--no-sandbox','--disable-setuid-sandbox']});
        return { port: basePort, close: async ()=> { try { await browser.close(); } catch {} } };
      } catch(e){
        basePort++;
      }
    }
    throw new Error('Fallback Puppeteer Launch fehlgeschlagen');
  }
}

try {
  chromeController = await launchChromeWithFallback();
  const opts = {port: chromeController.port, onlyCategories:['accessibility'], output:'json', logLevel:'error'};
  for(const p of PAGES){
    const url = BASE + p;
    const slug = p === '/' ? 'home' : p.replace(/^\//,'').replace(/\//g,'_');
    try {
      const runnerResult = await lighthouse(url, opts);
      const lhr = runnerResult.lhr;
      const score = lhr.categories.accessibility.score * 100;
      fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(lhr,null,2));
      const failing = Object.values(lhr.audits).filter(a=> a.score !== 1 && a.scoreDisplayMode !== 'notApplicable').map(a=> ({ id: a.id, title: a.title, score: a.score }));
      results.push({ page: p, score, failingCount: failing.length, failing });
    } catch(e){
      results.push({ page: p, error: e.message.split('\n')[0] });
    }
  }
} catch(e){
  console.error('Lighthouse gescheitert:', e.message);
  if(results.length === 0){
    PAGES.forEach(p=> results.push({ page:p, error:'lighthouse launch failed'}));
  }
} finally {
  try { if(chromeController) await chromeController.close(); } catch {}
  if(server){
    await new Promise(r=> server.close(()=>r()));
  }
}

const scored = results.filter(r=> r.score !== undefined);
const minScore = scored.length ? Math.min(...scored.map(r=>r.score)) : null;
const avgScore = scored.length ? (scored.reduce((a,b)=> a + b.score,0)/scored.length) : null;
const summary = { generated: new Date().toISOString(), base: BASE, results, minScore, avgScore, target: 95 };

if(!fs.existsSync('docs')) fs.mkdirSync('docs');
fs.writeFileSync('docs/lighthouse-a11y-scores.json', JSON.stringify(summary,null,2));
console.log('Lighthouse Accessibility Summary -> docs/lighthouse-a11y-scores.json');
console.log(JSON.stringify(summary,null,2));
