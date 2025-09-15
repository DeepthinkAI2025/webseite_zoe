import { test, expect } from '@playwright/test';

test('homepage has title and hero', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Create Next App|ZOE/i);
  const h1 = page.locator('h1');
  await expect(h1.first()).toBeVisible();
});
