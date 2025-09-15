#!/usr/bin/env node
/**
 * RUM Histogram Generator
 * Liest rum-metrics.jsonl (Events) und erzeugt rum-histogram.json (Bucket Verteilungen) + optional Markdown.
 * Buckets (LCP ms): <1200,1200-2500,2500-4000,>4000
 * Buckets (INP ms): <200,200-500,500-800,>800
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const docsDir = path.join(root,'docs');
const file = path.join(docsDir,'rum-metrics.jsonl');

let lines=[];
try { lines = fs.readFileSync(file,'utf8').trim().split(/\n+/); } catch { lines=[]; }

const lcpVals=[]; const inpVals=[];
for(const ln of lines){
  try {
    const obj = JSON.parse(ln);
    if(obj.metric==='LCP' && typeof obj.value==='number') lcpVals.push(obj.value);
    if(obj.metric==='INP' && typeof obj.value==='number') inpVals.push(obj.value);
  } catch {}
}

function bucketize(values, buckets){
  const counts = new Array(buckets.length+1).fill(0); // n buckets + overflow
  for(const v of values){
    let placed=false;
    for(let i=0;i<buckets.length;i++){
      if(v < buckets[i]){ counts[i]++; placed=true; break; }
    }
    if(!placed) counts[counts.length-1]++;
  }
  return counts;
}

const lcpThresholds=[1200,2500,4000];
const inpThresholds=[200,500,800];
const lcpCounts=bucketize(lcpVals,lcpThresholds);
const inpCounts=bucketize(inpVals,inpThresholds);

function toDist(counts){
  const total = counts.reduce((a,b)=>a+b,0)||1;
  return counts.map(c=>c/total);
}

const histogram={
  generatedAt: new Date().toISOString(),
  lcp: { thresholds:lcpThresholds, counts:lcpCounts, distribution: toDist(lcpCounts), total:lcpVals.length },
  inp: { thresholds:inpThresholds, counts:inpCounts, distribution: toDist(inpCounts), total:inpVals.length }
};

fs.writeFileSync(path.join(docsDir,'rum-histogram.json'), JSON.stringify(histogram,null,2),'utf8');

if(process.env.MARKDOWN){
  function bar(p){ const len=Math.round(p*20); return '█'.repeat(len)||'░'; }
  const lcpLabels=[`<${lcpThresholds[0]}`,`${lcpThresholds[0]}-${lcpThresholds[1]}`,`${lcpThresholds[1]}-${lcpThresholds[2]}`,`>${lcpThresholds[2]}`];
  const inpLabels=[`<${inpThresholds[0]}`,`${inpThresholds[0]}-${inpThresholds[1]}`,`${inpThresholds[1]}-${inpThresholds[2]}`,`>${inpThresholds[2]}`];
  const md=[];
  md.push('### RUM Histogramme');
  md.push('');
  md.push('LCP Verteilung:');
  lcpLabels.forEach((lab,i)=> md.push(`${lab.padEnd(11)} | ${(histogram.lcp.distribution[i]*100).toFixed(1)}% ${bar(histogram.lcp.distribution[i])}`));
  md.push('');
  md.push('INP Verteilung:');
  inpLabels.forEach((lab,i)=> md.push(`${lab.padEnd(11)} | ${(histogram.inp.distribution[i]*100).toFixed(1)}% ${bar(histogram.inp.distribution[i])}`));
  fs.writeFileSync(path.join(docsDir,'rum-histogram.md'), md.join('\n'),'utf8');
}

console.log(JSON.stringify(histogram));
