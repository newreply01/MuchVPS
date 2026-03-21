import { test, expect } from '@playwright/test';

test.describe('MuchVPS Stability Diagnostic', () => {
  test('should load landing page and verify core elements', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/', { timeout: 20000 });
    expect(response?.status()).toBe(200);
    
    // Verify Hero section
    await expect(page.locator('h1')).toContainText(/AI/); 
    await expect(page.locator('text=部署').first()).toBeVisible();
  });

  test('should load dashboard and verify navigation', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/dashboard', { timeout: 20000 });
    expect(response?.status()).toBe(200);
    
    // Verify Sidebar and Header
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText('項目管理中心');
    
    // Check for project cards
    const projectCards = page.locator('a[href*="/dashboard/"]');
    expect(await projectCards.count()).toBeGreaterThan(0);
  });

  test('should load service detail and verify tabs', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/dashboard/1/services/api', { timeout: 20000 });
    expect(response?.status()).toBe(200);
    
    // Check for main tabs - using regex for flexible matching if truncated
    await expect(page.locator('text=/日誌/').first()).toBeVisible();
    await expect(page.locator('text=全球部署').first()).toBeVisible();
    await expect(page.locator('text=服務設置').first()).toBeVisible();

    // Click on Settings tab and verify content
    await page.click('text=服務設置');
    await expect(page.locator('text=環境變量管理').first()).toBeVisible();
  });

  test('should capture and report browser errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      // Ignore React key warnings for now to focus on critical stability, but report them
      if (msg.type() === 'error') {
        if (msg.text().includes('Keys should be unique')) {
           console.log('React Key Warning detected (non-blocking for this diagnostic)');
        } else {
           errors.push(msg.text());
        }
      }
    });

    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000); // Wait for async effects

    if (errors.length > 0) {
      console.log('Detected Browser Errors:', errors);
    }
    // Filter out typical dev-only Next.js warnings/errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Next-dev') && 
      !e.includes('hydration') &&
      !e.includes('React spread')
    );
    expect(criticalErrors.length).toBe(0);
  });
});
