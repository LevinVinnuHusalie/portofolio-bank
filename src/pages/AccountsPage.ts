import { expect, Locator, Page } from "@playwright/test";

export class AccountsPage {
    readonly table: Locator;
    readonly tableBody: Locator;
    readonly sortByButton: Locator;

    constructor(readonly page: Page) {
        this.table = page.getByTestId("accounts-table");
        this.tableBody = page.getByTestId("accounts-tbody");
        this.sortByButton = page.getByTestId("sort-by-select");
    }

    accountRow(accountName: string): Locator {
        return this.tableBody.getByRole("row").filter({ hasText: accountName });
    }

    async login(username: string, password: string) {
        const usernameInput = this.page.getByTestId("username-input");
        const passwordInput = this.page.getByTestId("password-input");
        const loginButton = this.page.getByTestId("login-button");

        await this.page.goto(`${process.env.BASE_URL}`);
        //Input admin username
        await usernameInput.click();
        await usernameInput.fill(username);

        //Input admin password
        await passwordInput.click();
        await passwordInput.fill(password);

        //Click login
        await loginButton.click();
    }

    async assertSummaryBar() {
        const summaryBar = this.page.getByTestId("accounts-summary-bar").locator(":scope > div");
        await expect(summaryBar).toHaveCount(4);
        await expect(summaryBar.getByTestId("summary-total-balance")).toBeVisible();
        await expect(summaryBar.getByTestId("summary-total-accounts")).toBeVisible();
        await expect(summaryBar.getByTestId("summary-active-accounts")).toBeVisible();
        await expect(summaryBar.getByTestId("summary-filtered-accounts")).toBeVisible();
    }

    async assertAccountTable(headerList: string[]) {
        await expect(this.page.getByRole("heading", { name: "Your Bank Accounts" })).toBeVisible();
        await expect(this.table).toBeVisible();
        for (const header of headerList) {
            await expect(this.page.getByRole("columnheader", { name: header })).toBeVisible();
        }
    }

    async assertAccountsOrder(...accounts: string[]) {
        for (let index = 0; index < accounts.length; index++) {
            await expect(this.tableBody.getByRole("row").nth(index).getByTestId("account-name")).toHaveText(accounts[index]);
        }
    }

    async countAccountRow(amount: number) {
        await expect(this.tableBody.locator(":scope > tr")).toHaveCount(amount);
    }

    async sortBy(option: string) {
        await this.sortByButton.click();
        await this.page.getByRole("option", { name: option }).click();
    }

    async assertAccountsAfterFilter(account: string) {
        await expect(this.tableBody.locator(":scope > tr")).toHaveCount(1);
        await expect(this.tableBody.getByRole("row").getByTestId("account-name")).toHaveText(account);
    }

    async editAccount(accountName: string, accountType: string, balance: string, setActive: boolean) {
        const accountNameField = this.page.getByTestId("account-name-input");
        const accountTypeField = this.page.getByTestId("account-type-select");
        const initialBalanceField = this.page.getByTestId("initial-balance-input");
        const saveAccountButton = this.page.getByTestId("save-account-button");

        await accountNameField.click();
        await accountNameField.fill(accountName);
        await accountTypeField.click();
        await this.page.getByRole("option", { name: accountType }).click();
        await initialBalanceField.click();
        await initialBalanceField.fill(balance);
        if (!setActive) await this.page.getByTestId("status-inactive-radio").click();
        await saveAccountButton.click();
    }

    async assertAccountRecord(accountName: string, accountType: string, balance: string, status: string) {
        await expect(this.accountRow(accountName).getByTestId("account-name")).toHaveText(accountName);
        await expect(this.accountRow(accountName).getByTestId("account-type")).toHaveText(accountType);
        await expect(this.accountRow(accountName).getByTestId("account-balance")).toHaveText(balance);
        await expect(this.accountRow(accountName).getByTestId("account-status")).toHaveText(status);
    }

    async prepareAccounts(amount: number) {
        const addAccountButton = this.page.getByTestId("quick-add-account");
        const accountNameField = this.page.getByTestId("account-name-input");
        const accountTypeField = this.page.getByTestId("account-type-select");
        const balanceField = this.page.getByTestId("initial-balance-input");
        const saveAccountButton = this.page.getByTestId("save-account-button");
        for (let index = 1; index <= amount; index++) {
            await this.page.getByTestId("nav-dashboard").click();
            await addAccountButton.click();
            await accountNameField.click();
            await accountNameField.fill(`Testing Account ${index}`);
            await accountTypeField.click();
            await this.page.getByRole("option", { name: "Credit Card" }).click();
            await balanceField.click();
            await balanceField.fill("2000");
            await saveAccountButton.click();
        }
    }
}
