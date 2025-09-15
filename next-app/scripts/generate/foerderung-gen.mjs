#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

/*
  Eingabe: content/programmatic/foerderung/*.yml
  Minimale Felder:
    title, slug, region, updated, programmes[]
  Optionale Felder:
    foerdergeber, kurzbeschreibung, voraussetzungen[], kombinierbarkeit[], vorteile[], schritte[], faq[]
*/

const SRC_DIR = path.join(process.cwd(), 'content', 'programmatic', 'foerderung');
const AUTO_DIR = path.join(process.cwd(), 'content', 'programmatic', 'foerderung-auto');
const OUT_DIR = path.join(process.cwd(), 'content', 'generated', 'foerderung');
fs.mkdirSync(OUT_DIR, { recursive: true });

function sectionList(heading, arr){
  if(!arr || !arr.length) return '';
  return `\n### ${heading}\n\n${arr.map(i=>`- ${i}`).join('\n')}\n`;
}

function mergeProgrammes(manual = [], auto = []){
  if(!auto.length) return manual;
  const out = [...manual];
  for(const ap of auto){
    if(!ap || !ap.name) continue;
    const idx = out.findIndex(mp => mp.name && mp.name.toLowerCase() === ap.name.toLowerCase());
    if(idx >= 0){
      // Überschreiben/aktualisieren laut Strategie
      out[idx] = { ...out[idx], ...ap };
    } else {
      out.push(ap);
    }
  }
  return out;
}

function buildMdx(data, autoData){
  const { title, slug, region, updated, programmes = [], faq = [], foerdergeber, kurzbeschreibung,
    voraussetzungen = [], kombinierbarkeit = [], vorteile = [], schritte = [] } = data;

  const autoProgrammes = autoData && Array.isArray(autoData.programmes) ? autoData.programmes : [];
  const mergedProgrammes = mergeProgrammes(programmes, autoProgrammes);

  if(!title || !slug) throw new Error('Fehlende Pflichtfelder (title / slug) in Förderung YAML');

  const frontMatter = {
    title,
    description: `${kurzbeschreibung || title + ' – Übersicht Förderprogramme ' + region}`,
    canonical: `/foerderung/${slug}`,
    updated,
    region
  };
  const fm = '---\n'+Object.entries(frontMatter).map(([k,v])=>`${k}: ${v || ''}`).join('\n')+'\n---\n';
  const progTable = mergedProgrammes.length ? `\n## Programme\n\n| Programm | Beschreibung | Rate | Cap |\n|----------|--------------|------|-----|\n${mergedProgrammes.map(p=>`| ${p.name} | ${p.description || ''} | ${p.rate || ''} | ${p.cap || ''} |`).join('\n')}\n` : '';
  const faqBlock = faq.length ? `\n## FAQ\n${faq.map(f=>`**${f.q}**\n\n${f.a}\n`).join('\n')}` : '';
  const metaBlock = foerdergeber ? `\n> Fördergeber: **${foerdergeber}**\n` : '';
  return fm + `# ${title}\n\nAktualisiert: ${updated}\n\nRegion: **${region}**${metaBlock}\n${kurzbeschreibung ? kurzbeschreibung + '\n' : ''}${progTable}`
    + sectionList('Voraussetzungen', voraussetzungen)
    + sectionList('Kombinierbarkeit', kombinierbarkeit)
    + sectionList('Vorteile', vorteile)
    + sectionList('Schritte', schritte)
    + faqBlock + '\n';
}

function main(){
  if(!fs.existsSync(SRC_DIR)){
    console.error('Keine YAML Quelle gefunden:', SRC_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(SRC_DIR).filter(f=>f.endsWith('.yml') || f.endsWith('.yaml'));
  if(!files.length){
    console.log('Keine Förderungs YAML Dateien gefunden.');
    return;
  }
  for(const f of files){
    const raw = fs.readFileSync(path.join(SRC_DIR, f), 'utf8');
    let parsed;
    try {
      parsed = parseYaml(raw);
    } catch(e){
      console.error('YAML Parse Fehler in', f, e.message);
      continue;
    }
    try {
      // Auto-Daten versuchen zu laden
      let autoData = null;
      try {
        const autoFile = path.join(AUTO_DIR, parsed.slug + '.auto.yml');
        if(fs.existsSync(autoFile)){
          autoData = parseYaml(fs.readFileSync(autoFile, 'utf8'));
        }
      } catch(e){ /* ignore */ }
      const mdx = buildMdx(parsed, autoData);
      const outFile = path.join(OUT_DIR, parsed.slug + '.mdx');
      fs.writeFileSync(outFile, mdx, 'utf8');
      console.log('Generiert:', outFile, autoData && autoData.programmes ? `(auto+${autoData.programmes.length})` : '');
    } catch(e){
      console.error('Fehler beim Generieren für', f, e.message);
    }
  }
}

main();
