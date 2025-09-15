#!/usr/bin/env node
// Aggregiert Kernmetriken aus vorhandenen Report-Dateien falls vorhanden.
import fs from 'fs';

function safeRead(file){
  try { return JSON.parse(fs.readFileSync(file,'utf-8')); } catch { return null; }
}

const lighthouse = safeRead('weekly-lh-home.json');
const structured = safeRead('weekly-structured.json');
const links = safeRead('weekly-links.json');

const summary = {
  generatedAt: new Date().toISOString(),
  lighthouse: lighthouse ? {
    performance: lighthouse.categories?.performance?.score ?? null,
    accessibility: lighthouse.categories?.accessibility?.score ?? null,
    bestPractices: lighthouse.categories?.['best-practices']?.score ?? null,
    seo: lighthouse.categories?.seo?.score ?? null
  } : null,
  structuredDataErrors: structured?.errors?.length ?? null,
  brokenLinks: links?.broken?.length ?? null
};

fs.writeFileSync('weekly-kpi-summary.json', JSON.stringify(summary,null,2));
console.log('Wrote weekly-kpi-summary.json');
