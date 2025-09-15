#!/usr/bin/env node
/**
 * Lead Export Aggregator
 * Liest alle Dateien: data/leads-YYYY-MM-DD.jsonl
 * Aggregiert: Gesamtanzahl, nach Tag, simples Score Histogramm, Domain-Verteilung.
 * Output: data/exports/leads-summary-{timestamp}.json & .csv
 *
 * Aufruf: node scripts/leads/export-leads.mjs
 */
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if(!fs.existsSync(dataDir)){
  console.error('Keine data/ Directory gefunden – Abbruch');
  process.exit(1);
}

const files = fs.readdirSync(dataDir).filter(f => /^leads-\d{4}-\d{2}-\d{2}\.jsonl$/.test(f)).sort();
if(!files.length){
  console.error('Keine Lead-Dateien gefunden');
  process.exit(1);
}

const all = [];
for(const file of files){
  const full = path.join(dataDir, file);
  const lines = fs.readFileSync(full,'utf-8').trim().split('\n').filter(Boolean);
  for(const line of lines){
    try { const obj = JSON.parse(line); all.push(obj); } catch {/* ignore */}
  }
}

const byDay = {};
const scoreHist = {};
const domainCount = {};

for(const lead of all){
  const day = (lead.ts || '').slice(0,10) || 'unknown';
  byDay[day] = (byDay[day]||0)+1;
  const scoreBucket = Math.round(lead.score || 0);
  scoreHist[scoreBucket] = (scoreHist[scoreBucket]||0)+1;
  if(lead.email){
    const domain = String(lead.email).split('@')[1] || 'unknown';
    domainCount[domain] = (domainCount[domain]||0)+1;
  }
}

// Attribution Analyse
const utmStats = { source:{}, medium:{}, campaign:{} };
for(const lead of all){
  if(lead.utm){
    if(lead.utm.source) utmStats.source[lead.utm.source] = (utmStats.source[lead.utm.source]||0)+1;
    if(lead.utm.medium) utmStats.medium[lead.utm.medium] = (utmStats.medium[lead.utm.medium]||0)+1;
    if(lead.utm.campaign) utmStats.campaign[lead.utm.campaign] = (utmStats.campaign[lead.utm.campaign]||0)+1;
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  total: all.length,
  days: byDay,
  scoreHistogram: scoreHist,
  topDomains: Object.entries(domainCount).sort((a,b)=>b[1]-a[1]).slice(0,15),
  utm: {
    topSources: Object.entries(utmStats.source).sort((a,b)=>b[1]-a[1]).slice(0,10),
    topMedium: Object.entries(utmStats.medium).sort((a,b)=>b[1]-a[1]).slice(0,10),
    topCampaign: Object.entries(utmStats.campaign).sort((a,b)=>b[1]-a[1]).slice(0,10)
  }
};

const exportDir = path.join(dataDir, 'exports');
fs.mkdirSync(exportDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:T]/g,'-').slice(0,19);
fs.writeFileSync(path.join(exportDir, `leads-summary-${stamp}.json`), JSON.stringify(summary, null, 2));

// Redaction Option: EMAIL_REDACT=1 ersetzt lokale Teile
const REDACT = process.env.EMAIL_REDACT === '1';

// CSV Export (Basisfelder + Attribution + Hash)
const csvLines = ['ts,email,emailHash,postcode,score,storageInterest,wallboxInterest,utmSource,utmMedium,utmCampaign,utmTerm,utmContent,referrer,landingPath'];
for(const lead of all){
  const safeEmail = REDACT && lead.email ? ('***@'+ lead.email.split('@')[1]) : lead.email;
  csvLines.push([
    lead.ts,
    safeEmail,
    lead.emailHash,
    lead.postcode,
    lead.score,
    lead.storageInterest,
    lead.wallboxInterest,
    lead.utm?.source || '',
    lead.utm?.medium || '',
    lead.utm?.campaign || '',
    lead.utm?.term || '',
    lead.utm?.content || '',
    lead.referrer || '',
    lead.landingPath || ''
  ].map(v => (v==null?'':String(v).replace(/"/g,'""'))).join(','));
}
fs.writeFileSync(path.join(exportDir, `leads-flat-${stamp}.csv`), csvLines.join('\n'), 'utf-8');

console.log(`Export abgeschlossen: ${all.length} Leads -> ${path.relative(process.cwd(), exportDir)}`);
