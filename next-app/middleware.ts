import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware generiert eine Nonce pro Request und setzt strikte CSP.
// Die Nonce wird als Request-Header (x-nonce) weitergereicht (nur Edge/Node intern nutzbar) und als Response-Header gespiegelt.
// Layout/Server Components können sie via Header-Metadaten auslesen (Workaround: Wir verwenden einen globalen symbolischen Speicher).

const NONCE_HEADER = 'x-nonce';

function genNonce(){
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = '';
  for (let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i]);
  // btoa für Edge Runtime verfügbar
  return btoa(binary);
}

export function middleware(req: NextRequest){
  const nonce = genNonce();
  // Klonen der Response für Weiterleitung
  const res = NextResponse.next({ request: { headers: new Headers(req.headers) } });
  res.headers.set(NONCE_HEADER, nonce);

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-"+nonce+"' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.bing.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests'
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)']
};
