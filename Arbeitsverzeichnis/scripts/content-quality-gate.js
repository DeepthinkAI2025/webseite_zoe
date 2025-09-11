#!/usr/bin/env node
/**
 * Content Quality Gate Script
 * Prüft grundlegende Content-Qualität: Wortanzahl, Überschriften-Hierarchie, etc.
 */
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = 'src/pages';
const MIN_WORD_COUNT = 300; // Mindestwortanzahl für Pillar Pages
const reports = [];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.jsx');

  // Wortanzahl schätzen (sehr einfach)
  const wordCount = content.split(/\s+/).filter(word => word.length > 2).length;

  // Überschriften-Hierarchie prüfen
  const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
  const headingLevels = headings.map(h => parseInt(h.match(/h([1-6])/i)[1]));
  const hasProperHierarchy = headingLevels.every((level, i) =>
    i === 0 || level <= headingLevels[i-1] + 1
  );

  // Keywords check (einfach)
  const keywords = ['photovoltaik', 'solar', 'strom', 'anlage', 'kosten', 'förderung'];
  const keywordCount = keywords.filter(kw =>
    content.toLowerCase().includes(kw.toLowerCase())
  ).length;

  const report = {
    file: fileName,
    wordCount,
    headingsCount: headings.length,
    properHierarchy: hasProperHierarchy,
    keywordsFound: keywordCount,
    quality: wordCount >= MIN_WORD_COUNT && hasProperHierarchy ? 'good' : 'needs-improvement'
  };

  reports.push(report);
  return report;
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.jsx') && !file.includes('.lazy.')) {
      analyzeFile(filePath);
    }
  }
}

console.log('🔍 Content Quality Analysis...\n');

if (fs.existsSync(CONTENT_DIR)) {
  scanDirectory(CONTENT_DIR);
} else {
  console.error(`❌ Content directory ${CONTENT_DIR} not found`);
  process.exit(1);
}

// Bericht generieren
const outputPath = 'docs/content-quality-report.json';
fs.writeFileSync(outputPath, JSON.stringify({
  generated: new Date().toISOString(),
  summary: {
    totalFiles: reports.length,
    goodQuality: reports.filter(r => r.quality === 'good').length,
    needsImprovement: reports.filter(r => r.quality === 'needs-improvement').length
  },
  reports
}, null, 2));

console.log(`✅ Content Quality Report generated: ${outputPath}`);
console.log(`📊 Summary: ${reports.filter(r => r.quality === 'good').length}/${reports.length} files have good quality`);

// Exit code basierend auf Qualität
const hasPoorQuality = reports.some(r => r.quality === 'needs-improvement');
if (hasPoorQuality && process.argv.includes('--fail')) {
  console.error('❌ Some files need quality improvements');
  process.exit(1);
} else {
  console.log('✅ All files passed quality check');
}
