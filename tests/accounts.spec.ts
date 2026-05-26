import { test, expect } from "../src/fixtures/BankFixture";
import { TestData, UIMessages, AppConstants } from "../src/config";

test.describe("AccountsPage Test Cases", () => {
    test("TC01. Validate AccountPage Skeleton", async ({ page, accountsPage }) => {
        // Assert summary section visibilty
        await accountsPage.assertSummaryBar();

        // Assert filter section visibility
        await expect(page.locator("#filters-section")).toBeVisible();

        // Assert accounts table and heading
        await accountsPage.assertAccountTable(TestData.Accounts.TABLE_HEADERS);

        // Assert inital accounts are 2
        await accountsPage.countAccountRow(2);
    });

    test("TC02. Accounts Filter", async ({ page, accountsPage }) => {
        const account1 = TestData.DEFAULT_ACCOUNT_1;
        const account2 = TestData.DEFAULT_ACCOUNT_2;

        // Assert initial account order
        await accountsPage.assertAccountsOrder(account1, account2);

        // Sort by date created and assert account order
        await accountsPage.sortBy(TestData.Accounts.SORT_OPTIONS.BY_DATE_CREATED);
        await accountsPage.assertAccountsOrder(account2, account1);

        // Sort by account name and assert account order
        await accountsPage.sortBy(TestData.Accounts.SORT_OPTIONS.BY_ACCOUNT_NAME);
        await accountsPage.assertAccountsOrder(account1, account2);

        // Sort by balance and assert account order
        await accountsPage.sortBy(TestData.Accounts.SORT_OPTIONS.BY_BALANCE);
        await accountsPage.assertAccountsOrder(account2, account1);

        // Filter by account type and assert filtered account is displayed
        await page.getByTestId("filter-type-select").click();
        await page.getByRole("option", { name: TestData.Accounts.ACCOUNT_TYPE_SAVINGS }).click();
        await accountsPage.assertAccountsAfterFilter(account2);

        // Reset filter and assert account order = initial
        await page.getByTestId("reset-filters-button").click();
        await accountsPage.assertAccountsOrder(account1, account2);

        // Search account by name and assert the account is displayed
        await page.getByTestId("search-input").click();
        await page.getByTestId("search-input").fill(account1);
        await accountsPage.assertAccountsAfterFilter(account1);
    });

    test("TC03. Account Edit Action", async ({ page, accountsPage }) => {
        const editAccountWizard = page.getByTestId("account-modal");

        // Click edit account button
        await accountsPage
            .accountRow(TestData.DEFAULT_ACCOUNT_1)
            .getByRole("button", { name: `Edit account ${TestData.DEFAULT_ACCOUNT_1}` })
            .click();
        // Assert edit account wizard is displayed
        await expect(editAccountWizard).toBeVisible();
        await expect(editAccountWizard.getByRole("heading")).toBeVisible();
        await expect(editAccountWizard.getByRole("paragraph")).toBeVisible();

        // Update account information
        await accountsPage.editAccount(TestData.Accounts.UPDATED_ACCOUNT_1.name, TestData.Accounts.UPDATED_ACCOUNT_1.type, TestData.Accounts.UPDATED_ACCOUNT_1.balance, true);

        // Assert account is updated
        await accountsPage.assertAccountRecord(TestData.Accounts.UPDATED_ACCOUNT_1.name, TestData.Accounts.UPDATED_ACCOUNT_1.displayType, TestData.Accounts.UPDATED_ACCOUNT_1.expectedBalance, TestData.Accounts.UPDATED_ACCOUNT_1.status);

        await accountsPage
            .accountRow(TestData.DEFAULT_ACCOUNT_2)
            .getByRole("button", { name: `Edit account ${TestData.DEFAULT_ACCOUNT_2}` })
            .click();

        await accountsPage.editAccount(TestData.Accounts.UPDATED_ACCOUNT_2.name, TestData.Accounts.UPDATED_ACCOUNT_2.type, TestData.Accounts.UPDATED_ACCOUNT_2.balance, false);

        await accountsPage.assertAccountRecord(TestData.Accounts.UPDATED_ACCOUNT_2.name, TestData.Accounts.UPDATED_ACCOUNT_2.displayType, TestData.Accounts.UPDATED_ACCOUNT_2.expectedBalance, TestData.Accounts.UPDATED_ACCOUNT_2.status);

        await accountsPage.countAccountRow(2);
    });

    test("TC04. Account Delete Action", async ({ page, accountsPage }) => {
        // Assert initial condition = 2 accounts
        await accountsPage.countAccountRow(2);
        // Click delete button
        await accountsPage
            .accountRow(TestData.DEFAULT_ACCOUNT_1)
            .getByRole("button", { name: `Delete account ${TestData.DEFAULT_ACCOUNT_1}` })
            .click();
        await page.getByTestId("confirm-delete-button").click();
        // Assert account is deleted
        await accountsPage.countAccountRow(1);
        await expect(accountsPage.tableBody.locator(":scope > tr")).not.toContainText(TestData.DEFAULT_ACCOUNT_1);
    });

    test("TC05. Check table paging", async ({ page, accountsPage }) => {
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
