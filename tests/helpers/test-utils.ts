import { Page, Locator } from '@playwright/test';

export class BPTestUtils {
  constructor(private page: Page) {}

  async addNode(type: string = 'test'): Promise<void> {
    await this.page.click('#add-nop');
  }

  async clearAll(): Promise<void> {
    await this.page.click('#clear-all');
  }

  async centerView(): Promise<void> {
    await this.page.click('#center-view');
  }

  async validateBlueprint(): Promise<void> {
    await this.page.click('#validate-bp');
  }

  async getNodeCount(): Promise<number> {
    const text = await this.page.locator('#node-count').textContent();
    return parseInt(text?.match(/\d+/)?.[0] || '0');
  }

  async getLinkCount(): Promise<number> {
    const text = await this.page.locator('#link-count').textContent();
    return parseInt(text?.match(/\d+/)?.[0] || '0');
  }

  async getSelectedNodeCount(): Promise<number> {
    const text = await this.page.locator('#selected-nodes').textContent();
    return parseInt(text?.match(/\d+/)?.[0] || '0');
  }

  async waitForCanvasLoad(): Promise<void> {
    await this.page.waitForSelector('tivins-canvas-bp');
    await this.page.waitForLoadState('networkidle');
  }

  async rightClickOnCanvas(x: number = 300, y: number = 300): Promise<void> {
    const canvas = this.page.locator('tivins-canvas-bp');
    await canvas.click({ button: 'right', position: { x, y } });
  }

  async clickOnCanvas(x: number = 300, y: number = 300): Promise<void> {
    const canvas = this.page.locator('tivins-canvas-bp');
    await canvas.click({ position: { x, y } });
  }

  async dragOnCanvas(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    const canvas = this.page.locator('tivins-canvas-bp');
    await canvas.hover({ position: { x: fromX, y: fromY } });
    await this.page.mouse.down();
    await this.page.mouse.move(toX, toY);
    await this.page.mouse.up();
  }

  async zoomIn(amount: number = 100): Promise<void> {
    const canvas = this.page.locator('tivins-canvas-bp');
    await canvas.hover();
    await this.page.mouse.wheel(0, -amount);
  }

  async zoomOut(amount: number = 100): Promise<void> {
    const canvas = this.page.locator('tivins-canvas-bp');
    await canvas.hover();
    await this.page.mouse.wheel(0, amount);
  }

  async panCanvas(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    const canvas = this.page.locator('tivins-canvas-bp');
    await canvas.hover({ position: { x: fromX, y: fromY } });
    await this.page.mouse.down({ button: 'middle' });
    await this.page.mouse.move(toX, toY);
    await this.page.mouse.up();
  }

  async waitForToast(): Promise<Locator> {
    return this.page.waitForSelector('.toast');
  }

  async waitForContextMenu(): Promise<Locator> {
    return this.page.waitForSelector('.context-menu');
  }

  async getCanvas(): Promise<Locator> {
    return this.page.locator('tivins-canvas-bp');
  }

  async executeJavaScript<T>(script: string): Promise<T> {
    return this.page.evaluate(script);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }
}
