#!/usr/bin/env node
/**
 * Inject regional metrics block into existing city pages if not already present.
 */
import fs from 'fs';
import path from 'path';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(scriptDir, '..');
const pagesDir = path.join(projectRoot, 'src','app','standorte');
const dataFile = path.join(projectRoot,'src','content','geo','city-data.json');
if(!fs.existsSync(dataFile)){
  console.error('city-data.json fehlt');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(dataFile,'utf-8'));
const dataMap = new Map(data.map(d => [d.slug, d]));

const dirs = fs.readdirSync(pagesDir).filter(d => fs.statSync(path.join(pagesDir,d)).isDirectory());
let updated = 0;
for(const slug of dirs){
  const d = dataMap.get(slug);
  if(!d) continue;
  const file = path.join(pagesDir, slug, 'page.tsx');
  if(!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file,'utf-8');
  if(src.includes('Regionale Kennzahlen & Kontext')) continue; // already injected manually or via regen
  if(!src.includes('</main>')) continue;
  const block = `\n      <section className=\"mt-12\"><h2 className=\"text-xl font-semibold mb-4\">Regionale Kennzahlen & Kontext</h2><div className=\"grid md:grid-cols-2 gap-6 text-sm text-neutral-700\"><ul className=\"space-y-2\"><li><strong>Globalstrahlung:</strong> ${d.insolationKwhM2} kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> ${d.specificYieldRange} kWh/kWp</li><li><strong>Speicher Hinweis:</strong> ${d.storageAdoptionHint}</li></ul><ul className=\"space-y-2\"><li><strong>Netzanschluss Ablauf:</strong> ${d.gridProcessNote}</li><li><strong>Verschattungsrisiko:</strong> ${d.shadingRisk}</li><li><strong>Dachmix:</strong> ${d.roofMixNote}</li></ul></div></section>`;
  src = src.replace('</main>', block + '\n    </main>');
  fs.writeFileSync(file, src,'utf-8');
  updated++;
  console.log('Injected metrics block into', slug);
}
console.log('Fertig. Updated pages:', updated);
