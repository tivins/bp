import { test, expect } from '@playwright/test';

test.describe('BP Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load the canvas and display initial state', async ({ page }) => {
    // Check if canvas is loaded
    const canvas = page.locator('tivins-canvas-bp');
    await expect(canvas).toBeVisible();
    
    // Check initial node count
    const nodeCount = page.locator('#node-count');
    await expect(nodeCount).toHaveText('Nodes: 0');
    
    // Check initial link count
    const linkCount = page.locator('#link-count');
    await expect(linkCount).toHaveText('Links: 0');
  });

  test('should add a node when clicking the add button', async ({ page }) => {
    // Click the add button
    await page.click('#add-nop');
    
    // Check that node count increased
    await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
    
    // Check that a node is visible on canvas
    const canvas = page.locator('tivins-canvas-bp');
    await expect(canvas).toBeVisible();
  });

  test('should clear all nodes when clicking clear button', async ({ page }) => {
    // Add some nodes first
    await page.click('#add-nop');
    await page.click('#add-nop');
    await page.click('#add-nop');
    
    // Verify nodes were added
    await expect(page.locator('#node-count')).toHaveText('Nodes: 3');
    
    // Clear all
    await page.click('#clear-all');
    
    // Verify nodes were cleared
    await expect(page.locator('#node-count')).toHaveText('Nodes: 0');
    await expect(page.locator('#link-count')).toHaveText('Links: 0');
  });

  test('should show validation status', async ({ page }) => {
    // Test with empty blueprint (should be valid)
    await page.click('#validate-bp');
    
    // Check for validation toast
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
  });

  test('should center the view when clicking center button', async ({ page }) => {
    // Add some nodes
    await page.click('#add-nop');
    await page.click('#add-nop');
    
    // Center the view
    await page.click('#center-view');
    
    // The view should be centered (we can't easily test the visual centering,
    // but we can ensure the button works without errors)
    await expect(page.locator('#center-view')).toBeVisible();
  });
});
