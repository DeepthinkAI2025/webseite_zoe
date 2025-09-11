#!/usr/bin/env node
/**
 * Liest public/sitemap.xml und erzeugt eine Normalisierungsliste für Canonicals.
 * Entfernt Tracking Query Parameter (utm_*, ref, gclid) und gibt Mapping als JSON aus.
 */
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const sitemapPath = 'public/sitemap.xml';
if(!fs.existsSync(sitemapPath)){
  console.error('Sitemap nicht gefunden:', sitemapPath);
  process.exit(1);
}
const xml = fs.readFileSync(sitemapPath,'utf-8');
const parser = new XMLParser();
const json = parser.parse(xml);
const urls = (json.urlset.url || []).map(u => u.loc);

function normalize(u){
  try {
    const url = new URL(u);
    const toDelete = [];
    url.searchParams.forEach((v,k)=>{
      if(/^utm_/i.test(k) || /^(gclid|ref)$/i.test(k)) toDelete.push(k);
    });
    toDelete.forEach(k=>url.searchParams.delete(k));
    // trailing slash normalisieren (nicht Root)
    if(url.pathname.endsWith('/') && url.pathname !== '/'){
      url.pathname = url.pathname.replace(/\/+$/, '');
    }
    return url.toString();
  } catch { return u; }
}

const mapping = urls.map(u => ({ original: u, canonical: normalize(u) }));
const out = { generated: new Date().toISOString(), entries: mapping };
fs.writeFileSync('docs/canonical-normalization.json', JSON.stringify(out,null,2));
console.log('Canonical Normalization Report -> docs/canonical-normalization.json');
