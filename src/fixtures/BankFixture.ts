import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { AccountsPage } from "../pages/AccountsPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import fs from "fs";

export const test = base.extend<{
    loginPage: LoginPage;
    mainPage: MainPage;
    accountsPage: AccountsPage;
    transactionsPage: TransactionsPage;
}>({
    context: async ({ browser }, use) => {
        const sessionStorage = JSON.parse(fs.readFileSync("playwright/.auth/session.json", "utf-8"));

        const context = await browser.newContext({
            storageState: "playwright/.auth/user.json",
        });

        await context.addInitScript((storage) => {
            for (const [key, value] of Object.entries(storage)) {
                window.sessionStorage.setItem(key, value as string);
            }
        }, sessionStorage);

        await use(context);

        await context.close();
    },
    page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
    },
    loginPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goToUrl(`${process.env.BASE_URL}`);
        await loginPage.assertInLoginPage();
        await use(loginPage);
    },
    mainPage: async ({ page }, use) => {
        await page.goto(`${process.env.BASE_URL}`);
        await use(new MainPage(page));
    },
    accountsPage: async ({ page }, use) => {
        await page.goto(`${process.env.BASE_URL}`);
        await page.getByTestId("nav-accounts").click();
        await use(new AccountsPage(page));
    },
    transactionsPage: async ({ page }, use) => {
        const transactionsPage = new TransactionsPage(page);
        const dateList = ["2026-01-15", "2026-02-05", "2026-02-12", "2026-03-03", "2026-03-24", "2026-04-02", "2026-04-05"];
        await page.goto(`${process.env.BASE_URL}`);
        await transactionsPage.prepareData(dateList);
        await use(transactionsPage);
    },
});

export { expect } from "@playwright/test";
