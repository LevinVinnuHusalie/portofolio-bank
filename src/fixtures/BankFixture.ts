import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { AccountsPage } from "../pages/AccountsPage";
import { TransactionsPage } from "../pages/TransactionsPage";

const adminUsername = `${process.env.ADMIN_USERNAME}`;
const adminPassword = `${process.env.ADMIN_PASSWORD}`;

export const test = base.extend<{
    loginPage: LoginPage;
    mainPage: MainPage;
    accountsPage: AccountsPage;
    transactionsPage: TransactionsPage;
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goToUrl(`${process.env.BASE_URL}`);
        await loginPage.assertInLoginPage();
        await use(loginPage);
    },
    mainPage: async ({ page }, use) => {
        const mainPage = new MainPage(page);
        await mainPage.login(`${process.env.BASE_URL}`, adminUsername, adminPassword);
        await use(mainPage);
    },
    accountsPage: async ({ page }, use) => {
        const accountsPage = new AccountsPage(page);
        await accountsPage.login(adminUsername, adminPassword);
        await page.getByTestId("nav-accounts").click();
        await use(accountsPage);
    },
    transactionsPage: async ({ page }, use) => {
        const transactionsPage = new TransactionsPage(page);
        const dateList = ["2026-01-15", "2026-02-05", "2026-02-12", "2026-03-03", "2026-03-24", "2026-04-02", "2026-04-05"];
        await transactionsPage.login(adminUsername, adminPassword);
        await transactionsPage.prepareData(dateList);
        await use(new TransactionsPage(page));
    },
});

export { expect } from "@playwright/test";
