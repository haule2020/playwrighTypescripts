import { Page, expect } from '@playwright/test';

export async function getAndAcceptAlert(page: Page, expectedMessage?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    page.once('dialog', async (dialog) => {
      try {
        const message = dialog.message(); 
        if (expectedMessage) {
          expect(message).toContain(expectedMessage);
        }
        
        await dialog.accept(); // Accepts alert/confirm/prompt
        resolve(message);
      } catch (error) {
        reject(error);
      }
    });
  });
}