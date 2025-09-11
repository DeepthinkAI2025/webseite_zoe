#!/usr/bin/env node
/**
 * Tabindex Audit
 * Ziele:
 *  - Finde Vorkommen von tabIndex / tabindex > 0 (antipattern)
 *  - Melde tabIndex={-1} als Hinweis (ok, aber prüfen)
 * Hinweise:
 *  - Scopes: src/pages (JSX) und src/components (JSX)
 *  - Report: docs/tabindex-report.json
 *  - --fail: Exit 1 bei Findings mit severity=error
 */
import fs from 'fs';
import { globby } from 'globby';

const patterns = ['src/pages/**/*.jsx','src/components/**/*.jsx'];

function scanFile(file){
  const code = fs.readFileSync(file, 'utf-8');
  const findings = [];
  const re = /(tabIndex|tabindex)\s*=\s*("([^"]*)"|'([^']*)'|{([^}]+)})/g;
  let m;
  while((m = re.exec(code))){
    const raw = m[0];
    const valLit = m[3] ?? m[4];
    const valExpr = m[5];
    let val = null;
    if(valLit != null){
      const parsed = parseInt(String(valLit).trim(), 10);
      if(!Number.isNaN(parsed)) val = parsed;
    } else if(valExpr){
      // simple parse for numeric literals in expressions (e.g., {1}, {-1})
      const numMatch = valExpr.match(/^-?\d+$/);
      if(numMatch) val = parseInt(numMatch[0], 10);
    }
    if(val == null) {
      findings.push({ file, issue: 'tabindex-non-numeric', severity: 'warn', snippet: raw });
      continue;
    }
    if(val > 0){
      findings.push({ file, issue: 'tabindex-positive', severity: 'error', value: val, snippet: raw });
    } else if(val === -1){
      findings.push({ file, issue: 'tabindex-negative', severity: 'warn', value: val, snippet: raw });
    } else if(val === 0){
      // allowed, but rare in React since default focus order; keep as info
      findings.push({ file, issue: 'tabindex-zero', severity: 'info', value: val, snippet: raw });
    }
  }
  return findings;
}

(async () => {
  const files = await globby(patterns);
  const all = [];
  for(const f of files){
    all.push(...scanFile(f));
  }
  const errors = all.filter(f=>f.severity==='error');
  const out = { generated: new Date().toISOString(), filesScanned: files.length, findings: all, counts: { error: errors.length, warn: all.filter(f=>f.severity==='warn').length, info: all.filter(f=>f.severity==='info').length } };
  fs.writeFileSync('docs/tabindex-report.json', JSON.stringify(out, null, 2));
  console.log(`Tabindex Report -> docs/tabindex-report.json | errors: ${out.counts.error}, warns: ${out.counts.warn}, info: ${out.counts.info}`);
  if(errors.length && process.argv.includes('--fail')) process.exit(1);
})();
