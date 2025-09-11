#!/usr/bin/env node
/**
 * ALT Text Lint
 * - Findet <img> Tags (multi-line sicher) in src/pages & src/components
 * - Meldet fehlende ALT Attribute, leere ALT ohne Dekorations-Kontext
 * - Erkennt dekorative Bilder (alt="" + role="presentation"|aria-hidden)
 * - Erkennt Ausdrucks-ALTs (alt={...}) und zählt sie getrennt
 * - Output: docs/alt-text-report.json
 * Nutzung:
 *   node scripts/alt-text-lint.js            # nur Report
 *   node scripts/alt-text-lint.js --fail     # Exit 1 bei Issues
 */
import fs from 'fs';
import { globby } from 'globby';

const patterns = ['src/pages/**/*.jsx','src/components/**/*.jsx'];

function extractImgTags(code){
  // Greedy über mehrere Zeilen, minimal bis erstes '>' (vereinfacht – ausreichend für unsere <img ... />)
  const r = /<img\b([\s\S]*?)>/g;
  const tags = [];
  let m;
  while((m = r.exec(code))){
    tags.push(m[0]);
  }
  return tags;
}

function classifyTag(tag){
  // Ignore Marker
  if(/data-alt-ignore|alt-lint-ignore/.test(tag)) return { ignore: true };
  const altAttr = tag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)'|{([^}]+)})/);
  if(!altAttr){
    return { issue: 'missing-alt' };
  }
  const literalVal = altAttr[2] ?? altAttr[3];
  const isExpression = !!altAttr[4];
  if(isExpression){
    return { ok: true, kind: 'expression' };
  }
  const val = (literalVal || '').trim();
  if(val === ''){
    // dekorativ erlaubt, wenn Präsentationsrolle
    const decorative = /(role\s*=\s*"presentation")|(aria-hidden\s*=\s*"true")/.test(tag);
    if(decorative){
      return { ok: true, kind: 'decorative-empty' };
    }
    return { issue: 'empty-alt' };
  }
  return { ok: true, kind: 'literal' };
}

async function run(){
  const files = await globby(patterns);
  const issues = [];
  let totalImages = 0;
  let stats = { literal:0, expression:0, decorative:0 };
  for(const file of files){
    const code = fs.readFileSync(file,'utf-8');
    const tags = extractImgTags(code);
    totalImages += tags.length;
    for(const tag of tags){
      const c = classifyTag(tag);
      if(c.ignore) continue;
      if(c.issue){
        issues.push({ file, issue: c.issue, snippet: tag.replace(/\s+/g,' ').slice(0,140)+'...' });
      } else if(c.ok){
        if(c.kind === 'literal') stats.literal++; else if(c.kind==='expression') stats.expression++; else if(c.kind==='decorative-empty') stats.decorative++;
      }
    }
  }
  const summary = {
    generated: new Date().toISOString(),
    filesScanned: files.length,
    totalImages,
    counts: {
      okLiteral: stats.literal,
      okExpression: stats.expression,
      okDecorativeEmpty: stats.decorative,
      issues: issues.length,
      missingAlt: issues.filter(i=>i.issue==='missing-alt').length,
      emptyAlt: issues.filter(i=>i.issue==='empty-alt').length
    },
    issues
  };
  fs.writeFileSync('docs/alt-text-report.json', JSON.stringify(summary,null,2));
  console.log(`ALT Text Report -> docs/alt-text-report.json | Images: ${totalImages} | Issues: ${issues.length}`);
  if(issues.length && process.argv.includes('--fail')){
    console.error('Alt text lint failures detected');
    process.exit(1);
  }
}
run();
