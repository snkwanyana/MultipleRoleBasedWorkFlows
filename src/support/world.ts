import { World, setWorldConstructor } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { PracticePage, type UserCredentials } from '../pages/practice.page';
import { AdminApprovalsPage } from '../pages/admin-approvals.page';

export class WorkflowWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  userA?: UserCredentials;

  async useNewContext(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser has not been started');
    }

    await this.context?.close();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    return this.page;
  }

  get practicePage(): PracticePage {
    return new PracticePage(this.page!);
  }

  get adminApprovalsPage(): AdminApprovalsPage {
    return new AdminApprovalsPage(this.page!);
  }
}

setWorldConstructor(WorkflowWorld);
