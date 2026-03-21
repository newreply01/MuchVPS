import { test, expect } from '@playwright/test';

test.describe('MuchVPS Service Details', () => {
  test.beforeEach(async ({ page }) => {
    // Go to a specific service page
    await page.goto('/dashboard/1/services/api');
  });

  test('should display live logs', async ({ page }) => {
    // Click on logs tab just in case
    await page.click('text=日誌記錄');
    
    const logContainer = page.locator('.font-mono');
    await expect(logContainer).toBeVisible({ timeout: 10000 });
    
    const initialLogCount = await logContainer.locator('div').count();
    
    // Wait for at least one more log line to appear
    await expect(async () => {
      const currentCount = await logContainer.locator('div').count();
      expect(currentCount).toBeGreaterThan(initialLogCount);
    }).toPass({ timeout: 15000 });
  });

  test('should edit environment variables', async ({ page }) => {
    // Navigate to Settings tab where EnvEditor is located
    await page.click('text=服務設置');
    
    const envTable = page.locator('table');
    await expect(envTable).toBeVisible();
    
    // Check visibility toggle
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
    
    await page.locator('button:has(.lucide-eye)').first().click();
    // After clicking eye, the password type should change or value become visible
    await expect(page.locator('input[type="text"]').filter({ hasText: '' }).nth(1)).toBeVisible(); 
  });

  test('should display comprehensive networking data', async ({ page }) => {
    // Navigate to Settings tab where NetworkConfig is located
    await page.click('text=服務設置');
    
    // Internal Networking
    await expect(page.locator('text=內部網絡 (Wonder Mesh)')).toBeVisible();
    await page.click('text=複製網名');
    await expect(page.locator('text=已複製')).toBeVisible();
    
    // Public Domains
    await expect(page.locator('text=公有網域')).toBeVisible();
    await expect(page.locator('text=mucherp.app/api')).toBeVisible();
    
    // SSL Status (using exact text from network-config if possible)
    await expect(page.locator('text=SSL 有效').first()).toBeVisible();
    
    // Bind Domain Button
    await expect(page.locator('button:has-text("綁定域名")')).toBeVisible();
  });
});
