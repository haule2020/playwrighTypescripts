import { chromium, FullConfig } from '@playwright/test';

import { LoginPage } from '../pages/loginPage';
import { credentials } from '../testData/loginData';

const authFilepath = 'playwright/.auth/storageState.json'

async function globalSetup(config: FullConfig) {

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto('');
    await loginPage.openLoginModal();
    await loginPage.login(credentials.validUser.username, credentials.validUser.password)

    // Save storage state for reuse 
    await context.storageState({ path: authFilepath});

    await browser.close();
}

export default globalSetup;