#!/usr/bin/env node
/**
 * Simpler Markdown -> HTML Export (nur Basis: Überschriften, Listen, Code, Tabellen, Absätze)
 * Nutzung: node md-to-html.mjs input.md > output.html
 */
import fs from 'fs';

const file = process.argv[2];
if(!file){
  console.error('Usage: node md-to-html.mjs <file.md>');
  process.exit(1);
}
const src = fs.readFileSync(file,'utf8');

function escapeHtml(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

const lines = src.split(/\r?\n/);
let out = [];
let inCode = false;
for(const l of lines){
  if(l.startsWith('```')){
    if(!inCode){ inCode = true; out.push('<pre><code>'); }
    else { inCode=false; out.push('</code></pre>'); }
    continue;
  }
  if(inCode){ out.push(escapeHtml(l)); continue; }
  const m = l.match(/^(#{1,6})\s+(.*)$/);
  if(m){ out.push(`<h${m[1].length}>${escapeHtml(m[2])}</h${m[1].length}>`); continue; }
  if(/^\s*-\s+/.test(l)){
    // einfache ungeordnete Liste – Sammeln bis Blockende
    if(out[out.length-1]!=='<ul>') out.push('<ul>');
    out.push(`<li>${escapeHtml(l.replace(/^\s*-\s+/,''))}</li>`);
    continue;
  } else if(out[out.length-1]==='<ul>'){
    out.push('</ul>');
  }
  if(/\|/.test(l) && /---|===/.test(l) && l.includes('|')){ // Tabellen-Trenner ignorieren
    continue;
  }
  if(l.trim().startsWith('|')){
    // naive Tabellenverarbeitung
    const cells = l.split('|').slice(1,-1).map(c=>c.trim());
    if(out[out.length-1] !== '<table>') out.push('<table>');
    out.push('<tr>' + cells.map(c=>`<td>${escapeHtml(c)}</td>`).join('') + '</tr>');
    continue;
  } else if(out[out.length-1]==='<table>'){
    out.push('</table>');
  }
  if(l.trim()===''){ out.push('<br/>'); continue; }
  out.push(`<p>${escapeHtml(l)}</p>`);
}
if(out[out.length-1]==='<ul>') out.push('</ul>');
if(out[out.length-1]==='<table>') out.push('</table>');

const html = `<!DOCTYPE html><html lang="de"><meta charset="utf-8"/><title>Export</title><style>body{font-family:system-ui,Arial,sans-serif;max-width:860px;margin:40px auto;line-height:1.5;padding:0 16px;}code,pre{background:#f5f5f5;}table{border-collapse:collapse;margin:16px 0;}td{border:1px solid #ccc;padding:4px 8px;}h1,h2,h3{line-height:1.2;}ul{margin:0 0 1em 1.2em;}p{margin:0 0 .9em;}pre{padding:12px;overflow:auto;}</style><body>` + out.join('\n') + '</body></html>';
console.log(html);
