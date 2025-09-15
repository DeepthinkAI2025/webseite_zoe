import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

interface VitalsMetric { name: string; value: number; id: string; rating?: string; delta?: number; ts?: number }

function appendMetric(metric: VitalsMetric){
  try {
    const docsDir = path.join(process.cwd(), 'docs');
    if(!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    const file = path.join(docsDir, 'web-vitals-rum.ndjson');
    fs.appendFileSync(file, JSON.stringify(metric) + '\n');
  } catch (e) {
    // swallow – RUM darf App nicht crashen
  }
}

export async function POST(req: NextRequest){
  try {
    const json = await req.json();
    if(!json || typeof json.name !== 'string'){
      return new Response('bad request', { status:400 });
    }
    const metric: VitalsMetric = {
      name: json.name,
      value: Number(json.value),
      id: String(json.id || ''),
      rating: json.rating,
      delta: json.delta != null ? Number(json.delta) : undefined,
      ts: json.ts || Date.now()
    };
    appendMetric(metric);
    return new Response('ok', { status: 200 });
  } catch (e:any) {
    return new Response('error', { status: 500 });
  }
}
