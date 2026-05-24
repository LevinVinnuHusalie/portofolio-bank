import { test, expect } from "@playwright/test";
import { AccountsPage } from "../src/pages/AccountsPage";

const adminUsername = `${process.env.ADMIN_USERNAME}`;
const adminPassword = `${process.env.ADMIN_PASSWORD}`;

test.beforeEach("Authenticate", async ({ page }) => {
    const accountsPage = new AccountsPage(page);
    await accountsPage.login(adminUsername, adminPassword);

    await page.getByTestId("nav-accounts").click();
});

test.describe("AccountsPage Test Cases", () => {
    test("TC01. Validate AccountPage Skeleton", async ({ page }) => {
        const accountsPage = new AccountsPage(page);

        // Assert summary section visibilty
        await accountsPage.assertSummaryBar();

        // Assert filter section visibility
        await expect(page.locator("#filters-section")).toBeVisible();

        const headerList = ["Account Number", "Name", "Type", "Balance", "Status", "Actions"];

        // Assert accounts table and heading
        await accountsPage.assertAccountTable(headerList);

        // Assert inital accounts are 2
        await accountsPage.countAccountRow(2);
    });

    test("TC02. Accounts Filter", async ({ page }) => {
        const accountsPage = new AccountsPage(page);
        const account1 = "Checking Account";
        const account2 = "Primary Savings";

        // Assert initial account order
        await accountsPage.assertAccountsOrder(account1, account2);

        // Sort by date created and assert account order
        await accountsPage.sortBy("Date Created");
        await accountsPage.assertAccountsOrder(account2, account1);

        // Sort by account name and assert account order
        await accountsPage.sortBy("Account Name");
        await accountsPage.assertAccountsOrder(account1, account2);

        // Sort by balance and assert account order
        await accountsPage.sortBy("Balance");
        await accountsPage.assertAccountsOrder(account2, account1);

        // Filter by account type and assert filtered account is displayed
        await page.getByTestId("filter-type-select").click();
        await page.getByRole("option", { name: "Savings" }).click();
        await accountsPage.assertAccountsAfterFilter("Primary Savings");

        // Reset filter and assert account order = initial
        await page.getByTestId("reset-filters-button").click();
        await accountsPage.assertAccountsOrder(account1, account2);

        // Search account by name and assert the account is displayed
        await page.getByTestId("search-input").click();
        await page.getByTestId("search-input").fill("Checking Account");
        await accountsPage.assertAccountsAfterFilter("Checking Account");
    });

    test("TC03. Account Edit Action", async ({ page }) => {
        const accountsPage = new AccountsPage(page);
        const editAccountWizard = page.getByTestId("account-modal");

        // Click edit account button
        await accountsPage.accountRow("Checking Account").getByRole("button", { name: "Edit account Checking Account" }).click();
        // Assert edit account wizard is displayed
        await expect(editAccountWizard).toBeVisible();
        await expect(editAccountWizard.getByRole("heading")).toBeVisible();
        await expect(editAccountWizard.getByRole("paragraph")).toBeVisible();

        // Update account information
        await accountsPage.editAccount("Checking Account Updated", "Credit Card", "3000", true);

        // Assert account is updated
        await accountsPage.assertAccountRecord("Checking Account Updated", "Credit", "$3,000.00", "Active");

        await accountsPage.accountRow("Primary Savings").getByRole("button", { name: "Edit account Primary Savings" }).click();

        await accountsPage.editAccount("Primary Savings Updated", "Checking Account", "1000", false);

        await accountsPage.assertAccountRecord("Primary Savings Updated", "Checking", "$1,000.00", "Inactive");

        await accountsPage.countAccountRow(2);
    });

    test("TC04. Account Delete Action", async ({ page }) => {
        const accountsPage = new AccountsPage(page);

        // Assert initial condition = 2 accounts
        await accountsPage.countAccountRow(2);
        // Click delete button
        await accountsPage.accountRow("Checking Account").getByRole("button", { name: "Delete account Checking Account" }).click();
        await page.getByTestId("confirm-delete-button").click();
        // Assert account is deleted
        await accountsPage.countAccountRow(1);
        await expect(accountsPage.tableBody.locator(":scope > tr")).not.toContainText("Checking Account");
    });

    test("TC05. Check table paging", async ({ page }) => {
        const accountsPage = new AccountsPage(page);
        const nextPage = page.getByTestId("pagination-page-2");
        // Precondition: Create 5 accounts
        await accountsPage.prepareAccounts(5);

        // Assert total 7 accounts are displayed
        await accountsPage.countAccountRow(7);
        // Assert second page is not visible
        await expect(nextPage).not.toBeVisible();

        // Change row per page value -> 5
        await page.getByTestId("rows-per-page-select").click();
        await page.getByRole("option", { name: "5", exact: true }).click();
        // Assert only 5 accounts are displayed
        await accountsPage.countAccountRow(5);

        // Assert second page is visible
        await expect(nextPage).toBeVisible();
        // Go to second page
        await nextPage.click();
        // Assert the rest of accounts are displayed
        await accountsPage.countAccountRow(2);
    });
});
