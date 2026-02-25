import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { CartPage } from '../pages/cartPage';
import products from '../testData/addToCartData.json';


test.describe('Add to cart', () => {
  for (const item of products) {
    test(`Add ${item.title} from ${item.category} to cart`, async ({ page }) => {
      const homePage = new HomePage(page);
      const cartPage = new CartPage(page);
      // view home page
      await homePage.viewProductPage();
      // Click on category
      await homePage.viewProductCategory(item.category);
      //Verify products
      await homePage.viewProduct(item);
      // Add to cart, get itemAddedId 
      const itemAddedId = await homePage.addTocart(item.title);
      // Verify product is in cart
      await cartPage.viewCart(itemAddedId);
    });
  }
})

test.describe('Remove product from cart', () => {
  for (const item of products) {
    test(`Remove ${item.title} of ${item.category} from cart`, async ({ page }) => {
      const homePage = new HomePage(page);
      const cartPage = new CartPage(page);
      // Go to Prodcut store page
      await homePage.viewProductPage();
      //Click product category
      await homePage.viewProductCategory(item.category);
      await homePage.viewProduct(item);
      //Add to cart
      const itemAddedId = await homePage.addTocart(item.title);
      //view cart
      await cartPage.viewCart(itemAddedId);
      // remove product from cart
      await cartPage.removeProduct(itemAddedId);
    });
  }
})
