import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { AccountsPage } from "../pages/AccountsPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { AppConstants, TestData } from "../config";
import fs from "fs";
import path from "path";

/**
 * Load session storage safely with fallback
 */
function loadSessionStorage(): Record<string, string> {
    const sessionFilePath = path.join(__dirname, "../../playwright/.auth/session.json");

    try {
        if (fs.existsSync(sessionFilePath)) {
            return JSON.parse(fs.readFileSync(sessionFilePath, "utf-8"));
        }
        console.warn("⚠️  Session storage file not found. Running auth setup first.");
        return {};
    } catch (error) {
        console.warn("⚠️  Failed to load session storage. Running auth setup first.", error);
        return {};
    }
}

export const test = base.extend<{
    loginPage: LoginPage;
    mainPage: MainPage;
    accountsPage: AccountsPage;
    transactionsPage: TransactionsPage;
}>({
    context: async ({ browser }, use) => {
        const sessionStorage = loadSessionStorage();
        const storageStatePath = path.join(__dirname, "../../playwright/.auth/user.json");

        const context = await browser.newContext({
            storageState: fs.existsSync(storageStatePath) ? storageStatePath : undefined,
        });

        if (Object.keys(sessionStorage).length > 0) {
            await context.addInitScript((storage) => {
                for (const [key, value] of Object.entries(storage)) {
                    window.sessionStorage.setItem(key, value as string);
                }
            }, sessionStorage);
        }

        await use(context);

        // await context.close();
    },
    page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
    },
    loginPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goToUrl(AppConstants.URLs.LOGIN_PAGE);
        await loginPage.assertInLoginPage();
        await use(loginPage);
    },
    mainPage: async ({ page }, use) => {
        await page.goto(AppConstants.URLs.DASHBOARD_PAGE);
        await use(new MainPage(page));
    },
    accountsPage: async ({ page }, use) => {
        await page.goto(AppConstants.URLs.ACCOUNTS_PAGE);
        await page.getByTestId("nav-accounts").click();
        await use(new AccountsPage(page));
    },
    transactionsPage: async ({ page }, use) => {
        const transactionsPage = new TransactionsPage(page);
        await page.goto(AppConstants.URLs.DASHBOARD_PAGE);
        await use(transactionsPage);
    },
});

export { expect } from "@playwright/test";
