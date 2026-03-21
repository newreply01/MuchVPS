import { test, expect } from '@playwright/test';

test.describe('MuchVPS Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct title and hero text', async ({ page }) => {
    await expect(page).toHaveTitle(/MuchVPS/);
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
  });

  test('should toggle dark/light mode', async ({ page }) => {
    const html = page.locator('html');
    
    // Check initial state (should be dark by default)
    await expect(html).toHaveClass(/dark/);
    
    // Find theme toggler in header and click
    const themeToggle = page.locator('header button').filter({ hasText: '' }).last(); 
    await themeToggle.click();
    
    // Wait for theme change
    await expect(html).not.toHaveClass(/dark/);
    
    // Toggle back
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);
  });

  test('should navigate to marketplace', async ({ page }) => {
    await page.click('text=市場');
    await expect(page).toHaveURL(/\/marketplace/);
    // Updated to match actual h1 in marketplace/page.tsx
    await expect(page.locator('h1')).toContainText('Explore Blueprints');
  });
});
