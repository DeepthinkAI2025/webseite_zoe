#!/usr/bin/env node
/**
 * Slack Weekly Report Notifier
 * Erwartet: SLACK_WEBHOOK (Incoming Webhook URL)
 * Optional: REPORT (Pfad zur Markdown Datei), FALLBACK (Text)
 */
import fs from 'fs';
import https from 'https';

const webhook = process.env.SLACK_WEBHOOK;
if(!webhook){
  console.error('SLACK_WEBHOOK not set - exiting gracefully');
  process.exit(0);
}

const reportPath = process.env.REPORT || 'docs/weekly-report-latest.md';
let snippet = '';
try {
  const full = fs.readFileSync(reportPath,'utf8').split(/\n/).slice(0,40).join('\n');
  snippet = full;
} catch {
  snippet = process.env.FALLBACK || 'Weekly Report nicht gefunden.';
}

const payload = {
  text: `*Weekly SEO / GAIO Report*\n${snippet}\n— Ende —`
};

function post(url, body){
  const data = JSON.stringify(body);
  const u = new URL(url);
  const opts = {method:'POST',hostname:u.hostname,path:u.pathname+u.search,headers:{'Content-Type':'application/json','Content-Length': Buffer.byteLength(data)}};
  const req = https.request(opts,res=>{res.on('data',()=>{});res.on('end',()=>{console.log('Slack Response',res.statusCode);});});
  req.on('error',e=>console.error('Slack Error',e));
  req.write(data); req.end();
}

post(webhook,payload);
