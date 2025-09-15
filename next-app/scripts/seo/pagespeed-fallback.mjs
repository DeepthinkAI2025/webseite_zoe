#!/usr/bin/env node
/**
 * PageSpeed Insights Fallback Script (Stub)
 * Wenn ein PSI_API_KEY vorhanden ist, ruft das Skript für jede URL die PSI API auf
 * und extrahiert ausgewählte Kennzahlen. Ohne Key wird ein Hinweis ausgegeben.
 */
import fs from 'node:fs';
import { argv, env } from 'node:process';
import path from 'node:path';
import https from 'node:https';

function parseArgs() {
  const cfg = { base: 'https://example.com', paths: ['/', '/pricing', '/technology'], strategy: 'mobile' };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--base') cfg.base = argv[++i];
    if (argv[i] === '--paths') {
      const list = [];
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) list.push(argv[++i]);
      if (list.length) cfg.paths = list;
    }
    if (argv[i] === '--strategy') cfg.strategy = argv[++i];
  }
  return cfg;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  const { base, paths, strategy } = parseArgs();
  if (!env.PSI_API_KEY) {
    console.log('[pagespeed-fallback] Kein PSI_API_KEY gesetzt – Stub beendet. Setze export PSI_API_KEY=XXXX um Remote Messung zu aktivieren.');
    return;
  }
  const key = env.PSI_API_KEY;
  const results = [];
  for (const p of paths) {
    const url = base.replace(/\/$/, '') + p;
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url) + `&strategy=${strategy}&key=${key}`;
    try {
      const json = await fetchJson(api);
      const lighthouse = json.lighthouseResult || {};
      const audits = lighthouse.audits || {};
      results.push({
        path: p,
        url,
        performanceScore: lighthouse.categories?.performance?.score ?? null,
        metrics: {
          lcp: audits['largest-contentful-paint']?.numericValue,
          fcp: audits['first-contentful-paint']?.numericValue,
          cls: audits['cumulative-layout-shift']?.numericValue,
          tbt: audits['total-blocking-time']?.numericValue
        }
      });
      console.log('[pagespeed-fallback] ✓', url);
    } catch (err) {
      console.error('[pagespeed-fallback] Fehler für', url, err.message);
    }
  }
  const outDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `pagespeed-remote-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify({ generatedAt: new Date().toISOString(), base, strategy, pages: results }, null, 2));
  console.log('[pagespeed-fallback] Ergebnis gespeichert →', file);
}

run();