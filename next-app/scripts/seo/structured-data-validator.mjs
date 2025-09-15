#!/usr/bin/env node
/**
 * Simple Structured Data Validator (Baseline)
 * - Lädt Seiten (lokal Dev Server oder prod URL)
 * - Extrahiert alle <script type="application/ld+json">
 * - Parsed JSON & listet @type Felder
 * - Prüft Minimalfelder für bekannte Typen (Organization, WebSite, Offer, OfferCatalog, FAQPage, BreadcrumbList, LocalBusiness)
 *
 * Nutzung:
 *   node scripts/seo/structured-data-validator.mjs --base http://localhost:3000 --paths / /pricing /technology /contact /projects /why-us
 */

import { argv } from 'node:process';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

function parseArgs() {
  const args = { base: 'http://localhost:3000', paths: ['/'] };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--base') args.base = argv[++i];
    else if (argv[i] === '--paths') {
      const list = [];
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) list.push(argv[++i]);
      if (list.length) args.paths = list;
    }
  }
  return args;
}

function minimalChecks(type, json) {
  const issues = [];
  switch (type) {
    case 'Organization':
      if (!json.name) issues.push('missing name');
      if (!json.url) issues.push('missing url');
      break;
    case 'WebSite':
      if (!json.name) issues.push('missing name');
      if (!json.potentialAction) issues.push('missing potentialAction');
      break;
    case 'Offer':
      if (!json.itemOffered) issues.push('missing itemOffered');
      break;
    case 'OfferCatalog':
      if (!Array.isArray(json.itemListElement)) issues.push('missing itemListElement');
      break;
    case 'FAQPage':
      if (!Array.isArray(json.mainEntity)) issues.push('missing mainEntity');
      break;
    case 'BreadcrumbList':
      if (!Array.isArray(json.itemListElement)) issues.push('missing itemListElement');
      break;
    case 'LocalBusiness':
      if (!json.address) issues.push('missing address');
      break;
  }
  return issues;
}

async function run() {
  const { base, paths } = parseArgs();
  const results = [];
  for (const p of paths) {
    const url = base.replace(/\/$/, '') + p;
    try {
      const res = await fetch(url);
      const html = await res.text();
      const dom = new JSDOM(html);
      const scripts = [...dom.window.document.querySelectorAll('script[type="application/ld+json"]')];
      const found = [];
      for (const s of scripts) {
        try {
          const json = JSON.parse(s.textContent || '{}');
          if (Array.isArray(json)) {
            json.forEach(j => found.push(j));
          } else {
            found.push(json);
          }
        } catch (e) {
          found.push({ error: 'parse_error', raw: s.textContent?.slice(0,100) });
        }
      }
      const types = found.map(j => j['@type']).flat();
      const validations = found.map(j => ({ type: j['@type'], issues: j['@type'] ? minimalChecks(j['@type'], j) : ['missing @type'] }));
      results.push({ path: p, count: found.length, types, validations });
    } catch (e) {
      results.push({ path: p, error: e.message });
    }
  }
  // Ausgabe kompakt
  console.log(JSON.stringify({ base, timestamp: new Date().toISOString(), pages: results }, null, 2));
}

run();