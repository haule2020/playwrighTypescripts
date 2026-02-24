import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class OrderPage extends BasePage {
    readonly productElements: Locator;
    readonly txtName: Locator;
    readonly txtCountry: Locator;
    readonly txtCity: Locator;
    readonly txtCreditCard: Locator;
    readonly txtMonth: Locator;
    readonly txtYear: Locator;
    readonly btnPurchase: Locator;
    readonly btnOK: Locator;

    constructor(page: Page) {
        super(page);
        this.productElements = page.locator('.card-title a');
        this.txtName = page.locator('#name');
        this.txtCountry = page.locator('#country');
        this.txtCity = page.locator('#city');
        this.txtCreditCard = page.locator('#card');
        this.txtMonth = page.locator('#month');
        this.txtYear = page.locator('#year');
        this.btnPurchase = page.locator('button', { hasText: 'Purchase' });
        this.btnOK = page.locator('button', { hasText: 'OK' });
    }

    async inputOrderData(data: any) {
        await this.txtName.fill(data.name)
        await this.txtCountry.fill(data.country)
        await this.txtCity.fill(data.city)
        await this.txtCreditCard.fill(data.card)
        await this.txtMonth.fill(data.month)
        await this.txtYear.fill(data.year)
    }

    async submitOrder() {

        const responsePromise =
            this.page.waitForResponse(req =>
                req.url().includes('/deletecart') && req.status() === 200
            );
        //Click btnPurchase
        await this.btnPurchase.click();
        //Verify item is removed afrer order completed
        const response = await responsePromise;
        expect(response).toBeDefined();
        const responseBody = await response.json()

        expect(responseBody).toContain("Item deleted.")
        //Click Confrirmation
        await this.btnOK.click();

    }
}