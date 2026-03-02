
import { test, expect, request } from '@playwright/test';
import * as crypto from 'crypto';
import { CartApiHelper } from '../../api/cartApiHelpers';
import products from '../../testData/placeOrderData.json';


test.describe('Place order', () => {
  let apiContext: any;
  let cartHelper: CartApiHelper;
  const uniqueId = crypto.randomUUID();
  const cookie = crypto.randomUUID();

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    cartHelper = new CartApiHelper(apiContext);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  for (const item of products) {
    test(`Place order  ${item.title} from ${item.category}`, async () => {
      //Add to cart api
      const addToCartResponse = cartHelper.addToCart(uniqueId, cookie, item.id, false)
      expect((await addToCartResponse).status()).toBe(200)

      // View cart Api Verify product exists in cart
      const viewResult = await cartHelper.viewCart(cookie, false);
      const viewResultJson = await viewResult.json();
      const viewItems = await viewResultJson.Items;
      const productExistsInCart = viewItems.some(
        (p: any) => p.id === uniqueId,
      );
      expect(productExistsInCart).toBeTruthy();

      //checkout item
      const checkout = await cartHelper.checkout(cookie);
      const bodyJson = await checkout.json();
      expect(bodyJson).toBe('Item deleted.')

      //Check all all items are removed afer checkout
      const viewCartAfterCheckout = await cartHelper.viewCart(cookie, false);
      const viewCartAfterCheckoutJson = await viewCartAfterCheckout.json();
      expect(viewCartAfterCheckoutJson).toBeEmpty
    });
  }
});