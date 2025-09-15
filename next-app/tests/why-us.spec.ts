import { test, expect } from '@playwright/test';

test.describe('Why Us page', () => {
  test('should have correct title and heading', async ({ page }) => {
    await page.goto('/why-us');
    await expect(page).toHaveTitle(/Warum ZOE Solar\? | ZOE Solar/);
    await expect(page.getByRole('heading', { level: 1, name: 'Warum ZOE Solar\?' })).toBeVisible();
    await expect(page.getByText('Systemkompetenz').first()).toBeVisible();
  });
});
