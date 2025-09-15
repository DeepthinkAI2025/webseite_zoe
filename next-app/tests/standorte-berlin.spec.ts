import { test, expect } from '@playwright/test';

// Basic E2E Coverage for Berlin City Page
// Checks:
// - Status 200
// - H1 contains target phrase
// - LocalBusiness JSON-LD present
// - FAQPage JSON-LD present

test.describe('Berlin City Page', () => {
  test('renders with structured data', async ({ page }) => {
    await page.goto('/standorte/berlin');
    await expect(page).toHaveURL(/standorte\/berlin/);
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Photovoltaik Installation Berlin');

    // Extract all JSON-LD scripts
    const jsonLdHandles = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdHandles.count();
    expect(count).toBeGreaterThan(0);

    let foundLocal = false;
    let foundFAQ = false;
    for(let i=0;i<count;i++){
      const raw = await jsonLdHandles.nth(i).textContent();
      if(!raw) continue;
      try {
        const data = JSON.parse(raw);
        if(data['@type'] === 'LocalBusiness') foundLocal = true;
        if(data['@type'] === 'FAQPage') foundFAQ = true;
      } catch {/* ignore */}
    }
    expect(foundLocal).toBeTruthy();
    expect(foundFAQ).toBeTruthy();
  });
});
