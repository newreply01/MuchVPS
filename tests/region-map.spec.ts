import { test, expect } from '@playwright/test';

test.describe('MuchVPS Region Map', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a service detail page
    await page.goto('/dashboard/1/services/api');
    
    // Click on the "全球部署" tab to show the RegionMap
    await page.click('text=全球部署');
  });

  test('should display Global Distribution header', async ({ page }) => {
    const header = page.locator('h3:has-text("Global Distribution")');
    await expect(header).toBeVisible();
    await expect(page.locator('text=Edge Network v3.0')).toBeVisible();
  });

  test('should show multi-region active status', async ({ page }) => {
    const status = page.locator('text=Multi-Region Active');
    await expect(status).toBeVisible();
  });

  test('should load regions and display pins from API', async ({ page }) => {
    // Wait for pins to appear - use a more generic selector for the map pin component
    const pins = page.locator('svg.lucide-map-pin, .lucide-map-pin');
    
    // Wait for pins to appear
    await expect(pins.first()).toBeVisible({ timeout: 20000 });
    
    const pinCount = await pins.count();
    expect(pinCount).toBeGreaterThanOrEqual(1);
  });

  test('should show tooltip on hover', async ({ page }) => {
    // Wait for pins
    const pins = page.locator('svg.lucide-map-pin, .lucide-map-pin');
    await expect(pins.first()).toBeVisible({ timeout: 20000 });
    
    const firstPin = pins.first();
    await firstPin.hover();
    
    // Check for tooltip content
    await expect(page.locator('text=Latency').first()).toBeVisible();
    await expect(page.locator('text=Load').first()).toBeVisible();
  });

  test('should list regions in footer', async ({ page }) => {
    const footerRegions = page.locator('.text-zinc-400.uppercase.tracking-widest');
    await expect(footerRegions.first()).toBeVisible({ timeout: 10000 });
    const count = await footerRegions.count();
    expect(count).toBeGreaterThanOrEqual(1);
    
    // Check for a specific region from the API
    await expect(page.locator('text=Tokyo').or(page.locator('text=Hong Kong')).first()).toBeVisible();
  });
});
