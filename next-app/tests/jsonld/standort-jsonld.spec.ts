import { test, expect } from '@playwright/test';

// Basic smoke test to ensure JSON-LD scripts are rendered via component (with ids) and contain expected keys.
// Chooses one representative Standort page (e.g. /standorte/berlin) – adapt if berlin not present.

const STANDORT_PATH = '/standorte/berlin';

// Helper: find all application/ld+json scripts and return their JSON.
interface JsonLdScriptExtract { id: string | null; json: any | null }
async function collectJsonLd(page: import('@playwright/test').Page): Promise<JsonLdScriptExtract[]> {
  return page.$$eval('script[type="application/ld+json"]', (nodes: Element[]) => nodes.map((n: Element) => {
    const id = (n as HTMLElement).id || null;
    try {
      return { id, json: JSON.parse(n.textContent || '{}') } as JsonLdScriptExtract;
    } catch {
      return { id, json: null } as JsonLdScriptExtract;
    }
  }));
}

test.describe('Structured Data (JSON-LD) Standort Berlin', () => {
  test('renders breadcrumb, localbusiness & faq JSON-LD', async ({ page }) => {
    await page.goto(STANDORT_PATH, { waitUntil: 'domcontentloaded' });
    const scripts = await collectJsonLd(page);

    // Expect at least 3 scripts from our component usage (breadcrumb, local business, faq) + possibly global ones.
    expect(scripts.length).toBeGreaterThanOrEqual(3);

  const hasBreadcrumb = scripts.some((s: JsonLdScriptExtract) => s.json && s.json['@type'] === 'BreadcrumbList');
  const hasFAQ = scripts.some((s: JsonLdScriptExtract) => s.json && s.json['@type'] === 'FAQPage');
  const hasOrgOrLocal = scripts.some((s: JsonLdScriptExtract) => s.json && (s.json['@type'] === 'LocalBusiness' || s.json['@type'] === 'Organization'));

    expect(hasBreadcrumb, 'BreadcrumbList JSON-LD present').toBeTruthy();
    expect(hasFAQ, 'FAQPage JSON-LD present').toBeTruthy();
    expect(hasOrgOrLocal, 'LocalBusiness / Organization JSON-LD present').toBeTruthy();

    // Each script should either have an id (component output) or be known root-level (optional check)
  const componentScripts = scripts.filter((s: JsonLdScriptExtract) => s.id);
    expect(componentScripts.length).toBeGreaterThanOrEqual(3);
  });
});
