import { test, expect } from '@playwright/test';

test.describe('Quick BP Test', () => {
  test('should load the test page and basic functionality works', async ({ page }) => {
    // Navigate to test page
    await page.goto('/tests/test-page.html');
    await page.waitForLoadState('networkidle');
    
    // Check if canvas is loaded
    const canvas = page.locator('tivins-canvas-bp');
    await expect(canvas).toBeVisible();
    
    // Check initial state
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
    await expect(page.locator('#link-count')).toHaveText('Links: 0');
    
    // Test adding a node
    await page.click('#add-nop');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
    
    // Test clearing
    await page.click('#clear-all');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
    
    // Test validation
    await page.click('#validate-bp');
    
    // Test context menu
    await canvas.click({ button: 'right' });
    await page.waitForSelector('.context-menu', { timeout: 5000 });
    await expect(page.locator('text=Test Node')).toBeVisible();
    
    // Close context menu
    await page.click('body');
    
    console.log('✅ Quick test passed - Basic functionality is working!');
  });
});
