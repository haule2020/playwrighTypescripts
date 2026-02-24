import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {

    readonly loginButton: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitLoginButton: Locator;
    readonly welcomeUser: Locator;

    constructor(page: Page) {
        super(page);
        this.loginButton = page.locator('#login2');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.submitLoginButton = page.locator('button', { hasText: 'Log in' });
        this.welcomeUser = page.locator('#nameofuser');
    }
    async openLoginModal() {
        await this.loginButton.click();
        await this.waitForModal('#logInModal');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitLoginButton.click();
        await expect(this.welcomeUser).toBeVisible();
        await expect(this.welcomeUser).toContainText(username);
    }

    async invalidLogin(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitLoginButton.click();
    }
}