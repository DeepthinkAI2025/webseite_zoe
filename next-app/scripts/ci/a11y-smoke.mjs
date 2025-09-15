#!/usr/bin/env node
/**
 * Minimaler Axe Accessibility Smoke:
 * - Prüft / und /standorte/berlin
 * - Fail bei Violations >= serious
 * - Zusätzliche einfache Checks: fehlende Alt-Texte von <img>, Buttons ohne Name
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const TARGETS = process.env.A11Y_PATHS ? process.env.A11Y_PATHS.split(',') : ['/', '/standorte/berlin'];
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const MAX_SEVERITY_FAIL = 'serious';
const SEVERITY_ORDER = ['minor','moderate','serious','critical'];

async function injectAxe(page){
  // axe-core wird über next-app Abhängigkeit (transitiv) bereitgestellt (im lockfile). Fallback CDN wenn nicht vorhanden.
  try {
    const axePath = require.resolve('axe-core/axe.min.js');
    const axeSrc = fs.readFileSync(axePath,'utf8');
    await page.addScriptTag({content: axeSrc});
  } catch (e){
    await page.addScriptTag({url:'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js'});
  }
}

function worstSeverity(violations){
  let worst = 'minor';
  for(const v of violations){
    if(SEVERITY_ORDER.indexOf(v.impact) > SEVERITY_ORDER.indexOf(worst)) worst = v.impact;
  }
  return worst;
}

async function run(){
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext();
  const results = [];
  for(const p of TARGETS){
    const url = BASE.replace(/\/$/,'') + p;
    const page = await context.newPage();
    await page.goto(url, { waitUntil:'domcontentloaded' });
    await injectAxe(page);
    const axeResult = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, { resultTypes:['violations'] });
    });
    // Zusätzliche manuelle Checks
    const missingAlt = await page.$$eval('img', imgs => imgs.filter(i => !i.alt || !i.alt.trim()).map(i => i.getAttribute('src')));
    const namelessButtons = await page.$$eval('button, [role=button]', els => els.filter(e => {
      const txt = (e.textContent||'').trim();
      const aria = e.getAttribute('aria-label')||''; return !txt && !aria; }).length);

    results.push({ path:p, url, violations: axeResult.violations.map(v => ({id:v.id, impact:v.impact, description:v.description, nodes:v.nodes.length})), missingAlt, namelessButtons });
    await page.close();
  }
  await browser.close();

  const report = { generatedAt:new Date().toISOString(), base:BASE, results };
  const outDir = path.join(process.cwd(),'docs');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,'a11y-smoke-report.json'), JSON.stringify(report,null,2));

  // Bewertung
  let fail = false;
  for(const r of results){
    const worst = worstSeverity(r.violations);
    if(SEVERITY_ORDER.indexOf(worst) >= SEVERITY_ORDER.indexOf(MAX_SEVERITY_FAIL)) fail = true;
    if(r.missingAlt.length > 0 || r.namelessButtons > 0) fail = true;
  }
  if(fail){
    console.error('A11y Smoke Gate FAILED');
    console.error(JSON.stringify(report,null,2));
    process.exit(1);
  } else {
    console.log('A11y Smoke Gate PASSED');
  }
}

run().catch(e => { console.error(e); process.exit(1); });
