import { test, expect } from '@playwright/test';
import { BPTestUtils } from './helpers/test-utils';

test.describe('BP Custom Tests with Utils', () => {
  let testUtils: BPTestUtils;

  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test-page.html');
    await page.waitForLoadState('networkidle');
    testUtils = new BPTestUtils(page);
  });

  test('should create a complex blueprint workflow', async ({ page }) => {
    // Add multiple nodes
    await testUtils.addNode();
    await testUtils.addNode();
    await testUtils.addNode();
    
    // Verify we have 3 nodes
    expect(await testUtils.getNodeCount()).toBe(3);
    
    // Center the view
    await testUtils.centerView();
    
    // Validate the blueprint
    await testUtils.validateBlueprint();
    
    // Check for validation toast
    const toast = await testUtils.waitForToast();
    await expect(toast).toBeVisible();
  });

  test('should handle canvas interactions smoothly', async ({ page }) => {
    // Add a node
    await testUtils.addNode();
    
    // Test zooming
    await testUtils.zoomIn(50);
    await testUtils.zoomOut(50);
    
    // Test panning
    await testUtils.panCanvas(200, 200, 300, 300);
    
    // Test clicking
    await testUtils.clickOnCanvas(250, 250);
    
    // Verify canvas is still responsive
    const canvas = await testUtils.getCanvas();
    await expect(canvas).toBeVisible();
  });

  test('should create nodes via context menu', async ({ page }) => {
    // Right-click to open context menu
    await testUtils.rightClickOnCanvas(300, 300);
    
    // Wait for context menu
    const contextMenu = await testUtils.waitForContextMenu();
    await expect(contextMenu).toBeVisible();
    
    // Click on "Test Node" option
    await page.click('text=Test Node');
    
    // Verify node was created
    expect(await testUtils.getNodeCount()).toBe(1);
  });

  test('should handle rapid operations', async ({ page }) => {
    // Rapidly add and remove nodes
    for (let i = 0; i < 5; i++) {
      await testUtils.addNode();
      await page.waitForTimeout(10);
    }
    
    expect(await testUtils.getNodeCount()).toBe(5);
    
    // Clear all
    await testUtils.clearAll();
    expect(await testUtils.getNodeCount()).toBe(0);
  });

  test('should maintain state during complex interactions', async ({ page }) => {
    // Create initial state
    await testUtils.addNode();
    await testUtils.addNode();
    
    const initialNodeCount = await testUtils.getNodeCount();
    expect(initialNodeCount).toBe(2);
    
    // Perform complex interactions
    await testUtils.zoomIn(100);
    await testUtils.panCanvas(200, 200, 400, 400);
    await testUtils.zoomOut(50);
    await testUtils.clickOnCanvas(300, 300);
    
    // Verify state is maintained
    expect(await testUtils.getNodeCount()).toBe(initialNodeCount);
    
    // Test drag operation
    await testUtils.dragOnCanvas(200, 200, 300, 300);
    
    // Verify canvas is still functional
    const canvas = await testUtils.getCanvas();
    await expect(canvas).toBeVisible();
  });

  test('should handle edge cases gracefully', async ({ page }) => {
    // Test with very small viewport
    await page.setViewportSize({ width: 400, height: 300 });
    await page.waitForTimeout(100);
    
    await testUtils.addNode();
    expect(await testUtils.getNodeCount()).toBe(1);
    
    // Test with large viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    
    await testUtils.addNode();
    await testUtils.addNode();
    expect(await testUtils.getNodeCount()).toBe(3);
    
    // Test rapid viewport changes
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(50);
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(50);
    
    // Verify everything still works
    expect(await testUtils.getNodeCount()).toBe(3);
  });

  test('should execute JavaScript in the page context', async ({ page }) => {
    // Test JavaScript execution
    const result = await testUtils.executeJavaScript(`
      return window.testUtils ? {
        nodeCount: window.testUtils.getNodeCount(),
        linkCount: window.testUtils.getLinkCount(),
        hasCanvas: !!window.testCanvas
      } : null;
    `);
    
    expect(result).toBeTruthy();
    expect(result.hasCanvas).toBe(true);
    expect(typeof result.nodeCount).toBe('number');
    expect(typeof result.linkCount).toBe('number');
  });

  test('should take screenshots for documentation', async ({ page }) => {
    // Add some content
    await testUtils.addNode();
    await testUtils.addNode();
    await testUtils.addNode();
    
    // Take a screenshot
    await testUtils.takeScreenshot('blueprint-with-nodes');
    
    // Verify the screenshot was taken (file should exist)
    const fs = require('fs');
    const screenshotPath = 'tests/screenshots/blueprint-with-nodes.png';
    expect(fs.existsSync(screenshotPath)).toBe(true);
  });
});
