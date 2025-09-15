#!/usr/bin/env node
/**
 * Brand Mention History
 * Liest gaio-brand-mention.json und aktualisiert brand-history.json + brand-sparkline.md
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const docsDir = path.join(root,'docs');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; } }

const brand = readJson(path.join(docsDir,'gaio-brand-mention.json'));
if(!brand){
  console.error('Keine brand mention JSON gefunden');
  process.exit(0);
}

const histFile = path.join(docsDir,'brand-history.json');
let history=[];
try { history = JSON.parse(fs.readFileSync(histFile,'utf8')); if(!Array.isArray(history)) history=[]; } catch {}

const entry={ date: new Date().toISOString(), ratio: brand.ratio };
history.push(entry);
if(history.length>200) history = history.slice(-200);
fs.writeFileSync(histFile, JSON.stringify(history,null,2),'utf8');

// Sparkline
function spark(values){
  const blocks=['▁','▂','▃','▄','▅','▆','▇','█'];
  const min=Math.min(...values); const max=Math.max(...values); const span=max-min || 1;
  return values.map(v=> blocks[Math.min(blocks.length-1, Math.floor(( (v-min)/span)*blocks.length ))]).join('');
}
const ratios = history.map(h=>typeof h.ratio==='number'?h.ratio:0);
const line = 'Brand Mentions Ratio Sparkline: ' + spark(ratios) + ' (neu: ' + (brand.ratio*100).toFixed(0)+'%)';
fs.writeFileSync(path.join(docsDir,'brand-sparkline.md'), line+'\n','utf8');

console.log(line);
