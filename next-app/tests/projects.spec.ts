import { test, expect } from '@playwright/test';

test.describe('Projects page', () => {
  test('should have correct title and heading', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Referenzen & Projekte | ZOE Solar/);
    await expect(page.getByRole('heading', { level: 1, name: 'Referenzen & Projekte' })).toBeVisible();
    await expect(page.locator('h3').first()).toBeVisible();
  });
});
