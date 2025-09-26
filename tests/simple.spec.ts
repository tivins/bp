import { test, expect } from '@playwright/test';

test.describe('Simple BP Test', () => {
  test('should load the simple test page and basic functionality works', async ({ page }) => {
    // Navigate to simple test page
    await page.goto('/tests/simple-test.html');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads
    await expect(page.locator('h1')).toHaveText('BP Test Application');
    
    // Check initial state
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
    await expect(page.locator('#link-count')).toHaveText('Links: 0');
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 0');
    
    // Test adding a node
    await page.click('#add-node');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
    
    // Check that node is visible
    const node = page.locator('.node').first();
    await expect(node).toBeVisible();
    await expect(node).toHaveText('Node 1');
    
    // Test selecting the node
    await node.click();
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 1');
    
    // Test adding more nodes
    await page.click('#add-node');
    await page.click('#add-node');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 3');
    
    // Test clearing all
    await page.click('#clear-all');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 0');
    
    // Test validation
    await page.click('#validate-bp');
    
    // Test right-click context menu
    await page.click('#canvas-container', { button: 'right' });
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
    
    // Test keyboard delete
    const newNode = page.locator('.node').first();
    await newNode.click();
    await page.keyboard.press('Delete');
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
    
    console.log('✅ Simple test passed - Basic functionality is working!');
  });

  test('should handle node dragging', async ({ page }) => {
    await page.goto('/tests/simple-test.html');
    await page.waitForLoadState('networkidle');
    
    // Add a node
    await page.click('#add-node');
    const node = page.locator('.node').first();
    
    // Get initial position
    const initialBox = await node.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Drag the node
    await node.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();
    
    // Check that node moved
    const newBox = await node.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.x).not.toBe(initialBox!.x);
    expect(newBox!.y).not.toBe(initialBox!.y);
  });

  test('should handle multiple node selection', async ({ page }) => {
    await page.goto('/tests/simple-test.html');
    await page.waitForLoadState('networkidle');
    
    // Add multiple nodes
    await page.click('#add-node');
    await page.click('#add-node');
    await page.click('#add-node');
    
    // Select first node
    const firstNode = page.locator('.node').nth(0);
    await firstNode.click();
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 1');
    
    // Select second node (should deselect first)
    const secondNode = page.locator('.node').nth(1);
    await secondNode.click();
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 1');
    
    // Click empty area to deselect
    await page.click('#canvas-container');
    await expect(page.locator('#selected-nodes')).toHaveText('Selected: 0');
  });

  test('should execute JavaScript functions', async ({ page }) => {
    await page.goto('/tests/simple-test.html');
    await page.waitForLoadState('networkidle');
    
    // Test JavaScript execution
    const result = await page.evaluate(() => {
      return window.testUtils ? {
        nodeCount: window.testUtils.getNodeCount(),
        linkCount: window.testUtils.getLinkCount(),
        hasTestUtils: !!window.testUtils
      } : null;
    });
    
    expect(result).toBeTruthy();
    expect(result.hasTestUtils).toBe(true);
    expect(typeof result.nodeCount).toBe('number');
    expect(typeof result.linkCount).toBe('number');
    
    // Test adding node via JavaScript
    await page.evaluate(() => {
      window.testUtils.addNode();
    });
    
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
  });
});
