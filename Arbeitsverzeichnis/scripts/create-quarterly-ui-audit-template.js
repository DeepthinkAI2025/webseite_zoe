#!/usr/bin/env node
// create-quarterly-ui-audit-template.js
// Erstellt/aktualisiert ein Markdown Template für den quartalsweisen UI Audit.
// Dateiname: docs/ui-audit-Q{quarter}-{year}.md
// Überschreibt existierende Datei nur, wenn --force gesetzt.

import fs from 'fs';
import path from 'path';

const FORCE = process.argv.includes('--force');
const now = new Date();
const quarter = Math.floor(now.getMonth()/3)+1;
const year = now.getFullYear();
const fileName = `ui-audit-Q${quarter}-${year}.md`;
const docsDir = path.resolve('docs');
if(!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);
const filePath = path.join(docsDir,fileName);

if(fs.existsSync(filePath) && !FORCE){
  console.log('[quarterly-audit] Datei existiert bereits:', filePath);
  process.exit(0);
}

const template = `# UI Quarterly Audit – Q${quarter} ${year}\n\nErstellt: ${now.toISOString()}\n\n## 1. Accessibility Snapshot\n- Axe Violations: <!-- eintragen -->\n- Lighthouse A11y Scores: <!-- referenz docs/lighthouse-a11y-scores.json -->\n\n## 2. Performance KPIs\n- LCP (P75): <!-- Wert aus RUM extrahieren -->\n- INP (P75): <!-- -->\n- CLS (P75): <!-- -->\n\n## 3. Design System Hygiene\n- Unzulässige Farb-Varianten: <!-- audit:colors -->\n- Box Shadow Duplikate: <!-- css-redundancy-report.json -->\n- Spacing Standardisierung: <!-- spacing-audit-report.json -->\n\n## 4. Komponenten Status\n| Komponente | Status | Notes |\n|-----------|--------|-------|\n| Drawer | | |\n| Chat | | |\n| SmartPlanner | | |\n\n## 5. Theming / Dark Mode Fortschritt\n- Implementierte Token: <!-- -->\n- Ausstehende Bereiche: <!-- -->\n\n## 6. Risiken & Action Items (nächste Iteration)\n- [ ] <!-- -->\n- [ ] <!-- -->\n\n## 7. Diff Referenzen\n- CSS Payload: docs/css-payload-report.json\n- Critical Render: docs/critical-render-report.json\n- Redundanz: docs/css-redundancy-report.json\n\n---\nAutomatisch generiert durch create-quarterly-ui-audit-template.js\n`;

fs.writeFileSync(filePath, template);
console.log('[quarterly-audit] Template erstellt/aktualisiert:', filePath);
