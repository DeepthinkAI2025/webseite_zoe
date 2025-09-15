import { NextRequest, NextResponse } from 'next/server';

// Minimaler CSP Report Endpoint (optional Feature Level)
// Speichert nichts persistent – nur Konsolen-Logging. Kann später an Logging Backend angebunden werden.
// Siehe SECURITY.md Abschnitt 12.

interface CspReportBody {
  'csp-report'?: {
    'document-uri'?: string;
    'referrer'?: string;
    'violated-directive'?: string;
    'effective-directive'?: string;
    'original-policy'?: string;
    'blocked-uri'?: string;
    'source-file'?: string;
    'line-number'?: number;
    'column-number'?: number;
    'status-code'?: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export async function POST(req: NextRequest) {
  let json: CspReportBody | null = null;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const report = json?.['csp-report'];
  if (!report) {
    return NextResponse.json({ ok: false, error: 'missing-csp-report' }, { status: 400 });
  }

  // Minimaler Safeguard: nur ausgewählte Felder extrahieren
  const sanitized = {
    documentUri: report['document-uri'],
    blockedUri: report['blocked-uri'],
    violated: report['violated-directive'] || report['effective-directive'],
    line: report['line-number'],
    col: report['column-number'],
  };

  // Aktuell nur Logging – in Zukunft: persistenter Storage / Aggregation / Rate Limit
  console.warn('[CSP-REPORT]', JSON.stringify(sanitized));

  return NextResponse.json({ ok: true });
}

export const runtime = 'edge';
