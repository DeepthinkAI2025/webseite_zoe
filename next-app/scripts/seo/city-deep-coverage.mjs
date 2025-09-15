#!/usr/bin/env node
/**
 * City Deep Content Coverage Report
 * Ermittelt Anteil der City Landing Pages mit Kennzahlen-Block Datenquelle.
 *
 * Output:
 *  - docs/city-deep-coverage.json
 *  - docs/city-deep-coverage.md (Markdown KPI + Tabelle fehlender Städte)
 *  - Optional Badge Injection in README (Marker <!-- CITY_DEEP_COVERAGE_BADGE -->) wenn --inject gesetzt
 */
import fs from 'fs';
import path from 'path';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(scriptDir, '..', '..');
const contentDir = path.join(projectRoot, 'src', 'content', 'geo');
const cityDataFile = path.join(contentDir, 'city-data.json');
const citiesFile = path.join(contentDir, 'cities.json');
const docsDir = path.join(projectRoot, 'docs');
const outJson = path.join(docsDir, 'city-deep-coverage.json');
const outMd = path.join(docsDir, 'city-deep-coverage.md');
const readme = path.join(projectRoot, 'README.md');

if(!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

function loadJson(f){
  return JSON.parse(fs.readFileSync(f,'utf-8'));
}

const cityData = loadJson(cityDataFile);
const cities = loadJson(citiesFile);

const dataMap = new Map(cityData.map(c => [c.slug, c]));

const coverageEntries = cities.map(c => ({ slug: c.slug, hasData: dataMap.has(c.slug) }));
const withData = coverageEntries.filter(e => e.hasData).length;
const total = coverageEntries.length;
const coveragePct = total ? (withData / total * 100) : 0;

const missing = coverageEntries.filter(e => !e.hasData).map(e => e.slug).sort();

const json = {
  generatedAt: new Date().toISOString(),
  withData,
  total,
  coveragePct: parseFloat(coveragePct.toFixed(2)),
  missing
};
fs.writeFileSync(outJson, JSON.stringify(json,null,2)+'\n');

let badgeColor = 'red';
if(coveragePct >= 80) badgeColor = 'green';
else if(coveragePct >= 50) badgeColor = 'yellow';
else if(coveragePct >= 30) badgeColor = 'orange';

const badge = `![Deep Content Coverage ${json.coveragePct}%](https://img.shields.io/badge/deep--content-${encodeURIComponent(json.coveragePct+'%')}-${badgeColor})`;

let md = `# City Deep Content Coverage\n\n`;
md += `Coverage: ${json.coveragePct}% (${withData}/${total})\\n\\n`;
md += badge + `\n\n`;
if(missing.length){
  md += `## Fehlende Städte (${missing.length})\n\n`;
  md += missing.map(s => `- ${s}`).join('\n') + '\n';
} else {
  md += `Alle Städte besitzen einen Deep Content Datensatz.\n`;
}
fs.writeFileSync(outMd, md);
console.log('Coverage JSON:', outJson);
console.log('Coverage MD:', outMd);
console.log('Badge:', badge);

// Optional README Injection
const inject = process.argv.includes('--inject');
if(inject){
  if(fs.existsSync(readme)){
    let r = fs.readFileSync(readme,'utf-8');
    const marker = '<!-- CITY_DEEP_COVERAGE_BADGE -->';
    if(r.includes(marker)){
      r = r.replace(marker, `${marker}\n\n${badge}`);
      fs.writeFileSync(readme, r);
      console.log('Badge in README injiziert.');
    } else {
      console.warn('Marker nicht gefunden. Bitte Marker einfügen:', marker);
    }
  }
}
