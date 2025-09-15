#!/usr/bin/env node
/**
 * Legacy Audit Script
 * Findet (informativ) verbleibende sicherheitsrelevante Muster in `src/legacy/**`.
 * Aktuell: dangerouslySetInnerHTML, inline JSON-LD Scripts.
 * Exit Code: 0 (informativ) – kann in Zukunft eskaliert werden.
 */
import { promises as fs } from 'fs';
import path from 'path';

const LEGACY_ROOT = path.join(process.cwd(), 'src', 'legacy');

async function collectFiles(dir) {
  let results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        results = results.concat(await collectFiles(full));
      } else if (/\.(t|j)sx?$|\.html?$/.test(e.name)) {
        results.push(full);
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') return results; // legacy folder fehlt ggf.
    throw err;
  }
  return results;
}

async function scanFile(file) {
  const content = await fs.readFile(file, 'utf8');
  const findings = [];

  const patterns = [
    { id: 'dangerouslySetInnerHTML', regex: /dangerouslySetInnerHTML/ },
    { id: 'inline-jsonld', regex: /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i },
  ];

  for (const p of patterns) {
    let match;
    const r = new RegExp(p.regex, 'gi');
    while ((match = r.exec(content)) !== null) {
      const line = content.slice(0, match.index).split(/\r?\n/).length;
      findings.push({ pattern: p.id, line });
    }
  }

  return findings.length ? { file: path.relative(process.cwd(), file), findings } : null;
}

async function main() {
  const files = await collectFiles(LEGACY_ROOT);
  const report = [];
  for (const f of files) {
    const res = await scanFile(f);
    if (res) report.push(res);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    legacyRoot: path.relative(process.cwd(), LEGACY_ROOT),
    fileCountScanned: files.length,
    filesWithFindings: report.length,
    findings: report,
  };

  console.log(JSON.stringify(summary, null, 2));
  console.error(`Legacy Audit: ${report.length} Dateien mit Findings (informativ)`);
  process.exit(0);
}

main().catch(err => {
  console.error('Legacy Audit Fehler:', err);
  process.exit(1);
});
