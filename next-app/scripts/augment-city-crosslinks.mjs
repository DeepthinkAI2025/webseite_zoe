#!/usr/bin/env node
/**
 * Inject cross-link section into existing city pages if cluster data present and block missing.
 */
import fs from 'fs';
import path from 'path';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(scriptDir, '..');
const pagesDir = path.join(projectRoot, 'src','app','standorte');
const clusterFile = path.join(projectRoot,'src','content','geo','city-clusters.json');
if(!fs.existsSync(clusterFile)){
  console.error('No cluster file found, abort');
  process.exit(1);
}
const clusters = JSON.parse(fs.readFileSync(clusterFile,'utf-8'));

function related(slug){
  for(const c of clusters){
    if(c.cities?.includes(slug)){
      return c.crosslink?.[slug] || [];
    }
  }
  return [];
}

const files = fs.readdirSync(pagesDir).filter(f=>fs.statSync(path.join(pagesDir,f)).isDirectory());
let changed = 0;
for(const slug of files){
  const file = path.join(pagesDir, slug, 'page.tsx');
  if(!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file,'utf-8');
  if(src.includes('Weitere Standorte (Region)')) continue; // already has block
  const rel = related(slug);
  if(!rel.length) continue;
  const listItems = rel.map(s=>`<li><a className=\"text-blue-600 underline\" href=\"/standorte/${s}\">Photovoltaik ${s.charAt(0).toUpperCase()+s.slice(1)}</a></li>`).join('');
  const inject = `\n      <section className=\"mt-12\"><h2 className=\"text-xl font-semibold mb-4\">Weitere Standorte (Region)</h2><ul className=\"list-disc pl-5 space-y-1 text-sm\">${listItems}</ul></section>`;
  // naive injection before closing main tag
  if(src.includes('</main>')){
    src = src.replace('</main>', `${inject}\n    </main>`);
    fs.writeFileSync(file, src, 'utf-8');
    changed++;
    console.log('Injected cross-links into', slug);
  }
}
console.log('Done. Updated', changed, 'pages.');
