#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PAGES = ['/', '/why-us', '/technology', '/contact', '/wissen', '/foerderung', '/wirtschaftlichkeit'];
const OUT_DIR = path.join(process.cwd(), 'docs', 'lh');
fs.mkdirSync(OUT_DIR, { recursive: true });

function log(msg){ process.stdout.write(`[LH] ${msg}\n`); }

function run(cmd){ log(cmd); execSync(cmd, { stdio: 'inherit' }); }

// Start server
log('Building project...');
run('npm run build');
log('Starting server...');
const server = spawnSync('bash', ['-lc', 'PORT=4319 npm start & echo $!'], { encoding: 'utf-8' });
const pid = Number(server.stdout.trim().split('\n').pop());
if(!pid) { console.error('Server PID not found'); process.exit(1); }
log('Server PID: '+pid);

// give server time
await new Promise(r => setTimeout(r, 5000));

const results = [];
for(const page of PAGES){
  const url = `http://localhost:4319${page}`;
  const outJson = path.join(OUT_DIR, page.replace(/\//g,'_') || '_root') + '.json';
  try {
    log('Auditing '+url);
    run(`npx --yes lighthouse ${url} --only-categories=performance --output=json --quiet --form-factor=mobile --throttling-method=simulate --output-path=${outJson}`);
    const parsed = JSON.parse(fs.readFileSync(outJson, 'utf-8'));
    const lcp = parsed.audits['largest-contentful-paint'].numericValue;
    const fcp = parsed.audits['first-contentful-paint'].numericValue;
    const cls = parsed.audits['cumulative-layout-shift'].numericValue;
    results.push({ page, lcp, fcp, cls });
  } catch(e){
    log('Error auditing '+page+': '+e.message);
    results.push({ page, error: e.message });
  }
}

fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify({ ts: Date.now(), results }, null, 2));

try { process.kill(pid); } catch {}
log('Done.');
