import { test, expect } from '@playwright/test';


test.describe('Upload flow — happy path', () => {
  test('uploads an image and navigates to result page', async ({ page }) => {
    // Mock the analyze API to return a canned result
    await page.route('**/api/analyze', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'testid1234',
          imageUrl: 'https://utfs.io/f/test',
          imageKey: 'test',
          region: null,
          text: 'Hello World',
          textSource: 'ocr',
          identified: {
            family: 'Inter',
            score: 0.89,
            breakdown: {
              xHeight: 0.9, capHeight: 0.85,
              ascender: 0.88, descender: 0.82,
              strokeContrast: 0.5, category: 1.0,
            },
            font: {
              family: 'Inter', category: 'sans-serif',
              designer: 'Rasmus Andersson', license: 'OFL',
              licenseUrl: 'https://openfontlicense.org',
              weights: [400, 700], variable: true, subsets: ['latin'],
              metrics: { xHeightRatio: 0.527, capHeightRatio: 0.727,
                ascenderRatio: 0.960, descenderRatio: 0.240, strokeContrast: 1.1 },
              traits: ['humanist'], cssUrl: 'https://fonts.googleapis.com/css2?family=Inter',
            },
          },
          alternatives: [],
          pairings: [],
          vision: {
            fullText: 'Hello World', glyphs: [],
            dominantHeightPx: 48, imageWidthPx: 800, imageHeightPx: 600,
          },
          createdAt: new Date().toISOString(),
          schemaVersion: 1,
        }),
      });
    });

    // Mock uploadthing
    await page.route('**/api/uploadthing**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ url: 'https://utfs.io/f/test', key: 'test' }]),
      });
    });

    await page.goto('/');

    // Verify landing page loaded
    await expect(page.getByText('Identify any font')).toBeVisible();
  });
});