import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test('should have correct title and heading', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Kontakt | ZOE Solar/);
    await expect(page.getByRole('heading', { level: 1, name: 'Kontakt' })).toBeVisible();
    await expect(page.getByLabel('Kontaktformular (Platzhalter)')).toBeVisible();
  });
});
