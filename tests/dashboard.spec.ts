import { test, expect } from '@playwright/test';

test.describe('MuchVPS Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should filter projects by search', async ({ page }) => {
    // Exact match for the placeholder in dashboard/page.tsx
    const searchInput = page.getByPlaceholder('搜尋項目或環境...');
    await searchInput.fill('Awesome');
    
    // Check for the project card
    const projectCards = page.locator('a[href*="/dashboard/"]').filter({ hasText: 'My Awesome App' });
    await expect(projectCards).toBeVisible();
    
    await searchInput.fill('NonExistent');
    const noResults = page.locator('a[href*="/dashboard/1"], a[href*="/dashboard/2"], a[href*="/dashboard/3"]');
    await expect(noResults).toHaveCount(0);
  });

  test('should open and complete GitHub Import Wizard', async ({ page }) => {
    await page.click('text=新建項目');
    
    const wizard = page.locator('h2:has-text("導入 GitHub 項目")');
    await expect(wizard).toBeVisible();
    
    // Select first repo
    await page.click('button:has-text("much-erp")');
    
    // Step through the wizard
    await page.click('button:has-text("下一步")'); // To detect framework
    await page.click('button:has-text("下一步")'); // To config
    await page.click('button:has-text("啟動自動部署")');
    
    // Wait for success state in logs
    await expect(page.locator('text=Deployment Complete')).toBeVisible({ timeout: 15000 });
    
    // Check for "進入服務儀表板" button
    await expect(page.locator('text=進入服務儀表板')).toBeVisible();
    
    // Close wizard (by clicking cancel or finishing)
    await page.click('button:has-text("Cancel Setup")');
    await expect(wizard).not.toBeVisible();
  });
});
