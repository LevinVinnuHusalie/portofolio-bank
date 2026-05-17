import { test, expect, Locator } from "@playwright/test";

let heading: Locator, usernameInput: Locator, passwordInput: Locator, loginButton: Locator, userInfo: Locator, logoutButton: Locator, toggle: Locator, rememberCheckBox: Locator;

test.beforeEach("Authenticate", async ({ page }) => {
    usernameInput = page.getByTestId("username-input");
    passwordInput = page.getByTestId("password-input");
    loginButton = page.getByTestId("login-button");

    await page.goto(`${process.env.BASE_URL}`);
    //Input admin username
    await usernameInput.click();
    await usernameInput.fill(`${process.env.ADMIN_USERNAME}`);

    //Input admin password
    await passwordInput.click();
    await passwordInput.fill(`${process.env.ADMIN_PASSWORD}`);

    //Click login
    await loginButton.click();

    await page.getByTestId("nav-accounts").click();
});

test.describe("AccountsPage Test Cases", () => {
    test("TC01. Validate AccountPage Skeleton", async ({ page }) => {
        const summaryBar = page.getByTestId("accounts-summary-bar");
        const totalBalanceBar = summaryBar.getByTestId("summary-total-balance");
        const totalAccountsBar = summaryBar.getByTestId("summary-total-accounts");
        const activeAccountsBar = summaryBar.getByTestId("summary-active-accounts");
        const filteredAccountBar = summaryBar.getByTestId("summary-filtered-accounts");
        const tableBody = page.getByTestId("accounts-tbody");

        // Assert summary section visibilty
        await expect(summaryBar).toBeVisible();
        await expect(totalBalanceBar).toBeVisible();
        await expect(totalAccountsBar).toBeVisible();
        await expect(activeAccountsBar).toBeVisible();
        await expect(filteredAccountBar).toBeVisible();

        // Assert filter section visibility
        await expect(page.locator("#filters-section")).toBeVisible();

        // Assert accounts table and heading
        await expect(page.getByRole("heading", { name: "Your Bank Accounts" })).toBeVisible();
        await expect(page.getByTestId("accounts-table")).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Account Number" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Type" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Balance" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Actions" })).toBeVisible();

        // Assert inital accounts are 2
        await expect(tableBody.locator(":scope > tr")).toHaveCount(2);
    });

    test("TC02. Accounts Filter", async ({ page }) => {
        const tableBody = page.getByTestId("accounts-tbody");

        // Assert initial account order
        await expect(tableBody.getByRole("row").first().getByTestId("account-name")).toHaveText("Checking Account");
        await expect(tableBody.getByRole("row").nth(1).getByTestId("account-name")).toHaveText("Primary Savings");

        // Sort by date created and assert account order
        await page.getByTestId("sort-by-select").click();
        await page.getByRole("option", { name: "Date Created" }).click();
        await expect(tableBody.getByRole("row").first().getByTestId("account-name")).toHaveText("Primary Savings");
        await expect(tableBody.getByRole("row").nth(1).getByTestId("account-name")).toHaveText("Checking Account");

        // Sort by account name and assert account order
        await page.getByTestId("sort-by-select").click();
        await page.getByRole("option", { name: "Account Name" }).click();
        await expect(tableBody.getByRole("row").first().getByTestId("account-name")).toHaveText("Checking Account");
        await expect(tableBody.getByRole("row").nth(1).getByTestId("account-name")).toHaveText("Primary Savings");

        // Sort by balance and assert account order
        await page.getByTestId("sort-by-select").click();
        await page.getByRole("option", { name: "Balance" }).click();
        await expect(tableBody.getByRole("row").first().getByTestId("account-name")).toHaveText("Primary Savings");
        await expect(tableBody.getByRole("row").nth(1).getByTestId("account-name")).toHaveText("Checking Account");

        // Filter by account type and assert filtered account is displayed
        await page.getByTestId("filter-type-select").click();
        await page.getByRole("option", { name: "Savings" }).click();
        await expect(tableBody.locator(":scope > tr")).toHaveCount(1);
        await expect(tableBody.getByRole("row").getByTestId("account-name")).toHaveText("Primary Savings");

        // Reset filter and assert account order = initial
        await page.getByTestId("reset-filters-button").click();
        await expect(tableBody.getByRole("row").first().getByTestId("account-name")).toHaveText("Checking Account");
        await expect(tableBody.getByRole("row").nth(1).getByTestId("account-name")).toHaveText("Primary Savings");

        // Search account by name and assert the account is displayed
        await page.getByTestId("search-input").click();
        await page.getByTestId("search-input").fill("Checking Account");
        await expect(tableBody.locator(":scope > tr")).toHaveCount(1);
        await expect(tableBody.getByRole("row").getByTestId("account-name")).toHaveText("Checking Account");
    });

    test("TC03. Account Edit Action", async ({ page }) => {
        const accountRow = page.getByTestId("accounts-tbody").getByRole("row").filter({ hasText: "Checking Account" });
        const editButton = accountRow.getByRole("button", { name: "Edit account Checking Account" });
        const editAccountWizard = page.getByTestId("account-modal");
        const editAccountWizardTitle = editAccountWizard.getByRole("heading");
        const editAccountWizardDescription = editAccountWizard.getByRole("paragraph");
        const accountNameField = page.getByTestId("account-name-input");
        const accountTypeField = page.getByTestId("account-type-select");
        const initialBalanceField = page.getByTestId("initial-balance-input");
        const saveAccountButton = page.getByTestId("save-account-button");

        // Click edit account button
        await editButton.click();
        // Assert edit account wizard is displayed
        await expect(editAccountWizard).toBeVisible();
        await expect(editAccountWizardTitle).toBeVisible();
        await expect(editAccountWizardDescription).toBeVisible();

        // Update account information
        await accountNameField.click();
        await accountNameField.fill("Checking Account Updated");
        await accountTypeField.click();
        await page.getByRole("option", { name: "Credit Card" }).click();
        await initialBalanceField.click();
        await initialBalanceField.fill("3000");
        await saveAccountButton.click();

        // Assert account is updated
        await expect(accountRow.getByTestId("account-name")).toHaveText("Checking Account Updated");
        await expect(accountRow.getByTestId("account-type")).toHaveText("Credit");
        await expect(accountRow.getByTestId("account-balance")).toHaveText("$3,000.00");
    });

    test("TC04. Account Delete Action", async ({ page }) => {
        const tableBody = page.getByTestId("accounts-tbody");
        const accountRow = page.getByTestId("accounts-tbody").getByRole("row").filter({ hasText: "Checking Account" });
        const deleteButton = accountRow.getByRole("button", { name: "Delete account Checking Account" });

        // Assert initial condition = 2 accounts
        await expect(tableBody.locator(":scope > tr")).toHaveCount(2);
        // Click delete button
        await deleteButton.click();
        await page.getByTestId("confirm-delete-button").click();
        // Assert account is deleted
        await expect(tableBody.locator(":scope > tr")).toHaveCount(1);
        await expect(tableBody.locator(":scope > tr")).not.toContainText("Checking Account");
    });

    test("TC05. Check table paging", async ({ page }) => {
        const addAccountButton = page.getByTestId("quick-add-account");
        const accountNameField = page.getByTestId("account-name-input");
        const accountTypeField = page.getByTestId("account-type-select");
        const balanceField = page.getByTestId("initial-balance-input");
        const saveAccountButton = page.getByTestId("save-account-button");
        const tableBody = page.getByTestId("accounts-tbody");

        const addAccount = async (amount: number) => {
            for (let index = 1; index <= amount; index++) {
                await page.getByTestId("nav-dashboard").click();
                await addAccountButton.click();
                await accountNameField.click();
                await accountNameField.fill(`Testing Account ${index}`);
                await accountTypeField.click();
                await page.getByRole("option", { name: "Credit Card" }).click();
                await balanceField.click();
                await balanceField.fill("2000");
                await saveAccountButton.click();
            }
        };
        // Precondition: Create 5 accounts
        await addAccount(5);

        // Assert total 7 accounts are displayed
        await expect(tableBody.locator(":scope > tr")).toHaveCount(7);
        // Assert second page is not visible
        await expect(page.getByTestId("pagination-page-2")).not.toBeVisible();

        // Change row per page value -> 5
        await page.getByTestId("rows-per-page-select").click();
        await page.getByRole("option", { name: "5", exact: true }).click();
        // Assert only 5 accounts are displayed
        await expect(tableBody.locator(":scope > tr")).toHaveCount(5);

        // Assert second page is visible
        await expect(page.getByTestId("pagination-page-2")).toBeVisible();
        // Go to second page
        await page.getByTestId("pagination-next").click();
        // Assert the rest of accounts are displayed
        await expect(tableBody.locator(":scope > tr")).toHaveCount(2);
    });
});
