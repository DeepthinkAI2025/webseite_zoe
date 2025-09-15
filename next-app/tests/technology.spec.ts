import { test, expect } from '@playwright/test';

test.describe('Technology Page', () => {
  test('has title and hero', async ({ page }) => {
    await page.goto('/technology');
    await expect(page).toHaveTitle(/Solar Technologie/);
    await expect(page.locator('h1')).toContainText('Technologie');
  });
});
