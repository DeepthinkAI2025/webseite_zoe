import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file:///workspaces/webseite_zoe/Arbeitsverzeichnis/dist/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('Homepage - Full Page', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full.png');
  });

  test('Homepage - Hero Section', async ({ page }) => {
    await expect(page.locator('section').first()).toHaveScreenshot('homepage-hero.png');
  });

  test('Motion Reduction - Reduced Motion Styles', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('reduced-motion-components.png');
  });
});
