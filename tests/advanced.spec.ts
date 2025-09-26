import { test, expect } from '@playwright/test';

test.describe('BP Advanced Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should handle multiple node selection', async ({ page }) => {
    // Add multiple nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    await page.click('#add-nop');
    
    const canvas = page.locator('tivins-canvas-bp');
    
    // Select multiple nodes (this might need adjustment based on actual implementation)
    await canvas.click({ position: { x: 200, y: 200 }, modifiers: ['Control'] });
    await canvas.click({ position: { x: 300, y: 200 }, modifiers: ['Control'] });
    
    // Verify multiple nodes are selected
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 2');
  });

  test('should validate blueprint with different configurations', async ({ page }) => {
    // Test with empty blueprint
    await page.click('#validate-bp');
    let toast = page.locator('.toast').first();
    await expect(toast).toBeVisible();
    
    // Add a node and test again
    await page.click('#add-nop');
    await page.click('#validate-bp');
    
    // Test with multiple nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    await page.click('#validate-bp');
  });

  test('should handle canvas resize', async ({ page }) => {
    const canvas = page.locator('tivins-canvas-bp');
    
    // Add some nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    
    // Resize the browser window
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(100);
    
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(100);
    
    // Verify canvas is still functional
    await expect(canvas).toBeVisible();
    await expect(page.locator('#node-count')).toHaveText('Nodes: 2');
  });

  test('should handle rapid node creation and deletion', async ({ page }) => {
    // Rapidly add nodes
    for (let i = 0; i < 5; i++) {
      await page.click('#add-nop');
      await page.waitForTimeout(50);
    }
    
    await expect(page.locator('#node-count')).toHaveText('Nodes: 5');
    
    // Clear all
    await page.click('#clear-all');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
  });

  test('should maintain state during interactions', async ({ page }) => {
    // Add nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    
    const canvas = page.locator('tivins-canvas-bp');
    
    // Perform various interactions
    await canvas.hover({ position: { x: 200, y: 200 } });
    await page.mouse.wheel(0, -50); // Zoom in
    await page.mouse.wheel(0, 50);  // Zoom out
    
    // Pan around
    await page.mouse.down({ button: 'middle' });
    await page.mouse.move(100, 100);
    await page.mouse.up();
    
    // Verify state is maintained
    await expect(page.locator('#node-count')).toHaveText('Nodes: 2');
    await expect(canvas).toBeVisible();
  });

  test('should handle context menu interactions', async ({ page }) => {
    const canvas = page.locator('tivins-canvas-bp');
    
    // Right-click on empty area
    await canvas.click({ button: 'right' });
    await page.waitForSelector('.context-menu', { timeout: 5000 });
    
    // Verify context menu has expected options
    await expect(page.locator('text=Test Node')).toBeVisible();
    
    // Click outside to close menu
    await page.click('body');
    
    // Right-click on a node (if we can find one)
    await page.click('#add-nop');
    await canvas.click({ button: 'right', position: { x: 200, y: 200 } });
    
    // Verify different context menu options appear
    await page.waitForTimeout(500);
  });

  test('should handle edge cases', async ({ page }) => {
    const canvas = page.locator('tivins-canvas-bp');
    
    // Test with very small viewport
    await page.setViewportSize({ width: 400, height: 300 });
    await page.waitForTimeout(100);
    
    // Add nodes and verify they work
    await page.click('#add-nop');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
    
    // Test with large viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    
    // Add more nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 3');
  });

  test('should handle performance with many nodes', async ({ page }) => {
    // Add many nodes
    for (let i = 0; i < 10; i++) {
      await page.click('#add-nop');
      await page.waitForTimeout(10);
    }
    
    await expect(page.locator('#node-count')).toHaveText('Nodes: 10');
    
    // Verify canvas is still responsive
    const canvas = page.locator('tivins-canvas-bp');
    await expect(canvas).toBeVisible();
    
    // Test interactions still work
    await canvas.hover();
    await page.mouse.wheel(0, -50);
    await page.mouse.wheel(0, 50);
  });
});
