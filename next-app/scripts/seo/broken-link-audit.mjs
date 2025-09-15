#!/usr/bin/env node
/**
 * Broken Link Audit
 * Crawlt interne Links (gleiche Host Domain) ab Start-URL oder Sitemap und prüft HTTP Status.
 *
 * Features:
 *  - Start via --base https://www.domain.tld (Default SITE_BASE env)
 *  - Alternativ --sitemap URL nutzt Sitemap Seed URLs
 *  - Depth-limited BFS Crawl (Default depth=3, konfigurierbar --depth 4)
 *  - HEAD Request zuerst; bei 405/403 Fallback GET
 *  - Ignoriert Mailto, Tel, Hash, JS Links
 *  - Optional: Exporte JSON Report (--out report.json)
 *  - Exit Code 1 falls >=1 Broken (4xx/5xx) Links
 */
import fs from 'node:fs';

function parseArgs(){
  const args = process.argv.slice(2);
  const cfg = { depth:3 };
  for(let i=0;i<args.length;i++){
    const a = args[i];
    if(a==='--base') cfg.base = args[++i];
    else if(a==='--sitemap') cfg.sitemap = args[++i];
    else if(a==='--depth') cfg.depth = Number(args[++i]);
    else if(a==='--out') cfg.out = args[++i];
    else if(a==='--limit') cfg.limit = Number(args[++i]);
    else if(a==='--debug') cfg.debug = true;
  }
  return cfg;
}

async function fetchSitemap(url){
  try {
    const res = await fetch(url, { headers:{ 'User-Agent':'BrokenLinkAudit/1.0' }});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const xml = await res.text();
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=> m[1].trim());
  } catch(e){
    console.warn('[links] Sitemap Fehler', e.message);
    return [];
  }
}

function extractLinks(html, baseHost){
  const links = new Set();
  // naïve a href extraction
  for(const m of html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)){
    const href = m[1];
    if(!href) continue;
    if(href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const u = new URL(href, 'https://'+baseHost);
      if(u.host === baseHost) links.add(u.pathname + u.search);
    } catch { /* ignore */ }
  }
  return [...links];
}

async function headOrGet(url){
  try {
    let res = await fetch(url, { method:'HEAD', headers:{ 'User-Agent':'BrokenLinkAudit/1.0' }});
    if(res.status === 405 || res.status === 403) {
      res = await fetch(url, { headers:{ 'User-Agent':'BrokenLinkAudit/1.0' }});
    }
    return { status: res.status };
  } catch(e){
    return { status: 0, error: e.message };
  }
}

async function crawl({ base, depthLimit, limit }){
  const baseUrl = new URL(base);
  const baseHost = baseUrl.host;
  const visited = new Set();
  const queue = [{ url: baseUrl.href, depth:0 }];
  const results = [];
  while(queue.length){
    const { url, depth } = queue.shift();
    if(visited.has(url) || depth > depthLimit) continue;
    visited.add(url);
    const { status } = await headOrGet(url);
    results.push({ url, status, depth });
    if(limit && results.length >= limit) break;
    if(status >= 400 || status === 0) continue; // don't expand broken
    if(depth === depthLimit) continue;
    try {
      const res = await fetch(url, { headers:{ 'User-Agent':'BrokenLinkAudit/1.0' }});
      const html = await res.text();
      const links = extractLinks(html, baseHost);
      for(const p of links){
        const abs = new URL(p, baseUrl.origin).href;
        if(!visited.has(abs)) queue.push({ url: abs, depth: depth+1 });
      }
    } catch { /* ignore body fetch errors */ }
  }
  return results;
}

async function main(){
  const args = parseArgs();
  const base = args.base || process.env.SITE_BASE || 'https://www.zoe-solar.de';
  let seedUrls = [];
  if(args.sitemap){
    const sitemapUrls = await fetchSitemap(args.sitemap);
    seedUrls.push(...sitemapUrls);
  }
  let results = [];
  if(seedUrls.length){
    // Evaluate each sitemap URL but don't deep crawl beyond the page itself
    for(const u of seedUrls){
      const { status } = await headOrGet(u);
      results.push({ url: u, status, depth:0 });
    }
  } else {
    results = await crawl({ base, depthLimit: args.depth, limit: args.limit });
  }
  const broken = results.filter(r=> r.status >= 400 || r.status === 0);
  for(const r of results){
    if(r.status >= 400 || r.status === 0) console.log('✖', r.status, r.url);
    else console.log('✓', r.status, r.url);
  }
  const summary = { generatedAt: new Date().toISOString(), base, total: results.length, broken: broken.length, brokenLinks: broken };
  if(args.out){
    fs.writeFileSync(args.out, JSON.stringify(summary,null,2));
    console.log('[links] Report →', args.out);
  }
  if(broken.length){
    console.log(`\n[links] FAIL: ${broken.length} defekte Links.`);
    process.exit(1);
  } else {
    console.log('\n[links] SUCCESS: Keine defekten Links gefunden.');
  }
}

main().catch(e=> { console.error('[links] Fatal', e); process.exit(1); });
