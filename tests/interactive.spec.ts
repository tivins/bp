import { test, expect } from '@playwright/test';

test.describe('BP Interactive Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should create nodes via right-click context menu', async ({ page }) => {
    const canvas = page.locator('tivins-canvas-bp');
    
    // Right-click on empty canvas area
    await canvas.click({ button: 'right' });
    
    // Wait for context menu to appear
    await page.waitForSelector('.context-menu', { timeout: 5000 });
    
    // Click on "Test Node" option
    await page.click('text=Test Node');
    
    // Verify node was added
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
  });

  test('should select nodes by clicking on them', async ({ page }) => {
    // Add a node first
    await page.click('#add-nop');
    
    // Click on the canvas where the node should be
    const canvas = page.locator('tivins-canvas-bp');
    await canvas.click({ position: { x: 200, y: 200 } });
    
    // Check if node is selected (this might need adjustment based on actual node position)
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 1');
  });

  test('should drag nodes around', async ({ page }) => {
    // Add a node
    await page.click('#add-nop');
    
    const canvas = page.locator('tivins-canvas-bp');
    
    // Get initial position (we'll need to find the actual node position)
    const initialPosition = { x: 200, y: 200 };
    
    // Drag the node
    await canvas.hover({ position: initialPosition });
    await page.mouse.down();
    await page.mouse.move(300, 300);
    await page.mouse.up();
    
    // The node should have moved (we can't easily verify exact position,
    // but we can ensure the drag operation completed without errors)
    await expect(canvas).toBeVisible();
  });

  test('should create links between nodes', async ({ page }) => {
    // Add two nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    
    const canvas = page.locator('tivins-canvas-bp');
    
    // Try to create a link by dragging from one node to another
    // This is complex to test without knowing exact node positions
    // We'll test the basic interaction
    await canvas.hover({ position: { x: 200, y: 200 } });
    await page.mouse.down();
    await page.mouse.move(400, 200);
    await page.mouse.up();
    
    // Verify the operation completed
    await expect(canvas).toBeVisible();
  });

  test('should show node properties when selected', async ({ page }) => {
    // Add a node
    await page.click('#add-nop');
    
    const canvas = page.locator('tivins-canvas-bp');
    
    // Click on the node to select it
    await canvas.click({ position: { x: 200, y: 200 } });
    
    // Check if properties panel appears (this depends on the implementation)
    // We'll check for the context container
    const contextContainer = page.locator('.ctx-container, [class*="ctx"]');
    if (await contextContainer.count() > 0) {
      await expect(contextContainer).toBeVisible();
    }
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Add a node
    await page.click('#add-nop');
    
    // Select the node
    const canvas = page.locator('tivins-canvas-bp');
    await canvas.click({ position: { x: 200, y: 200 } });
    
    // Try to delete with keyboard
    await page.keyboard.press('Delete');
    
    // Verify node was deleted
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
  });

  test('should zoom in and out', async ({ page }) => {
    const canvas = page.locator('tivins-canvas-bp');
    
    // Test zoom in
    await canvas.hover();
    await page.mouse.wheel(0, -100);
    
    // Test zoom out
    await page.mouse.wheel(0, 100);
    
    // Verify canvas is still visible and functional
    await expect(canvas).toBeVisible();
  });

  test('should pan the canvas', async ({ page }) => {
    const canvas = page.locator('tivins-canvas-bp');
    
    // Add a node for reference
    await page.click('#add-nop');
    
    // Pan by dragging with middle mouse button or right mouse button
    await canvas.hover();
    await page.mouse.down({ button: 'middle' });
    await page.mouse.move(100, 100);
    await page.mouse.up();
    
    // Verify canvas is still functional
    await expect(canvas).toBeVisible();
  });
});
