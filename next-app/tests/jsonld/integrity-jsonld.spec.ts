import { test, expect } from '@playwright/test';

// Validiert Integrität aller JSON-LD Skripte auf einer Stichproben-Seite:
// - Jedes JSON-LD Script besitzt ein id Attribut mit Prefix "ld-".
// - Jedes Script hat ein nonce Attribut (vom CSP Nonce System gesetzt).
// - Inhalt ist gültiges JSON.
// Hinweis: Falls globale (absichtlich) ohne id existieren sollten → Whitelist erweitern.

const SAMPLE_PATHS = ['/standorte/berlin', '/'];

interface ScriptInfo { id: string | null; hasNonce: boolean; jsonOk: boolean; rawType: string | null }

async function collectScripts(page: import('@playwright/test').Page): Promise<ScriptInfo[]> {
  return page.$$eval('script[type="application/ld+json"]', (nodes: Element[]) => nodes.map((n: Element) => {
    const el = n as HTMLScriptElement;
    let jsonOk = true;
    try { JSON.parse(el.textContent || '{}'); } catch { jsonOk = false; }
    return { id: el.id || null, hasNonce: el.hasAttribute('nonce'), jsonOk, rawType: el.getAttribute('type') };
  }));
}

test.describe('JSON-LD Integrity', () => {
  for (const path of SAMPLE_PATHS) {
    test(`Scripts auf ${path} besitzen id Prefix & Nonce`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const scripts = await collectScripts(page);
      expect(scripts.length).toBeGreaterThan(0);

      for (const s of scripts) {
        expect(s.jsonOk, 'JSON parsebar').toBeTruthy();
        expect(s.hasNonce, 'Nonce vorhanden').toBeTruthy();
        expect(s.id, 'id vorhanden').not.toBeNull();
        expect(s.id?.startsWith('ld-'), 'id Prefix ld-').toBeTruthy();
      }
    });
  }
});
