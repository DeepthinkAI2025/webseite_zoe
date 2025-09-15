import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('has title and hero headline', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/Solaranlagen Preise 2025/);
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Transparente Solarpakete');
  });
});
