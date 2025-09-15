#!/usr/bin/env node
/**
 * IndexNow Submission Script
 * Features:
 *  - Einzel URL via --url
 *  - Mehrere URLs via --urls <datei.txt> (eine URL pro Zeile)
 *  - Sitemap Modus via --from-sitemap <sitemap_url> (extrahiert <loc>)
 *  - Fallback: nutzt SITE_BASE (ENV) oder Default https://www.zoe-solar.de und ruft /sitemap.xml ab
 *  - Key Handling: env INDEXNOW_KEY oder .indexnow-key.txt; wenn nicht vorhanden -> generieren
 *  - Legt im public/ Verzeichnis eine <key>.txt Datei an (Requirement: key muss öffentlich abrufbar sein)
 *  - Ausgabe: JSON Response + Statistiken
 *
 * Beispiel:
 *    node scripts/seo/indexnow-submit.mjs --url https://www.zoe-solar.de/pricing
 *    node scripts/seo/indexnow-submit.mjs --from-sitemap https://www.zoe-solar.de/sitemap.xml
 *    node scripts/seo/indexnow-submit.mjs --urls changed.txt
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function parseArgs(){
  const args = process.argv.slice(2);
  const cfg = { urls: [], fromSitemap: null };
  for(let i=0;i<args.length;i++){
    const a = args[i];
    if(a==='--url') cfg.urls.push(args[++i]);
    else if(a==='--urls') cfg.urlsFile = args[++i];
    else if(a==='--from-sitemap') cfg.fromSitemap = args[++i];
    else if(a==='--key') cfg.key = args[++i];
    else if(a==='--endpoint') cfg.endpoint = args[++i];
  }
  return cfg;
}

async function readUrlsFile(file){
  if(!file) return [];
  if(!fs.existsSync(file)) throw new Error('URLs Datei nicht gefunden: '+file);
  return fs.readFileSync(file,'utf-8').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
}

async function extractFromSitemap(url){
  try {
    const res = await fetch(url, { headers:{ 'User-Agent':'IndexNowSubmit/1.0' }});
    if(!res.ok) throw new Error('Sitemap abrufbar aber HTTP '+res.status);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=> m[1].trim());
    return Array.from(new Set(locs));
  } catch(e){
    console.warn('[indexnow] Sitemap Fehler:', e.message);
    return [];
  }
}

function ensureKey(existingKey){
  const keyFile = path.resolve('.indexnow-key.txt');
  let key = existingKey || process.env.INDEXNOW_KEY;
  if(!key && fs.existsSync(keyFile)) key = fs.readFileSync(keyFile,'utf-8').trim();
  if(!key){
    key = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(keyFile, key);
    console.log('[indexnow] Neuer Key generiert →', keyFile);
  }
  // Public Key File
  const pubDir = path.resolve('public');
  if(!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive:true });
  const pubFile = path.join(pubDir, key + '.txt');
  if(!fs.existsSync(pubFile)) fs.writeFileSync(pubFile, key);
  return key;
}

async function submitIndexNow({ host, key, keyLocation, urlList, endpoint }){
  if(!urlList.length) throw new Error('Keine URLs zum Senden.');
  const body = {
    host,
    key,
    keyLocation,
    urlList
  };
  const ep = endpoint || 'https://www.bing.com/indexnow';
  const res = await fetch(ep, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, body: text };
}

async function main(){
  const args = parseArgs();
  const SITE_BASE = process.env.SITE_BASE || 'https://www.zoe-solar.de';
  let urls = [...args.urls];
  if(args.urlsFile){
    urls.push(...await readUrlsFile(args.urlsFile));
  }
  if(args.fromSitemap){
    const smUrls = await extractFromSitemap(args.fromSitemap);
    urls.push(...smUrls);
  }
  if(!urls.length){
    // Default: Haupt-Sitemap versuchen
    const sm = SITE_BASE.replace(/\/$/,'') + '/sitemap.xml';
    console.log('[indexnow] Keine URLs angegeben – versuche Sitemap:', sm);
    urls.push(...await extractFromSitemap(sm));
  }
  // Dedup & Filter Domain
  const baseHost = new URL(SITE_BASE).host;
  urls = Array.from(new Set(urls.filter(u=> {
    try { return new URL(u).host === baseHost; } catch { return false; }
  })));
  if(!urls.length) throw new Error('Keine gültigen Domain-URLs gefunden.');

  const key = ensureKey(args.key);
  const host = baseHost;
  const keyLocation = `${SITE_BASE.replace(/\/$/,'')}/${key}.txt`;
  console.log(`[indexnow] Sende ${urls.length} URLs an IndexNow…`);
  const batchSize = 10000; // IndexNow erlaubt große Listen, hier keine harte Limitierung nötig
  const result = await submitIndexNow({ host, key, keyLocation, urlList: urls.slice(0, batchSize), endpoint: args.endpoint });
  console.log('[indexnow] Response Status:', result.status, result.ok ? 'OK':'FAIL');
  if(!result.ok) {
    console.error('[indexnow] Body:', result.body.slice(0,500));
    process.exit(1);
  }
  console.log('[indexnow] Fertig. Erste 300 Zeichen Antwort:', result.body.slice(0,300));
}

main().catch(e=> { console.error('[indexnow] Fehler:', e.message); process.exit(1); });
