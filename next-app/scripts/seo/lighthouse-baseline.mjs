#!/usr/bin/env node
/**
 * Lighthouse Baseline Script
 * Führt Lighthouse für definierte Pfade aus (Performance, SEO) und extrahiert Kerne Metriken.
 * Hinweis: Erwartet laufenden Dev- oder Preview-Server (z.B. http://localhost:3000).
 */

import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';

let lighthouse; // dynamischer Import (ESM)
let chromeLauncher;
let chromeAvailable = true;
try {
  ({ default: lighthouse } = await import('lighthouse'));
  ({ launch: chromeLauncher } = await import('chrome-launcher'));
} catch (e) {
  chromeAvailable = false;
}

function parseArgs() {
  const cfg = { base: 'http://localhost:3000', paths: ['/', '/pricing', '/technology', '/contact', '/projects', '/why-us'] };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--base') cfg.base = argv[++i];
    if (argv[i] === '--paths') {
      const list = [];
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) list.push(argv[++i]);
      if (list.length) cfg.paths = list;
    }
  }
  return cfg;
}

function extractMetrics(lhr) {
  const audits = lhr.audits;
  const get = id => audits[id]?.numericValue;
  return {
    performance: lhr.categories.performance?.score ?? null,
    seo: lhr.categories.seo?.score ?? null,
    accessibility: lhr.categories.accessibility?.score ?? null,
    bestPractices: lhr.categories['best-practices']?.score ?? null,
    pwa: lhr.categories.pwa?.score ?? null,
    metrics: {
      lcp: get('largest-contentful-paint'),
      fcp: get('first-contentful-paint'),
      tbt: get('total-blocking-time'),
      cls: get('cumulative-layout-shift'),
      speedIndex: get('speed-index'),
      interactive: get('interactive')
    }
  };
}

async function run() {
  const { base, paths } = parseArgs();
  if (!chromeAvailable) {
    const fallback = {
      generatedAt: new Date().toISOString(),
      base,
      warning: 'Chrome/Chromium nicht verfügbar – bitte lokal mit installiertem Browser erneut ausführen oder CHROME_PATH setzen.',
      guidance: 'npm i -D puppeteer && CHROME_PATH=$(node -p "require(\'puppeteer\').executablePath()") node scripts/seo/lighthouse-baseline.mjs'
    };
    const outDirFb = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(outDirFb)) fs.mkdirSync(outDirFb, { recursive: true });
    const fileFb = path.join(outDirFb, `lighthouse-baseline-fallback-${Date.now()}.json`);
    fs.writeFileSync(fileFb, JSON.stringify(fallback, null, 2));
    console.log('Fallback Report erstellt →', fileFb);
    return;
  }
  const results = [];
  let chrome;
  const chromePath = process.env.CHROME_PATH;
  try {
    chrome = await chromeLauncher({
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      chromePath: chromePath || undefined
    });
  } catch (err) {
    const fallback = {
      generatedAt: new Date().toISOString(),
      base,
      warning: 'Chrome konnte nicht gestartet werden.',
      error: err?.message,
      guidance: 'Setze CHROME_PATH oder installiere puppeteer: npm i -D puppeteer; export CHROME_PATH=$(node -p "require(\'puppeteer\').executablePath()")'
    };
    const outDirFb = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(outDirFb)) fs.mkdirSync(outDirFb, { recursive: true });
    const fileFb = path.join(outDirFb, `lighthouse-baseline-fallback-${Date.now()}.json`);
    fs.writeFileSync(fileFb, JSON.stringify(fallback, null, 2));
    console.log('Fallback Report erstellt →', fileFb);
    return;
  }
  try {
    for (const p of paths) {
      const url = base.replace(/\/$/, '') + p;
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance', 'seo', 'accessibility']
      });
      const summary = extractMetrics(runnerResult.lhr);
      results.push({ path: p, url, summary });
    }
  } finally {
    await chrome.kill();
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    base,
    pages: results
  };
  const outDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `lighthouse-baseline-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2));
  try {
    fs.writeFileSync(path.join(outDir, 'lighthouse-baseline-current.json'), JSON.stringify(snapshot, null, 2));
  } catch {}
  console.log('Lighthouse Baseline gespeichert →', file);
}

run();