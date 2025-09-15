import { NextRequest, NextResponse } from 'next/server';

// Simple IndexNow submission endpoint.
// Accepts JSON body: { url?: string, urls?: string[] }
// Uses environment variables: INDEXNOW_KEY (required), INDEXNOW_ENDPOINT (optional override)
// Docs: https://www.indexnow.org/

// Edge Runtime deaktiviert -> Node Runtime erlaubt konsistente statische Generierung anderer Routen.
// Falls extrem niedrige Latenz für dieses Endpoint nötig ist, wieder aktivieren.
export const runtime = 'nodejs';

async function submitIndexNow(urls: string[], key: string, endpoint?: string){
  const api = endpoint || 'https://www.bing.com/indexnow';
  const params = new URLSearchParams();
  params.set('key', key);
  // keyLocation could be hosted at /.well-known/ or public root if needed – optional here.
  for(const u of urls){
    params.set('url', u);
    try {
      const res = await fetch(`${api}?${params.toString()}`, { method: 'GET' });
      if(!res.ok){
        console.warn('IndexNow submission failed', u, res.status);
      }
    } catch(e){
      console.warn('IndexNow network error', u, e);
    }
  }
}

export async function POST(req: NextRequest){
  const key = process.env.INDEXNOW_KEY;
  if(!key){
    return NextResponse.json({ error: 'Missing INDEXNOW_KEY' }, { status: 500 });
  }
  let payload: any; try { payload = await req.json(); } catch { payload = {}; }
  let urls: string[] = [];
  if(payload.url) urls.push(payload.url);
  if(Array.isArray(payload.urls)) urls.push(...payload.urls);
  urls = [...new Set(urls)].filter(Boolean);
  if(urls.length === 0){
    return NextResponse.json({ error: 'No urls provided' }, { status: 400 });
  }
  await submitIndexNow(urls, key, process.env.INDEXNOW_ENDPOINT);
  return NextResponse.json({ submitted: urls.length });
}
