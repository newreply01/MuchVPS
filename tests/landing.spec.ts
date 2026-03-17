import { test, expect } from '@playwright/test';

test.describe('Zeabur Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct title and hero text', async ({ page }) => {
    await expect(page).toHaveTitle(/Zeabur/);
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
  });

  test('should toggle dark/light mode', async ({ page }) => {
    const html = page.locator('html');
    
    // Check initial state (should be dark by default based on our setup)
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
    await page.click('text=Marketplace');
    await expect(page).toHaveURL(/\/marketplace/);
    await expect(page.locator('h1')).toContainText('服務市場');
  });
});
