import type { Page, Locator } from '@playwright/test';

export class Helper {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() ?? '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible' });
      return true;
    } catch {
      return false;
    }
  }

  
}