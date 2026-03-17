import { test, expect } from '@playwright/test';

test.describe('Zeabur Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should filter projects by search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('搜尋項目...');
    await searchInput.fill('Marketing');
    
    const projectCards = page.locator('.grid > a');
    await expect(projectCards).toHaveCount(1);
    await expect(projectCards.first()).toContainText('Marketing Site');
    
    await searchInput.fill('NonExistent');
    await expect(projectCards).toHaveCount(0);
  });

  test('should open and complete GitHub Import Wizard', async ({ page }) => {
    await page.click('text=新建項目');
    
    const wizard = page.locator('h2:has-text("匯入 GitHub 倉庫")');
    await expect(wizard).toBeVisible();
    
    // Select first repo
    await page.click('button:has-text("zeabur-clone-frontend")');
    
    // Wait for importing state
    await expect(page.locator('text=正在匯入')).toBeVisible();
    
    // Wait for success state (3 seconds timeout simulated in component)
    await expect(page.locator('text=匯入成功'), { timeout: 10000 }).toBeVisible();
    
    // Close wizard
    await page.click('text=前往控制台');
    await expect(wizard).not.toBeVisible();
  });
});
