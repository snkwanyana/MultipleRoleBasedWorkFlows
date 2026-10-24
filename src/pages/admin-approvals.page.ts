import { expect, type Dialog, type Page } from '@playwright/test';
import { Helper } from '../helpers/helper';

export class AdminApprovalsPage extends Helper {
  constructor(public readonly page: Page) { super(page); }

  async openAdminApprovals(): Promise<void> {
    await this.clickElement(this.page.getByRole('button', { name: /Menu/ }));
    await this.clickElement(this.page.getByRole('button', { name: /Admin Panel/ }));
    await this.clickElement(this.page.getByRole('button', { name: /Approvals/ }));
  }

  async openUsers(): Promise<void> {
    await this.clickElement(this.page.getByRole('button', { name: /Menu/ }));
    await this.clickElement(this.page.getByRole('button', { name: /Admin Panel/ }));
    await this.clickElement(this.page.locator('//nav/button[contains(text(),"Users")]'))
  }

  async approveUser(email: string, status: string): Promise<void> {
    await this.fillInput(this.page.getByRole('textbox', { name: 'Search by name or email...' }), email);
    const userRow = this.page.getByRole('row').filter({ hasText: email });
    await expect(userRow).toBeVisible();

    this.page.once('dialog', (dialog) => dialog.accept());
    if (status.trim() === 'approve') {
      await userRow.getByRole('button', { name: /Approve/ }).click();
      await expect(userRow).toHaveCount(0);
    } else if (status.trim() === 'reject') {
      await userRow.getByRole('button', { name: /Reject/ }).click();
      await expect(userRow).toHaveCount(0);
    } else {
      throw new Error(`Invalid status: ${status}`);
    }
  }

  async assignUserRoleAndApprove(email: string, role: string): Promise<void> {
    await this.fillInput(this.page.getByRole('textbox', { name: '🔍 Search users...' }), email);
    const userRow = this.page.getByRole('row').filter({ hasText: email });
    await expect(userRow).toBeVisible();

    const roleSelector = userRow.locator('td').nth(3).getByRole('combobox');
    // The status change raises two consecutive confirm dialogs; each must be accepted separately.
    const acceptDialog = (dialog: Dialog) => dialog.accept();
    this.page.on('dialog', acceptDialog);
    try {
    await roleSelector.selectOption({ value: role });
    } finally {
      this.page.off('dialog', acceptDialog);
    }

    // The status change raises two consecutive confirm dialogs; each must be accepted separately.
    this.page.on('dialog', acceptDialog);
    try {
      await userRow.getByRole('button', { name: /Inactive/ }).click();
      await expect(userRow).toContainText('✅ Active');
    } finally {
      this.page.off('dialog', acceptDialog);
    }
  }

}
