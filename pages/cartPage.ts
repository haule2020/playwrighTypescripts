import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
    readonly productElements: Locator;
    readonly placeOrderButton: Locator;
    readonly cartLink: Locator;
    readonly listItems: Locator

    constructor(page: Page) {
        super(page);
        this.productElements = page.locator('.card-title a');
        this.placeOrderButton = page.locator('button', { hasText: 'Place Order' });
        this.cartLink = page.locator('#cartur');
        this.listItems = page.locator('//*[text() = "Delete"]');
    }

    async viewCart(itemAddedId: string) {
        const [responsePromise] = await Promise.all([
            this.page.waitForResponse(req =>
                req.url().includes('/viewcart') && req.status() === 200
            ),
            this.cartLink.click()
        ]);
        await expect(this.listItems.first()).toBeVisible();
        const response = responsePromise;
        expect(response).toBeDefined();
        const responseBody = await response.json()
        const listProductAdded = await responseBody.Items;
        //API check that product is added
        const productExistsInCart = listProductAdded.some(
            (item: any) => item.id === itemAddedId
        );
        expect(productExistsInCart).toBeTruthy();

    }

    async removeProduct(itemAddedId: string) {
        const deleteItemButton = this.page.locator(`//*[@onclick="deleteItem('${itemAddedId}')"]`)
        const [responsePromise] = await Promise.all([
            this.page.waitForResponse(req =>
                req.url().includes('/viewcart') && req.status() === 200
            ),
            await deleteItemButton.click()
        ]);

        const response = await responsePromise;
        expect(response).toBeDefined();
        const responseBody = await response.json()
        const listProductAdded = await responseBody.Items;
        //Check that product is rmoved
        const productExistsInCart = listProductAdded.some(
            (item: any) => item.id === itemAddedId
        );
        expect(productExistsInCart).not.toBeTruthy()
    }

    async openOrderModal() {
        await this.placeOrderButton.click();
        await this.waitForModal('#orderModal')
    }
}