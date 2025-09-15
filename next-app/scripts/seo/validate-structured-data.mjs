#!/usr/bin/env node
/**
 * Structured Data Validator
 * Prüft Kern-Schema.org Typen auf definierten Seiten.
 *
 * Modi:
 *  1. Remote Crawl via Sitemap (--sitemap URL) oder Basis (--base https://domain) + /sitemap.xml
 *  2. Konkrete URL-Liste via --urls-file
 *  3. Lokaler HTML Ordner (--local-dir) für Offline Tests (jede .html Datei = Route)
 *
 * Checks / Anforderungen:
 *  - Alle Kernseiten: BreadcrumbList
 *  - /           : Organization, WebSite
 *  - /pricing    : OfferCatalog
 *  - /faq        : FAQPage
 *  - /contact    : LocalBusiness
 *
 * Report:
 *  - JSON Summary (optional --out report.json)
 *  - Exit Code 1 bei fehlenden Pflichttypen
 */
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(){
  const args = process.argv.slice(2);
  const cfg = { required: true };
  for(let i=0;i<args.length;i++){
    const a = args[i];
    if(a==='--sitemap') cfg.sitemap = args[++i];
    else if(a==='--base') cfg.base = args[++i];
    else if(a==='--urls-file') cfg.urlsFile = args[++i];
    else if(a==='--out') cfg.out = args[++i];
    else if(a==='--local-dir') cfg.localDir = args[++i];
    else if(a==='--debug') cfg.debug = true;
  }
  return cfg;
}

async function readUrlsFile(file){
  if(!file) return [];
  if(!fs.existsSync(file)) throw new Error('URLs Datei nicht gefunden: '+file);
  return fs.readFileSync(file,'utf-8').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
}

async function fetchSitemap(url){
  try {
    const res = await fetch(url, { headers:{ 'User-Agent':'StructuredDataValidator/1.0' }});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const xml = await res.text();
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=> m[1].trim());
  } catch(e){
    console.warn('[validator] Sitemap Fehler', url, e.message);
    return [];
  }
}

async function fetchHtml(url){
  try {
    const res = await fetch(url, { headers:{ 'User-Agent':'StructuredDataValidator/1.0' }});
    if(!res.ok) throw new Error('HTTP '+res.status);
    return await res.text();
  } catch(e){
    return { error: e.message };
  }
}

function extractJsonLd(html){
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=> m[1].trim());
  const types = [];
  const raw = [];
  for(const block of scripts){
    try {
      const json = JSON.parse(block);
      raw.push(json);
      const collect = (obj)=>{
        if(Array.isArray(obj)) obj.forEach(collect); else if(obj && typeof obj==='object'){ if(obj['@type']) types.push(obj['@type']); Object.values(obj).forEach(v=> collect(v)); }
      };
      collect(json);
    } catch(e){
      console.warn('[validator] Ungültiges JSON-LD block ignoriert:', e.message);
    }
  }
  return { types: Array.from(new Set(types.flat().map(t => typeof t==='string'? t : '').filter(Boolean))), rawCount: raw.length };
}

const PAGE_REQUIREMENTS = {
  '/': ['Organization','WebSite','BreadcrumbList'],
  '/pricing': ['OfferCatalog','BreadcrumbList'],
  '/faq': ['FAQPage','BreadcrumbList'],
  '/contact': ['LocalBusiness','BreadcrumbList']
};

function evaluate(urlPath, foundTypes){
  const req = new Set(['BreadcrumbList']); // Basis für alle
  if(PAGE_REQUIREMENTS[urlPath]) PAGE_REQUIREMENTS[urlPath].forEach(r=> req.add(r));
  const missing = [...req].filter(r=> !foundTypes.includes(r));
  return { required: [...req], missing };
}

async function processRemote(urls){
  const results = [];
  for(const url of urls){
    const pathname = new URL(url).pathname.replace(/\/$/,'') || '/';
    const html = await fetchHtml(url);
    if(typeof html === 'object' && html.error){
      results.push({ url, path: pathname, error: html.error, types: [] });
      continue;
    }
    const { types, rawCount } = extractJsonLd(html);
    const evalRes = evaluate(pathname, types);
    results.push({ url, path: pathname, types, rawBlocks: rawCount, ...evalRes });
  }
  return results;
}

function processLocalDir(dir){
  const files = fs.readdirSync(dir).filter(f=> f.endsWith('.html'));
  const results = [];
  for(const file of files){
    const html = fs.readFileSync(path.join(dir,file),'utf-8');
    const route = file.replace(/\.html$/, '') === 'index' ? '/' : ('/' + file.replace(/\.html$/,''));
    const { types, rawCount } = extractJsonLd(html);
    const evalRes = evaluate(route, types);
    results.push({ url: `file://${file}`, path: route, types, rawBlocks: rawCount, ...evalRes });
  }
  return results;
}

async function main(){
  const args = parseArgs();
  let results = [];
  if(args.localDir){
    results = processLocalDir(args.localDir);
  } else {
    const base = args.base || process.env.SITE_BASE || 'https://www.zoe-solar.de';
    let urls = [];
    if(args.sitemap) urls = await fetchSitemap(args.sitemap);
    if(!urls.length){
      const sm = base.replace(/\/$/,'') + '/sitemap.xml';
      urls = await fetchSitemap(sm);
    }
    if(args.urlsFile){
      const list = await readUrlsFile(args.urlsFile);
      urls.push(...list);
    }
    urls = Array.from(new Set(urls.filter(u=> u.startsWith(base))));
    if(args.debug) console.log('[validator] URLs', urls);
    results = await processRemote(urls);
  }

  const missingIssues = results.filter(r=> r.missing && r.missing.length);
  const summary = {
    generatedAt: new Date().toISOString(),
    totalPages: results.length,
    pagesMissing: missingIssues.length,
    issues: missingIssues.map(r=> ({ path: r.path, missing: r.missing })),
    results
  };
  if(args.out){
    fs.writeFileSync(args.out, JSON.stringify(summary,null,2));
    console.log('[validator] Report geschrieben →', args.out);
  }
  // Console Ausgabe kompakt
  for(const r of results){
    if(r.error) console.log('✖', r.path, 'ERROR', r.error);
    else if(r.missing.length) console.log('✖', r.path, 'fehlt:', r.missing.join(','));
    else console.log('✓', r.path, 'OK');
  }
  if(missingIssues.length){
    console.log(`\n[validator] FAIL: ${missingIssues.length} Seiten mit fehlenden Typen.`);
    process.exit(1);
  } else {
    console.log('\n[validator] SUCCESS: Alle geprüften Seiten erfüllen Anforderungen.');
  }
}

main().catch(e=> { console.error('[validator] Fatal:', e); process.exit(1); });
