#!/usr/bin/env node
/**
 * Icon Usage Audit
 * Ziel: Auflisten aller direkten `lucide-react` Imports gegenüber zentralem `@/components/icons` Barrel.
 * Liefert JSON Report mit: file, imported, count, suggestion.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src');
const TARGET = 'lucide-react';
const report = [];

function walk(dir){
  for(const entry of fs.readdirSync(dir)){
    const abs = path.join(dir, entry);
    const stat = fs.statSync(abs);
    if(stat.isDirectory()) { walk(abs); continue; }
    if(!/\.(jsx?|tsx?)$/.test(entry)) continue;
    const content = fs.readFileSync(abs,'utf-8');
    const regex = /import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"]/g;
    let m; let any=false;
    while((m = regex.exec(content))){
      any = true;
      const names = m[1].split(',').map(s=>s.trim()).filter(Boolean);
      report.push({ file: abs.replace(ROOT+'/',''), imported: names, count: names.length, suggestion: 'Importiere aus \'@/components/icons\' für Tree-Shaking Kontrolle.' });
    }
    // Default import or namespace import check
    if(/from\s+['\"]lucide-react['\"]/.test(content) && !any){
      report.push({ file: abs.replace(ROOT+'/',''), imported: ['*unknown pattern*'], count: 1, suggestion: 'Rewrite auf named imports via @/components/icons.' });
    }
  }
}

walk(ROOT);
const out = { generated: new Date().toISOString(), totalFiles: report.length, entries: report };
if(!fs.existsSync('docs')) fs.mkdirSync('docs');
fs.writeFileSync('docs/icon-usage-report.json', JSON.stringify(out,null,2));
console.log('Icon Usage Report -> docs/icon-usage-report.json');