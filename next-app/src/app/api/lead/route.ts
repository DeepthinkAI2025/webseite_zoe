import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Simple in-memory rate limiter (IP+minute). Suitable for low traffic; replace with Redis for scale.
const rateBucket: Record<string, { count: number; ts: number }> = {};
const MAX_PER_MINUTE = 8;
const DISPOSABLE_SNIPPETS = ['mailinator','guerrillamail','10minutemail','discard','tempmail'];

type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  postcode: string;
  roofType?: string;
  annualConsumptionKWh?: number;
  storageInterest?: boolean;
  wallboxInterest?: boolean;
  message?: string;
  honeypot?: string;
  consent?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPath?: string;
};

function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init
  });
}

function validateEmail(v: string){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return false;
  const low = v.toLowerCase();
  if(DISPOSABLE_SNIPPETS.some(s => low.includes(s))) return false;
  return true;
}

function sanitizeString(v: unknown, max = 200){
  if(typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function parseBoolean(v: any){
  if(typeof v === 'boolean') return v;
  if(typeof v === 'string') return ['1','true','yes','ja'].includes(v.toLowerCase());
  return false;
}

export async function POST(req: NextRequest){
  if(req.headers.get('content-type')?.includes('application/json') !== true){
    return json({ error: 'Unsupported Content-Type' }, { status: 415 });
  }

  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const minuteKey = `${ip}:${Math.floor(Date.now()/60000)}`;
  const bucket = rateBucket[minuteKey] || { count: 0, ts: Date.now() };
  bucket.count += 1;
  rateBucket[minuteKey] = bucket;
  if(bucket.count > MAX_PER_MINUTE){
    return json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Limit': MAX_PER_MINUTE.toString(), 'X-RateLimit-Remaining': '0' } });
  }

  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot
  if(body.honeypot){
    return json({ success: true }); // pretend success silently
  }

  const errors: Record<string,string> = {};
  const name = sanitizeString(body.name, 120);
  if(!name) errors.name = 'Name erforderlich';

  const email = sanitizeString(body.email, 160).toLowerCase();
  if(!email || !validateEmail(email)) errors.email = 'Ungültige E-Mail oder Wegwerf-Domain';

  const postcode = sanitizeString(body.postcode, 5);
  if(!/^\d{5}$/.test(postcode)) errors.postcode = 'PLZ 5-stellig';

  const roofType = sanitizeString(body.roofType, 40).toLowerCase();
  const allowedRoof = ['ziegel','flachdach','andere','pultdach','walmdach'];
  const finalRoofType = allowedRoof.includes(roofType) ? roofType : undefined;

  let annualConsumptionKWh: number | undefined;
  if(body.annualConsumptionKWh !== undefined){
    const n = Number(body.annualConsumptionKWh);
    if(Number.isFinite(n) && n >= 300 && n <= 60000){
      annualConsumptionKWh = Math.round(n);
    } else {
      errors.annualConsumptionKWh = 'Verbrauch zwischen 300 und 60000 angeben';
    }
  }

  const storageInterest = parseBoolean(body.storageInterest);
  const wallboxInterest = parseBoolean(body.wallboxInterest);

  const message = sanitizeString(body.message, 1000);

  if(!body.consent){
    errors.consent = 'Einwilligung erforderlich';
  }

  if(Object.keys(errors).length){
    return json({ errors }, { status: 422, headers: { 'X-RateLimit-Limit': MAX_PER_MINUTE.toString(), 'X-RateLimit-Remaining': Math.max(0, MAX_PER_MINUTE - bucket.count).toString() } });
  }

  // Score Heuristik
  let score = 0;
  score += 1; // base
  if(storageInterest) score += 2;
  if(wallboxInterest) score += 1;
  if(annualConsumptionKWh && annualConsumptionKWh > 6000) score += 1;
  if(finalRoofType && ['ziegel','flachdach','pultdach','walmdach'].includes(finalRoofType)) score += 0.5;

  const dayKey = new Date().toISOString().slice(0,10);
  const hash = crypto.createHash('sha256').update(`${email}|${postcode}|${dayKey}`).digest('hex').slice(0,16);

  const emailHash = crypto.createHash('sha256').update(email).digest('hex');

  const cleanAttribution = (v?: string, max=120) => sanitizeString(v, max) || undefined;
  const record = {
    ts: new Date().toISOString(),
    hash,
    emailHash,
    score,
    name, email,
    phone: sanitizeString(body.phone, 40) || undefined,
    postcode,
    roofType: finalRoofType,
    annualConsumptionKWh,
    storageInterest,
    wallboxInterest,
    message,
    utm: {
      source: cleanAttribution(body.utmSource),
      medium: cleanAttribution(body.utmMedium),
      campaign: cleanAttribution(body.utmCampaign),
      term: cleanAttribution(body.utmTerm, 80),
      content: cleanAttribution(body.utmContent, 80)
    },
    referrer: cleanAttribution(body.referrer, 300),
    landingPath: cleanAttribution(body.landingPath, 200),
    userAgent: req.headers.get('user-agent') || undefined,
    ip: ip === 'unknown' ? undefined : ip
  };

  try {
    const dataDir = path.join(process.cwd(), 'data');
    if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, `leads-${dayKey}.jsonl`);
    // Duplicate Check (same email+postcode same Tag)
    let isDuplicate = false;
    if(fs.existsSync(file)){
      const recent = fs.readFileSync(file,'utf-8').trim().split('\n').slice(-300); // scan last ~300 of day
      for(const line of recent){
        try {
          const obj = JSON.parse(line);
            if(obj.hash === hash){
              isDuplicate = true;
              break;
            }
        } catch{}
      }
    }
    if(isDuplicate){
      return json({ success: true, duplicate: true, score }, { headers: { 'X-RateLimit-Limit': MAX_PER_MINUTE.toString(), 'X-RateLimit-Remaining': Math.max(0, MAX_PER_MINUTE - bucket.count).toString() } });
    }
    fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf-8');
  } catch (e){
    return json({ error: 'Persistenz fehlgeschlagen' }, { status: 500 });
  }

  // Optional webhook
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if(webhook){
    (async () => {
      try {
        const baseText = `Neuer Lead *${name}* (${email}) – PLZ ${postcode}\nScore: ${record.score}${storageInterest?' · Speicher':''}${wallboxInterest?' · Wallbox':''}`;
        if(process.env.LEAD_WEBHOOK_FORMAT === 'slack'){
          const blocks = [
            { type: 'header', text: { type: 'plain_text', text: 'Neuer Lead', emoji: true } },
            { type: 'section', text: { type: 'mrkdwn', text: baseText } },
            { type: 'context', elements: [ { type: 'mrkdwn', text: `Hash: \`${hash}\`  ·  ${new Date().toLocaleString('de-DE')}` } ] }
          ];
          await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: baseText, blocks }) });
        } else {
          await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: baseText }) });
        }
      } catch {/* ignore */}
    })();
  }

  return json({ success: true, score: record.score }, { headers: { 'X-RateLimit-Limit': MAX_PER_MINUTE.toString(), 'X-RateLimit-Remaining': Math.max(0, MAX_PER_MINUTE - bucket.count).toString() } });
}
