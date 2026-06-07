import { test, expect } from '@playwright/test';

test.describe('Error flow', () => {
  test('landing page loads and shows upload zone', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Drop a screenshot here')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('Font Autopsy')).toBeVisible();
  });

  test('unknown result id shows not found state', async ({ page }) => {
    await page.goto('/result/unknownid00');
    // Wait for client-side render
    await page.waitForTimeout(1000);
    await expect(page.getByText(/not found|expired/i)).toBeVisible();
  });
});