import { APIRequestContext } from '@playwright/test';
import { enpoints } from './apiEndpoints';

export class CartApiHelper {

    private apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;

    }

    async addToCart(id: string, cookie: string, prodId: number, flag: boolean) {
        const response = await this.apiContext.post(enpoints.addtocart, {
            data: {
                id: id,
                cookie: 'user=' + cookie,
                prod_id: prodId,
                flag: flag,
            },
        });
        if (!response.ok()) {
            throw new Error(`Add to cart failed: ${response.status()} 
            ${response.statusText()}`);
        }
        return response;
    }
    async viewCart(cookie: string, flag: boolean) {
        const response = await this.apiContext.post(enpoints.viewcart, {
            data: {
                cookie: 'user=' + cookie,
                flag: flag,

            },
        });

        if (!response.ok()) {
            throw new Error(`View cart failed: ${response.status()} ${response.statusText()}`);
        }

        return response;
    }

    async checkout(cookie: string) {
        const response = await this.apiContext.post(enpoints.checkout, {
            data: {
                cookie: 'user=' + cookie,
            },
        });
        if (!response.ok()) {
            throw new Error(`check out failed: ${response.status()} ${response.statusText()}`);
        }
        return response;
    }
}