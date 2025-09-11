#!/usr/bin/env node
/**
 * Accessible Names Lint
 * Prüft Buttons und Links auf zugängliche Namen (sichtbarer Text, aria-label oder aria-labelledby)
 * Hinweise:
 *  - Scopes: src/pages (JSX) und src/components (JSX)
 *  - Report: docs/accessible-names-report.json
 *  - Exit 1 bei --fail, wenn Issues vorhanden sind
 */
import fs from 'fs';
import { globby } from 'globby';

const patterns = ['src/pages/**/*.jsx','src/components/**/*.jsx'];

function getTags(code, tag){
  const open = new RegExp(`<${tag}\\b`, 'g');
  const results = [];
  let m;
  while((m = open.exec(code))){
    const start = m.index;
    // naive capture until closing tag </tag> or self-closing
    const rest = code.slice(start);
    const selfCloseMatch = rest.match(new RegExp(`^<${tag}[^>]*?/\\s*>`));
    if(selfCloseMatch){
      results.push(selfCloseMatch[0]);
      open.lastIndex = start + selfCloseMatch[0].length;
      continue;
    }
    const closeIdx = rest.search(new RegExp(`</${tag}>`));
    if(closeIdx !== -1){
      results.push(rest.slice(0, closeIdx + (`</${tag}>`).length));
      open.lastIndex = start + closeIdx + (`</${tag}>`).length;
    } else {
      // fallback: take next '>'
      const end = rest.indexOf('>');
      if(end !== -1) results.push(rest.slice(0, end+1));
      break;
    }
  }
  return results;
}

function hasAttr(tag, name){
  return new RegExp(`\\b${name}\\s*=`, 'i').test(tag);
}
function getAttrVal(tag, name){
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|{([^}]+)})`, 'i'));
  if(!m) return { type: 'none', value: '' };
  if(m[4]) return { type: 'expr', value: m[4] };
  return { type: 'lit', value: (m[2] ?? m[3] ?? '').trim() };
}

function innerTextApprox(tag){
  // Entferne äußeres <tag ...> und </tag>
  const body = tag.replace(/^<[^>]+>/,'').replace(/<\/[a-zA-Z0-9:-]+>\s*$/,'');
  // Entferne alle Tags, aber behalte Text
  const text = body
    .replace(/<script[\s\S]*?<\/script>/g,' ')
    .replace(/<style[\s\S]*?<\/style>/g,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/\{[\s\S]*?\}/g,' ')
    .replace(/&[a-z]+;?/gi,' ')
    .replace(/\s+/g,' ')
    .trim();
  return text;
}

function likelyIconOnly(tag){
  // Inhalt ohne Text, nur SVGs/Icons
  const body = tag.replace(/^<[^>]+>/,'').replace(/<\/[a-zA-Z0-9:-]+>\s*$/,'');
  const text = body.replace(/<svg[\s\S]*?<\/svg>/g,' ').replace(/<[^>]+>/g,' ').replace(/\{[\s\S]*?\}/g,' ').trim();
  return text.length === 0;
}

(async () => {
  const files = await globby(patterns);
  const issues = [];
  let scanned = 0;
  for(const file of files){
    const code = fs.readFileSync(file,'utf-8');
    const buttons = getTags(code, 'button');
    const anchors = getTags(code, 'a');
    const all = buttons.map(t=>({kind:'button', tag:t})).concat(anchors.map(t=>({kind:'link', tag:t})));
    for(const {kind, tag} of all){
      scanned++;
      if(/accessible-names-ignore/.test(tag)) continue;
      const ariaHidden = getAttrVal(tag,'aria-hidden');
      if(ariaHidden.type==='lit' && ariaHidden.value === 'true') continue; // nicht sichtbar -> ignorieren
      // für Links sicherstellen, dass interaktiv (href oder role="link")
      if(kind==='link' && !hasAttr(tag,'href') && !/role\s*=\s*"link"/i.test(tag)) continue;

      const label = getAttrVal(tag, 'aria-label');
      const labelledby = getAttrVal(tag, 'aria-labelledby');
      const text = innerTextApprox(tag);

      if(label.type==='lit' && label.value === ''){
        issues.push({ file, kind, issue: 'empty-aria-label', snippet: tag.replace(/\s+/g,' ').slice(0,160)+'...' });
        continue;
      }

      const hasName = (label.type!=='none') || (labelledby.type!=='none') || (text.length > 0);
      if(!hasName){
        // icon-only?
        if(likelyIconOnly(tag)){
          issues.push({ file, kind, issue: 'missing-name-icon-only', snippet: tag.replace(/\s+/g,' ').slice(0,160)+'...' });
        } else {
          issues.push({ file, kind, issue: 'missing-name', snippet: tag.replace(/\s+/g,' ').slice(0,160)+'...' });
        }
      }
    }
  }

  const summary = {
    generated: new Date().toISOString(),
    filesScanned: files.length,
    elementsChecked: scanned,
    issuesCount: issues.length,
    issues
  };
  fs.writeFileSync('docs/accessible-names-report.json', JSON.stringify(summary, null, 2));
  console.log(`Accessible Names Report -> docs/accessible-names-report.json | Elements: ${scanned} | Issues: ${issues.length}`);
  if(issues.length && process.argv.includes('--fail')){
    process.exit(1);
  }
})();
