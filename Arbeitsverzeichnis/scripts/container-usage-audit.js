#!/usr/bin/env node
/**
 * Container Usage Audit
 * Sucht nach verbliebenen Layout-Wrapper Patterns (max-w-7xl, max-w-screen-xl etc.)
 * und gibt einen strukturierten JSON + Text Report aus.
 */
import { globby } from 'globby';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src');
const PATTERNS = [
  /max-w-7xl\s+mx-auto\s+px-4\s+sm:px-6\s+lg:px-8/g,
  /max-w-screen-xl\s+mx-auto\s+px-4\s+sm:px-6\s+lg:px-8/g,
  /max-w-6xl\s+mx-auto\s+px-4\s+sm:px-6\s+lg:px-8/g
];

async function run(){
  const files = await globby(['src/**/*.{jsx,tsx}'], { gitignore: true });
  const results = [];
  for(const file of files){
    const content = fs.readFileSync(file,'utf8');
    const matches = [];
    PATTERNS.forEach((re)=>{
      let m;
      while((m = re.exec(content))){
        const before = content.lastIndexOf('\n', m.index) + 1;
        const after = content.indexOf('\n', m.index);
        const line = content.slice(0, m.index).split('\n').length;
        matches.push({ pattern: re.source, snippet: content.slice(before, after === -1 ? undefined : after).trim(), line });
      }
    });
    if(matches.length){
      results.push({ file, matches });
    }
  }
  const outDir = path.resolve(process.cwd(),'../docs');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, 'container-usage-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ generated: new Date().toISOString(), totalFilesScanned: files.length, occurrences: results }, null, 2));

  if(results.length === 0){
    console.log('✅ Keine Legacy Container Wrapper mehr gefunden.');
  } else {
    console.log(`⚠️  Gefundene Wrapper-Vorkommen: ${results.reduce((a,r)=>a+r.matches.length,0)}`);
    results.forEach(r=>{
      console.log('\n' + r.file);
      r.matches.forEach(m=>{
        console.log(`  Linie ${m.line}: ${m.snippet}`);
      });
    });
    console.log(`\nJSON Report: ${jsonPath}`);
  }
}
run().catch(e=>{ console.error(e); process.exit(1); });
