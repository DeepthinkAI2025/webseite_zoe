#!/usr/bin/env node
/**
 * Lighthouse A11y Quick Summary
 * Liest alle JSON Reports in docs/lighthouse-a11y und extrahiert nur Audits mit score === 0.
 * Ausgabe: docs/lighthouse-a11y-quick-summary.json + Console pretty print.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportsDir = path.resolve(__dirname,'..','Arbeitsverzeichnis','docs','lighthouse-a11y');
if(!fs.existsSync(reportsDir)){
  console.error('[lh-a11y-quick] Verzeichnis nicht gefunden:', reportsDir);
  process.exit(1);
}

const files = fs.readdirSync(reportsDir).filter(f=> f.endsWith('.json'));
const summary = [];
for(const f of files){
  try {
    const json = JSON.parse(fs.readFileSync(path.join(reportsDir,f),'utf-8'));
    if(!json.audits) continue; // skip aggregate summary file (hat audits? aggregate hat es nicht)
    const failing = Object.values(json.audits)
      .filter(a=> a && a.score === 0)
      .map(a=> ({
        id: a.id,
        title: a.title,
        items: a.details && Array.isArray(a.details.items) ? a.details.items.slice(0,10).map(it=> ({
          selector: it?.node?.selector,
          snippet: it?.node?.snippet,
          explanation: it?.node?.explanation?.split('\n')[0]
        })) : []
      }));
    summary.push({ report: f, page: json.finalDisplayedUrl || json.finalUrl, failing });
  } catch(e){
    // ignore parse errors
  }
}
const out = { generated: new Date().toISOString(), count: summary.length, reports: summary };
const outFile = path.resolve(__dirname,'..','Arbeitsverzeichnis','docs','lighthouse-a11y-quick-summary.json');
fs.writeFileSync(outFile, JSON.stringify(out,null,2));
console.log('[lh-a11y-quick] Summary geschrieben ->', path.relative(process.cwd(), outFile));
for(const r of summary){
  console.log('\n#', r.report);
  r.failing.forEach(f=> {
    console.log('-', f.id, '::', f.title);
    f.items.forEach(it=> console.log('   •', it.selector, '=>', it.explanation));
  });
}
