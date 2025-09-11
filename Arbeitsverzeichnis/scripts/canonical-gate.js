#!/usr/bin/env node
/**
 * Vergleicht canonical-normalization.json und fails falls Abweichungen zwischen original und canonical bestehen
 * (d.h. Parameter wurden entfernt -> Hinweis Prozess nötig). Optional --allow-slash toleriert trailing slash Unterschiede.
 */
import fs from 'fs';

const allowSlash = process.argv.includes('--allow-slash');
const path = 'docs/canonical-normalization.json';
if(!fs.existsSync(path)){
  console.error('Report fehlt. Bitte zuerst `npm run seo:canonical:normalize` ausführen.');
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(path,'utf-8'));
const offenders = report.entries.filter(e => e.original !== e.canonical && !(allowSlash && e.original.replace(/\/+$/,'')===e.canonical.replace(/\/+$/,'')));
if(offenders.length){
  console.error('Canonical Gate FAIL: ', offenders.length,'Abweichungen');
  offenders.slice(0,10).forEach(o=>console.error('→', o.original,'=>',o.canonical));
  process.exit(1);
}
console.log('Canonical Gate PASS');
