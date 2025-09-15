import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// RUM Endpoint – schreibt Web Vitals Events als JSONL (Demo / lokal persistent)
// Hinweis: Auf Vercel (Serverless) nur während der Laufzeit vorhanden – für echte Nutzung externen Speicher verwenden.

const DOCS_DIR = path.resolve(process.cwd(), 'docs');
const FILE = path.join(DOCS_DIR, 'rum-metrics.jsonl');

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if(!data || !data.name){
      return NextResponse.json({ ok:false, error:'invalid' }, { status:400 });
    }
    if(!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR,{recursive:true});
    const line = JSON.stringify({ ...data, receivedAt: new Date().toISOString() });
    fs.appendFileSync(FILE, line + '\n');
    return NextResponse.json({ ok:true });
  } catch (e:any){
    return NextResponse.json({ ok:false, error:e.message }, { status:500 });
  }
}

export const runtime = 'nodejs';
