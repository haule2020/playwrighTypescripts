import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { getAndAcceptAlert } from '../utils/alertHelpers';

export class HomePage extends BasePage {
    readonly productElements: Locator;
    readonly addToCartButton: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.productElements = page.locator('.card-title a');
        this.addToCartButton = page.locator('text=Add to cart');
        this.cartLink = page.locator('#cartur');
    }

    async viewProductPage() {

        //Verify products loaded 
        const viewProduct =
            this.page.waitForResponse(req =>
                req.url().includes('/entries') && req.status() === 200
            );

        await this.goto()
        const body = await viewProduct;
        await expect(this.productElements.first()).toBeVisible()

    }

    async viewProductCategory(category: string) {
        const categoryButton = this.page.locator(`//*[@id="itemc" and text()= '${category}']`);

        const responsePromise =
            this.page.waitForResponse(req =>
                req.url().includes('/bycat') && req.status() === 200
            );
        await categoryButton.click();
        const response = await responsePromise;
        const bodyjson = await response.json()
        expect(response).toBeDefined();
    }

    async addTocart(product: string): Promise<string> {
        await expect(this.productElements.first()).toBeVisible()

        //Click on product and check api response status
        const [viewProduct] = await Promise.all([
            this.page.waitForResponse(req =>
                req.url().includes('/view') && req.status() === 200
            ),
            await this.page.click(`text=${product}`)
        ]);

        const requestPayloadString = JSON.stringify(viewProduct);
        expect(requestPayloadString).toBeDefined();

        //Click add to cart and check api request payload
        const [viewCart] = await Promise.all([
            this.page.waitForRequest(req =>
                req.url().includes('/addtocart') && req.method() === 'POST'
            ),
            this.addToCartButton.click()
        ]);
        const viewcartPayloadString = viewCart.postData();
        expect(viewcartPayloadString).toBeDefined();
        const viewcartPayloadJson = JSON.parse(viewcartPayloadString!);
        //Get itemAddedId 
        const itemAddedId = viewcartPayloadJson.id;
        console.log('itemAddedId is: ' + itemAddedId)

        // Verify alert message and accept
        const alertPromise = await getAndAcceptAlert(this.page, 'Product added');
        return itemAddedId!;
    }

}