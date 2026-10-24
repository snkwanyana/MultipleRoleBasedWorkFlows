import { expect, type Page } from '@playwright/test';
import { Helper } from '../helpers/helper';

// export const PRACTICE_URL = process.env.URL ?? 'https://ndosisimplifiedautomation.vercel.app/#practice';
export const PRACTICE_URL = 'https://ndosisimplifiedautomation.vercel.app/#practice';

export interface UserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class PracticePage extends Helper {
  constructor(public readonly page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto(PRACTICE_URL);
  }

  async signUp(credentials: UserCredentials): Promise<void> {
    await this.clickElement(this.page.getByRole('button', { name: 'Sign Up Here' }));
    await this.fillInput(this.page.getByRole('textbox', { name: 'First Name' }), credentials.firstName);
    await this.fillInput(this.page.getByRole('textbox', { name: 'Last Name' }), credentials.lastName);
    await this.fillInput(this.page.getByRole('textbox', { name: 'Email' }), credentials.email);
    await this.fillInput(this.page.getByRole('textbox', { name: 'Password', exact: true }), credentials.password);
    await this.fillInput(this.page.getByRole('textbox', { name: 'Confirm Password' }), credentials.password);

    const groupSelector = this.page.getByRole('combobox');
    await expect(groupSelector.locator('option').nth(1)).toBeAttached();
    await groupSelector.selectOption({ index: 1 });

    await this.clickElement(this.page.getByRole('button', { name: 'Create Account' }));
  }

  async expectSignupSubmitted(email: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Login to Access Learning Materials' }),
    ).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Email' })).toHaveValue(email);
  }

  async logIn(email: string, password: string): Promise<void> {
    await this.fillInput(this.page.getByRole('textbox', { name: 'Email' }), email);
    await this.fillInput(this.page.getByRole('textbox', { name: 'Password', exact: true }), password);
    await this.clickElement(this.page.getByRole('button', { name: 'Login', exact: true }));
  }

  async expectLoggedIn(firstName: string): Promise<void> {
    // await expect(this.page).toHaveURL(/#dashboard/);
    await expect(
      this.page.getByRole('heading', { name: new RegExp(`Welcome back,\\s*${firstName}`, 'i') }),
    ).toBeVisible();
  }
}
