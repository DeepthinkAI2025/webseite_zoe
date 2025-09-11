#!/usr/bin/env node
/**
 * Focus Audit (AST Version)
 * Nutzt @babel/parser + @babel/traverse um JSX Elemente robust zu analysieren
 * und interaktive Elemente ohne klaren Fokus-Stil zu melden.
 * Reduziert False Positives gegenüber Regex-Heuristik.
 */
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default || traverseModule;

const ROOTS = [
  path.resolve(process.cwd(), 'src'),
  path.resolve(process.cwd(), 'Arbeitsverzeichnis', 'src')
].filter(p => fs.existsSync(p));

if (!ROOTS.length) {
  console.error('❌ Kein src Verzeichnis gefunden.');
  process.exit(0);
}

const EXT = /\.(jsx|tsx)$/;
const INTERACTIVE_TAGS = new Set(['a','button','input','select','textarea']);
const ROLE_INTERACTIVE = new Set(['button','link','tab','switch','checkbox','radio']);
const FOCUS_HINT = /(focus-visible|focus:ring|focus:ring-|focus:outline|focus:outline-|focus:shadow|focus-ring)/;
const CLASS_WHITELIST = ['sr-only','pointer-events-none'];

const findings = [];

function collectFiles(dir){
  const out = [];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.')) continue;
    const full = path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...collectFiles(full));
    else if(EXT.test(entry.name)) out.push(full);
  }
  return out;
}

function extractClassValue(attr){
  if(!attr) return '';
  const val = attr.value;
  if(!val) return '';
  // className="..."
  if(val.type === 'StringLiteral') return val.value;
  // className={`...`}
  if(val.type === 'JSXExpressionContainer'){
    const expr = val.expression;
    if(expr.type === 'TemplateLiteral'){
      if(expr.expressions.length === 0){
        return expr.quasis.map(q=>q.value.cooked).join('');
      }
      // Gemischte Template Literals -> statische Teile + Platzhalter Marker
      return expr.quasis.map((q,i)=> q.value.cooked + (expr.expressions[i] ? `__EXPR${i}__` : '')).join('');
    }
    if(expr.type === 'StringLiteral') return expr.value;
    if(expr.type === 'BinaryExpression'){ // einfache Verkettungen "a"+"b"
      try {
        const reconstructed = reconstructBinary(expr);
        return reconstructed;
      } catch { return ''; }
    }
    // Conditional oder andere dynamische Ausdrücke -> serialisieren grob
    return generateStaticHint(expr);
  }
  return '';
}

function reconstructBinary(node){
  if(node.type !== 'BinaryExpression' || node.operator !== '+') return '';
  const left = node.left.type === 'StringLiteral' ? node.left.value : (node.left.type === 'BinaryExpression' ? reconstructBinary(node.left) : '');
  const right = node.right.type === 'StringLiteral' ? node.right.value : (node.right.type === 'BinaryExpression' ? reconstructBinary(node.right) : '');
  return (left + ' ' + right).trim();
}

function generateStaticHint(node){
  // Für einfache Ternaries versuchen beide Seiten zu extrahieren
  if(node.type === 'ConditionalExpression'){
    const cons = node.consequent.type === 'StringLiteral' ? node.consequent.value : ''; 
    const alt = node.alternate.type === 'StringLiteral' ? node.alternate.value : '';
    return [cons,alt].filter(Boolean).join(' ');
  }
  return ''; // sonst leer => wird als potentiell ohne Fokus behandelt falls keine Muster
}

function hasFocusStyling(classVal){
  if(!classVal) return false;
  if(CLASS_WHITELIST.some(w=> classVal.includes(w))) return true; // ignorieren
  return FOCUS_HINT.test(classVal);
}

function elementIsInteractive(name, attrs){
  if(INTERACTIVE_TAGS.has(name)) return true;
  // role
  const roleAttr = attrs.find(a=> a.name && a.name.name === 'role');
  if(roleAttr && roleAttr.value && roleAttr.value.type === 'StringLiteral' && ROLE_INTERACTIVE.has(roleAttr.value.value)) return true;
  // tabIndex
  const tabAttr = attrs.find(a=> a.name && a.name.name === 'tabIndex');
  if(tabAttr) return true;
  return false;
}

function analyzeFile(file){
  const code = fs.readFileSync(file,'utf8');
  let ast;
  try {
    ast = parse(code, { sourceType:'module', plugins:['jsx','typescript'] });
  } catch(err){
    console.warn('⚠️  Parser Fehler in', file, err.message);
    return;
  }
  traverse(ast, {
    JSXElement(path){
      const opening = path.node.openingElement;
      if(!opening || opening.name.type !== 'JSXIdentifier') return;
      const tagName = opening.name.name;
      const attrs = opening.attributes.filter(a=> a.type === 'JSXAttribute');
      if(!elementIsInteractive(tagName, attrs)) return;
      const classAttr = attrs.find(a=> a.name && a.name.name === 'className');
      const cVal = extractClassValue(classAttr);
      if(!hasFocusStyling(cVal)){
        findings.push({
          file,
          line: opening.loc?.start?.line || null,
          tag: tagName,
          className: cVal
        });
      }
    }
  });
}

for(const root of ROOTS){
  for(const f of collectFiles(root)) analyzeFile(f);
}

// Sort findings for deterministic output
findings.sort((a,b)=> a.file === b.file ? (a.line||0)-(b.line||0) : a.file.localeCompare(b.file));

// Filter offensichtliche False Positives (z.B. leere className dynamische Ausdrücke & Inputs mit ring in dynamischer Variante)
const filtered = findings.filter(f => {
  if(!f.className) return true; // bleibt zur manuellen Sichtung
  // wenn bereits outline-none vorhanden aber kein focus:* (könnte Problem sein) -> behalten
  // falls vollständig leer -> behalten
  return true;
});

const report = { generated: new Date().toISOString(), totalFindings: filtered.length, findings: filtered };
const outDir = path.resolve(process.cwd(),'docs');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
const outFile = path.join(outDir,'focus-audit-ast-report.json');
fs.writeFileSync(outFile, JSON.stringify(report,null,2));

if(filtered.length){
  console.log(`⚠️  Focus Audit AST: ${filtered.length} potentielle Fälle ohne klaren Fokus-Stil.`);
  filtered.slice(0,20).forEach(f=> console.log(`${f.file}:${f.line} <${f.tag}> class="${f.className}"`));
  if(filtered.length>20) console.log(`… ${filtered.length-20} weitere.`);
  console.log('Report:', outFile);
} else {
  console.log('✅ Focus Audit AST: Keine Probleme erkannt.');
  console.log('Report:', outFile);
}
process.exit(0);
