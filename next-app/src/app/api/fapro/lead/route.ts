import { NextRequest, NextResponse } from 'next/server';
import { faproClient } from '@/lib/fapro/client';

// Simple In-Memory Token Bucket (per IP) – survives only per instance lifecycle
interface Bucket { tokens: number; lastRefill: number }
const RATE_LIMIT_TOKENS = 5;          // max bursts
const RATE_LIMIT_INTERVAL_MS = 60_000; // refill window for full bucket
const buckets = new Map<string, Bucket>();

function takeToken(key: string){
  const now = Date.now();
  let bucket = buckets.get(key);
  if(!bucket){
    bucket = { tokens: RATE_LIMIT_TOKENS, lastRefill: now };
    buckets.set(key, bucket);
  }
  // Refill logic (full refill each interval)
  const elapsed = now - bucket.lastRefill;
  if(elapsed >= RATE_LIMIT_INTERVAL_MS){
    bucket.tokens = RATE_LIMIT_TOKENS;
    bucket.lastRefill = now;
  }
  if(bucket.tokens <= 0) return false;
  bucket.tokens -= 1;
  return true;
}

function validate(body: any){
  const errors: Record<string,string> = {};
  if(!body || typeof body !== 'object') return { errors: { _root: 'invalid_body'} };
  if(!body.name || body.name.length < 2) errors.name = 'name_too_short';
  if(!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) errors.email = 'email_invalid';
  if(!body.message || body.message.length < 10) errors.message = 'message_too_short';
  if(body.message && body.message.length > 1200) errors.message = 'message_too_long';
  if(body.plz && !/^\d{4,5}$/.test(body.plz)) errors.plz = 'plz_invalid';
  return { errors, valid: Object.keys(errors).length === 0 };
}

export async function POST(req: NextRequest){
  // Basic IP key (X-Forwarded-For first)
  const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
  const ip = ipHeader.split(',')[0].trim() || 'unknown';
  if(!takeToken(ip)){
    return NextResponse.json({ error: 'rate_limited', retryAfterSeconds: 60 }, { status: 429, headers: { 'Retry-After': '60' }});
  }
  let json: any;
  try { json = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  const { errors, valid } = validate(json);
  if(!valid) return NextResponse.json({ error: 'validation_failed', fields: errors }, { status: 400 });

  // Optional: Netzbetreiber Lookup anreichern (nicht-blockierend)
  let networkOperator: any = undefined;
  if(json.plz){
    try { networkOperator = await faproClient.networkOperatorLookup(json.plz); } catch {/* silent */}
  }

  const payload = {
    name: json.name,
    email: json.email,
    message: json.message,
    plz: json.plz,
    source: 'website',
    utm: json.utm,
    meta: {
      userAgent: req.headers.get('user-agent') || undefined,
      page: json.page || '/contact',
      networkOperator: networkOperator?.operator || undefined
    }
  };

  try {
    const result = await faproClient.createLead(payload);
    return NextResponse.json({ ok: true, result });
  } catch (e: any){
    const msg = e?.message || 'unknown';
    if(msg.includes('401')) return NextResponse.json({ error: 'upstream_auth' }, { status: 502 });
    if(msg.includes('timeout') || msg.includes('aborted')) return NextResponse.json({ error: 'upstream_timeout' }, { status: 504 });
    return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
  }
}
