#!/usr/bin/env node
// Sammeln von INP (Interaction to Next Paint) mittels PerformanceObserver im Lab.
// Strategie: Lädt Startseite, führt synthetische Interaktionen (Click, Key, Input) aus,
// wartet auf Event-Timings und speichert best/worst + INP.
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import http from 'http';
const OUT = 'docs/inp-lab-metrics.json';

(async()=>{
  // Optional eingebetteter Static Server, um externe serve Abhängigkeit zu vermeiden
  let server; let port = 4173;
  if(process.env.EMBED_SERVER !== '0'){
    const distDir = path.resolve(process.cwd(),'dist');
    if(!fs.existsSync(distDir)){
      console.error('[inp-lab] dist/ nicht gefunden – bitte vorher build ausführen.');
      process.exit(1);
    }
  server = http.createServer((req,res)=>{
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(distDir, urlPath);
      if(urlPath === '/' || !path.extname(filePath)){
        // SPA Fallback
        filePath = path.join(distDir,'index.html');
      }
      fs.readFile(filePath,(err,data)=>{
        if(err){ res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200); res.end(data);
      });
  }).listen(0, ()=> { port = server.address().port; console.log('[inp-lab] Embedded static server auf Port', port); });
  }
  const headlessMode = process.env.HEADLESS === '0' ? false : 'new';
  // Für INP-Messungen ist headed-Modus besser (EventTiming funktioniert besser)
  const useHeadless = process.env.INP_HEADLESS === '1' ? headlessMode : false;
  const browser = await puppeteer.launch({headless: useHeadless, args:[
    '--no-sandbox','--disable-setuid-sandbox',
    '--enable-blink-features=EventTiming'
  ]});
  const page = await browser.newPage();
  const sleep = (ms)=> new Promise(r=> setTimeout(r, ms));
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' });
  // kurze zusätzliche Wartezeit damit Lazy Nav evtl. lädt
  await sleep(400);
  // web-vitals INP Hook
  try {
    await page.addScriptTag({ url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js' });
    await page.evaluate(()=>{
      window.__webVitals = window.__webVitals || {};
      try { window.webVitals.onINP((metric)=> { window.__webVitals.INP = metric; }); } catch {}
    });
  } catch {}
  // Inject manual fallback measurement (before interactions)
  await page.evaluate(()=>{
    (function(){
      if(window.__manualInpSetup) return; window.__manualInpSetup = true;
      window.__manualInpEvents = [];
      const types = ['click','pointerdown','keydown','input'];
      types.forEach(t=>{
        window.addEventListener(t, ev=>{
          const start = performance.now();
          // Two RAFs -> approximate next paint after potential rendering work
          requestAnimationFrame(()=> requestAnimationFrame(()=>{
            const duration = performance.now() - start;
            window.__manualInpEvents.push({ name: ev.type, startTime: start, duration });
          }));
        }, { capture:true, passive:true });
      });
    })();
  });
  // Inject observer
  await page.evaluate(()=>{
    window.__inpEvents = [];
    try {
      const po = new PerformanceObserver((list)=>{
        for(const entry of list.getEntries()){
          if(entry.entryType === 'event'){ window.__inpEvents.push({ name: entry.name, duration: entry.duration, processingStart: entry.processingStart, startTime: entry.startTime }); }
        }
      });
  // durationThreshold 0, damit auch kurze Events erfasst werden
  po.observe({ type: 'event', buffered: true, durationThreshold: 0 });
    } catch(e) { /* ignore */ }
  });
  // Simulate interactions: focus command input, type, open nav, scroll etc.
  await page.evaluate(()=>{ window.scrollTo(0, 600); });
  await sleep(120);
  // echter Scroll + Klick ins Body (pointerdown -> event timing)
  try { await page.mouse.move(10,10); await page.mouse.click(20,120); } catch {}
  // Click nav links sequentially (shallow)
  const navSelectors = ['a[href="/rechner"]','a[href="/kontakt"]','button[aria-label="Menü öffnen"]','a[href="/technology"]'];
  for(const sel of navSelectors){
    try {
      await page.waitForSelector(sel, { timeout: 1500 });
      await page.click(sel, { delay: 30 });
      await sleep(300);
    } catch(e) { /* ignore */ }
  }
  // Return to home via SPA (History API) to avoid tearing down observers
  await page.evaluate(()=>{ if(window.location.pathname !== '/'){ window.history.pushState({},'', '/'); window.dispatchEvent(new Event('popstate')); } });
  // Trigger Support Chat Drawer open/close to capture drawer interactions
  await page.evaluate(()=>{ window.dispatchEvent(new Event('open-support-chat')); });
  await sleep(300);
  await page.keyboard.press('Escape');
  await sleep(150);
  await sleep(400);
  // Re-inject fallback & web-vitals guards in case of full reload (noop if already present)
  await page.evaluate(()=>{
    if(!window.__manualInpSetup){
      window.__manualInpSetup = true;
      window.__manualInpEvents = [];
      ['click','pointerdown','keydown','input'].forEach(t=>{
        window.addEventListener(t, ev=>{
          const start = performance.now();
          requestAnimationFrame(()=> requestAnimationFrame(()=>{
            const duration = performance.now() - start;
            window.__manualInpEvents.push({ name: ev.type, startTime: start, duration });
          }));
        }, { capture:true, passive:true });
      });
    }
    if(!window.__webVitals && window.webVitals){
      window.__webVitals = {};
      try { window.webVitals.onINP((metric)=> { window.__webVitals.INP = metric; }); } catch {}
    }
  });
  // Simulate input & heavy work to produce measurable event durations
  await page.evaluate(()=>{
  const cmd = document.querySelector('input[placeholder*="Frag uns"]');
    if(cmd){
      cmd.focus();
      const text = 'kosten berechnen jetzt';
      for(const ch of text){
        cmd.value += ch;
        cmd.dispatchEvent(new Event('input',{bubbles:true}));
        // create keydown + keyup for each char to record event timings
        const evt = new KeyboardEvent('keydown',{key: ch, bubbles:true});
        cmd.dispatchEvent(evt);
      }
    }
    // Heavy work simulation (long task) after an interaction to influence INP if any pending paint
  const start = performance.now();
  while(performance.now() - start < 220){ /* busy loop 220ms to amplify INP worst-case */ }
  });
  await sleep(900);
  const events = await page.evaluate(()=> window.__inpEvents || []);
  const filtered = events.filter(e=> ['click','keydown','pointerdown','input','mousedown','mouseup'].includes(e.name));
  if(filtered.length === 0){
    console.warn('[inp-lab] Keine EventTiming Einträge – verwende manuellen Fallback.');
    const manual = await page.evaluate(()=> window.__manualInpEvents || []);
    if(manual.length){
      manual.sort((a,b)=> b.duration - a.duration);
      const worstM = manual[0];
      const p98M = manual[Math.min(manual.length-1, Math.floor(manual.length*0.98))];
    const vitals = await page.evaluate(()=> (window.__webVitals && window.__webVitals.INP) || null);
    const summary = { totalEvents: 0, interactionEvents: manual.length, worst: worstM, p98: p98M, maxDuration: worstM.duration, generated: new Date().toISOString(), source: 'manual-fallback', webVitalsINP: vitals };
      fs.writeFileSync(OUT, JSON.stringify(summary,null,2));
      console.log('INP Lab Metrics (Fallback) ->', OUT, summary);
      await browser.close();
      return;
    }
  }
  const worst = filtered.reduce((a,b)=> b.duration > a.duration ? b : a, {duration:0});
  const p98 = [...filtered].sort((a,b)=> a.duration - b.duration)[Math.min(filtered.length-1, Math.floor(filtered.length*0.98))] || null;
  const vitals = await page.evaluate(()=> (window.__webVitals && window.__webVitals.INP) || null);
  const summary = { totalEvents: events.length, interactionEvents: filtered.length, worst, p98, maxDuration: worst.duration, generated: new Date().toISOString(), note: filtered.length === 0 ? 'No event entries captured – likely EventTiming not populated or synthetic pattern not qualifying.' : undefined, webVitalsINP: vitals, headless: headlessMode !== false };
  fs.writeFileSync(OUT, JSON.stringify(summary,null,2));
  console.log('INP Lab Metrics ->', OUT, summary);
  await browser.close();
  if(server){ server.close(); }
})();
