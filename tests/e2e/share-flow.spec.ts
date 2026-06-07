import { test, expect } from '@playwright/test';

test.describe('Share flow', () => {
  test('share card API returns an image for valid payload', async ({ page }) => {
    // Build a valid encoded payload
    const payload = {
      id: 'testid1234',
      identifiedFamily: 'Inter',
      designer: 'Rasmus Andersson',
      category: 'sans-serif',
      license: 'OFL',
      alternatives: ['Roboto', 'Open Sans', 'Lato'],
      v: 1,
    };
    const encoded = Buffer.from(JSON.stringify(payload))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await page.request.get(`/api/share/card?d=${encoded}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('share card API returns 400 for missing payload', async ({ page }) => {
    const response = await page.request.get('/api/share/card');
    expect(response.status()).toBe(400);
  });
});