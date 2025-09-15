#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

const SRC_DIR = path.join(process.cwd(), 'content', 'programmatic', 'foerderung');
let hadError = false;

function fail(msg){
  console.error('\x1b[31m✘ ' + msg + '\x1b[0m');
  hadError = true;
}
function ok(msg){
  console.log('\x1b[32m✔ ' + msg + '\x1b[0m');
}

if(!fs.existsSync(SRC_DIR)){
  console.log('Keine Förderungsquelle gefunden – skip');
  process.exit(0);
}

const files = fs.readdirSync(SRC_DIR).filter(f=>/\.ya?ml$/.test(f));
if(!files.length){
  console.log('Keine YAML Dateien – nichts zu prüfen');
  process.exit(0);
}

for(const f of files){
  const full = path.join(SRC_DIR, f);
  const raw = fs.readFileSync(full, 'utf8');
  let data;
  try{ data = parseYaml(raw); } catch(e){ fail(`${f}: YAML Parse Fehler: ${e.message}`); continue; }
  if(!data || typeof data !== 'object'){ fail(`${f}: Keine Objektstruktur`); continue; }
  const { title, slug, region, updated, programmes } = data;
  const baseSlug = f.replace(/\.ya?ml$/,'');
  if(!title) fail(`${f}: title fehlt`); else ok(`${f}: title ok`);
  if(!slug) fail(`${f}: slug fehlt`); else if(slug !== baseSlug) fail(`${f}: slug (${slug}) != Dateiname (${baseSlug})`); else ok(`${f}: slug ok`);
  if(!region) fail(`${f}: region fehlt`);
  if(!updated) fail(`${f}: updated fehlt`); else if(!/^\d{4}-\d{2}-\d{2}$/.test(updated)) fail(`${f}: updated kein ISO YYYY-MM-DD`);
  if(!Array.isArray(programmes) || !programmes.length) fail(`${f}: programmes leer/fehlt`);
  if(Array.isArray(programmes)){
    programmes.forEach((p,i)=>{
      if(!p.name) fail(`${f}: programmes[${i}].name fehlt`);
      if(p.source && typeof p.source !== 'string') fail(`${f}: programmes[${i}].source kein String`);
      if(p.confidence != null && (typeof p.confidence !== 'number' || p.confidence < 0 || p.confidence > 1)) fail(`${f}: programmes[${i}].confidence außerhalb 0..1`);
    });
  }
}

if(hadError){
  console.error('Validierung fehlgeschlagen');
  process.exit(1);
}
console.log('Alle Förderungs YAML Dateien valide.');
