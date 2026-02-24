import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { credentials } from '../testData/loginData';
import { getAndAcceptAlert } from '../utils/alertHelpers';

//ignores the global storageState
test.use({ storageState: { cookies: [], origins: [] } });

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('');
  await loginPage.openLoginModal();
  await loginPage.login(credentials.validUser.username, credentials.validUser.password)
});

test('Login with in valid credentials', async ({ page }) => {

  const loginPage = new LoginPage(page);
  await loginPage.goto('');
  await loginPage.openLoginModal();
  await loginPage.invalidLogin(credentials.invalidUser.username, credentials.invalidUser.password)

// Verify alert message and accept
  const alertPromise =  getAndAcceptAlert(page,'Wrong password');
  const alertMessage =  await alertPromise;
  console.log('Verified message:', alertMessage);

});