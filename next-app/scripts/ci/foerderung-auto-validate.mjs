#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

const AUTO_DIR = path.join(process.cwd(), 'content','programmatic','foerderung-auto');
let hadError = false;
function fail(m){ console.error('\x1b[31m✘ ' + m + '\x1b[0m'); hadError = true; }
function ok(m){ console.log('\x1b[32m✔ ' + m + '\x1b[0m'); }

if(!fs.existsSync(AUTO_DIR)){
  console.log('Keine auto YAML Quelle vorhanden – skip');
  process.exit(0);
}
const files = fs.readdirSync(AUTO_DIR).filter(f=>/\.auto\.ya?ml$/.test(f));
if(!files.length){ console.log('Keine auto Dateien gefunden.'); process.exit(0); }

for(const f of files){
  const full = path.join(AUTO_DIR,f);
  let data;
  try { data = parseYaml(fs.readFileSync(full,'utf8')); } catch(e){ fail(`${f}: YAML Parse Fehler ${e.message}`); continue; }
  if(!data || typeof data !== 'object'){ fail(`${f}: Keine Objektstruktur`); continue; }
  const { slug, region, updated_auto, programmes } = data;
  if(!slug) fail(`${f}: slug fehlt`); else ok(`${f}: slug ok`);
  if(!region) fail(`${f}: region fehlt`);
  if(!updated_auto) fail(`${f}: updated_auto fehlt`); else if(!/^\d{4}-\d{2}-\d{2}$/.test(updated_auto)) fail(`${f}: updated_auto kein ISO YYYY-MM-DD`);
  if(!Array.isArray(programmes) || !programmes.length) fail(`${f}: programmes leer/fehlt`);
  if(Array.isArray(programmes)){
    programmes.forEach((p,i)=> { if(!p.name) fail(`${f}: programmes[${i}].name fehlt`); });
  }
}

if(hadError){
  console.error('Auto Förderungs Validierung fehlgeschlagen');
  process.exit(1);
}
console.log('Alle Auto Förderungs YAML Dateien valide.');
