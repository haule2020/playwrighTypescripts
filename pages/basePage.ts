import {Page} from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly baseUrl: string;

    constructor(page: Page, baseUrl: string = 'https://www.demoblaze.com') {
        this.page = page;
        this.baseUrl = baseUrl;
    }

    async goto(path: string = '') {
        await this.page.goto(`${this.baseUrl}/${path}`);
    }
    async gotoHomePage(path: string = 'index.html') {
        await this.page.goto(`${this.baseUrl}/${path}`);
    }
    async getTitle(): Promise<string> { return this.page.title(); }

    async waitForModal(modalSelector: string) {
        await this.page.locator(modalSelector).waitFor({ state: 'visible' });
    }

    async closeModal(modalSelector: string) {
        await this.page.locator(`${modalSelector} .btn-secondary`).click();
    }

}