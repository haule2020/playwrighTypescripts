
import { test, expect, request, APIRequestContext } from '@playwright/test';
import products from '../../testData/api/addToCartData.json';
import * as crypto from 'crypto';
import { CartApiHelper } from '../../api/cartApiHelpers';

test.describe('Add to cart', () => {
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
    test(`Add ${item.title} from ${item.cat} to cart`, async () => {
      //Add to cart api
      const response = cartHelper.addToCart(uniqueId, cookie, item.id, false)
      expect((await response).status()).toBe(200)
      // View cart Api 
      const viewResult = await cartHelper.viewCart(cookie, false);
      const viewResultJson = await viewResult.json();
      const viewItems = await viewResultJson.Items;
      // verify id and prod_id 
      expect(viewItems).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: uniqueId }), expect.objectContaining({ prod_id: item.id })
      ]));
    });
  }
});