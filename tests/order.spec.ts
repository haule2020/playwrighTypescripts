import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { CartPage } from '../pages/cartPage';
import { OrderPage } from '../pages/orderPage';
import customerInfo from '../testData/customerInfo.json'
import testdata from '../testData/placeOrderData.json';

test.describe('Place order', () => {
  for (const item of testdata) {

    test(`Place order ${item.product} from ${item.category}`, async ({ page }) => {
      const homePage = new HomePage(page);
      const cartPage = new CartPage(page);
      const orderPage = new OrderPage(page);

      await homePage.viewProductPage();
      await homePage.viewProductCategory(item.category);
      const itemAddedId = await homePage.addTocart(item.product);
      await cartPage.viewCart(itemAddedId);
      await cartPage.openOrderModal();
      await orderPage.inputOrderData(customerInfo);
      await orderPage.submitOrder();
    });
  }
})






