import { After, Before, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { WorkflowWorld } from './world';

setDefaultTimeout(60_000);

Before(async function (this: WorkflowWorld): Promise<void> {
  this.browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
  });
});

After(async function (this: WorkflowWorld, scenario): Promise<void> {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }

  await this.context?.close();
  await this.browser?.close();
});
