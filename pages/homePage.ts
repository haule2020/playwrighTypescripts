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

    async viewProduct(data: any) {
        //Click products, verify api responses
        await expect(this.productElements.first()).toBeVisible()
        const viewProduct =
            this.page.waitForResponse(req =>
                req.url().includes('/view') && req.status() === 200
            );
        await this.page.click(`text=${data.title}`)
        const response = await viewProduct;
        const bodyjson = await response.json()
        //Verify product details
        expect(bodyjson.cat).toBe(data.cat)
        expect(bodyjson.desc).toBe(data.desc)
        expect(bodyjson.id).toBe(data.id)
        expect(bodyjson.img).toBe(data.img)
        expect(bodyjson.price).toBe(data.price)

    }

    async addTocart(product: string): Promise<string> {
    
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