import { test, expect } from '@playwright/test';

/**
 * Verifiziert GAIO / AEO Blöcke auf der Pricing Seite:
 * - Key Takeaways vorhanden (data-gaio-block="key-takeaways")
 * - Mindestens 2 QA Blöcke (data-gaio-block="qa")
 * - Offer / FAQ / Breadcrumb JSON-LD Scripts vorhanden
 */

test.describe('GAIO Pricing Page', () => {
  test('enthält GAIO Strukturen & JSON-LD', async ({ page }) => {
    await page.goto('/pricing');

    // Key Takeaways
    const keyTakeaways = page.locator('[data-gaio-block="key-takeaways"]');
    await expect(keyTakeaways).toHaveCount(1);
    await expect(keyTakeaways.locator('li')).toHaveCount(5);

    // QA Blocks
    const qaBlocks = page.locator('[data-gaio-block="qa"]');
    await expect(qaBlocks).toHaveCount(2);

    // JSON-LD Scripts Sammeln
    const ldHandles = await page.locator('script[type="application/ld+json"]').all();
    const rawJsons = await Promise.all(ldHandles.map(h => h.textContent()));
    const parsed = rawJsons.map(r => {
      try { return JSON.parse(r || '{}'); } catch { return {}; }
    });

    function hasType(t: string) {
      return parsed.some(p => p['@type'] === t || (Array.isArray(p) && p.some(i => i['@type'] === t)));
    }

    expect(hasType('OfferCatalog') || hasType('Offer')).toBeTruthy();
    expect(hasType('FAQPage')).toBeTruthy();
    expect(hasType('BreadcrumbList')).toBeTruthy();
  });
});
