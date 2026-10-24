import { randomUUID } from 'node:crypto';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { WorkflowWorld } from '../support/world';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

Given('User A opens the practice page', async function (this: WorkflowWorld): Promise<void> {
  // const page = await this.useNewContext();
  await this.useNewContext();
  await this.practicePage.open();
  await expect(this.page!.getByRole('heading', { name: 'Login to Access Learning Materials' })).toBeVisible();
});

When('User A creates a new account from the Sign Up Here link', async function (
  this: WorkflowWorld,
): Promise<void> {
  const credentials = {
    firstName: 'Workflow',
    lastName: 'User',
    email: `workflow-${randomUUID()}@example.com`,
    password: `Nta-${randomUUID()}!aA1`,
  };
  this.userA = credentials;
  await this.practicePage.signUp(credentials);
});

Then("User A's account is submitted for approval", async function (this: WorkflowWorld): Promise<void> {
  if (!this.userA) {
    throw new Error('User A credentials are missing; the signup step must run first');
  }
  console.log(`User A email: ${this.userA.email}`);
  console.log(`User A password: ${this.userA.password}`);
  await this.practicePage.expectSignupSubmitted(this.userA.email);
});

When("Admin B logs in, assigns {word} role and sets status {word} for User A's account", async function (
  this: WorkflowWorld,
  role: string,
  status: string,
): Promise<void> {
  if (!this.userA) {
    throw new Error('User A credentials are missing; the signup step must run first');
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the project .env file before running the workflow');
  }

  await this.useNewContext();
  await this.practicePage.open();
  await this.practicePage.logIn(ADMIN_EMAIL, ADMIN_PASSWORD);
  await expect(this.page!).toHaveURL(/#dashboard/);
  
  
  if (role.trim() === 'user') {
    await this.adminApprovalsPage.openAdminApprovals();
    await this.adminApprovalsPage.approveUser(this.userA.email, status);
  } else {
    await this.adminApprovalsPage.openUsers();
    await this.adminApprovalsPage.assignUserRoleAndApprove(this.userA.email, role);
  }
 
});

Then('User A can log in with the newly created credentials', async function (
  this: WorkflowWorld,
): Promise<void> {
  if (!this.userA) {
    throw new Error('User A credentials are missing; the signup step must run first');
  }

  await this.useNewContext();
  
  await this.practicePage.open();
  await this.practicePage.logIn(this.userA.email, this.userA.password);
  await this.practicePage.expectLoggedIn(this.userA.firstName);
});
