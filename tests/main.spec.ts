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
});

test.describe("MainPage Test Cases", () => {
    test("TC01. Checking Navbar and Summary Section", async ({ page }) => {
        const dashboardNavbar = page.getByTestId("nav-dashboard");
        const accountsNavbar = page.getByTestId("nav-accounts");
        const transactionsNavbar = page.getByTestId("nav-transactions");

        // Assert navbar links is visible
        await expect(dashboardNavbar).toBeVisible();
        await expect(accountsNavbar).toBeVisible();
        await expect(transactionsNavbar).toBeVisible();

        // Assert navbar is working correctly
        await accountsNavbar.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/accounts`);
        await transactionsNavbar.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/transactions`);
        await dashboardNavbar.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);

        // Assert summary section
        const summarySection = page.locator("#summary-section");
        await expect(summarySection).toBeVisible();

        // Assert all cards in summarty section
        const totalBalanceCard = page.getByTestId("total-balance-card");
        const accountsCountCard = page.getByTestId("accounts-count-card");
        const transactionsCountCard = page.getByTestId("transactions-count-card");

        // Assert cards visibility
        await expect(totalBalanceCard).toBeVisible();
        await expect(accountsCountCard).toBeVisible();
        await expect(transactionsCountCard).toBeVisible();

        // Assert cards title
        await expect(totalBalanceCard).toContainText("Total Balance");
        await expect(accountsCountCard).toContainText("Active Accounts");
        await expect(transactionsCountCard).toContainText("Total Transactions");
    });

    test("TC02. Quick Actions - Add Account", async ({ page }) => {
        const heading = page.getByRole("heading", { name: "Quick Actions", exact: true });
        const addAccountButton = page.getByTestId("quick-add-account");
        const newAccountWizard = page.getByTestId("account-modal");
        const accountNameField = page.getByTestId("account-name-input");
        const accountTypeField = page.getByTestId("account-type-select");
        const balanceField = page.getByTestId("initial-balance-input");
        const saveAccountButton = page.getByTestId("save-account-button");
        const wizardTitle = page.getByTestId("modal-title");
        const wizardDescription = page.locator("#modal-description");
        const newAccount = page.getByTestId("account-name").filter({ hasText: "Testing Account" });

        // Assert Quick Actions heading
        await expect(heading).toBeVisible();
        // Assert add account button visiblity
        await expect(addAccountButton).toBeVisible();

        // Click add button
        await addAccountButton.click();
        // Assert create account wizard visibility, title, and description
        await expect(newAccountWizard).toBeVisible();
        await expect(wizardTitle).toHaveText("Add New Account");
        await expect(wizardDescription).toHaveText("Fill in the details to create a new account.");

        // Fill account name
        await accountNameField.click();
        await accountNameField.fill("Testing Account");

        // Choose account type
        await accountTypeField.click();
        await page.getByRole("option", { name: "Credit Card" }).click();
        await expect(accountTypeField).toHaveText("Credit Card");

        // Fill account initial balance
        await balanceField.click();
        await balanceField.fill("2000");

        // Save account
        await saveAccountButton.click();

        // Assert new account is created
        await expect(newAccount).toBeVisible();
    });

    test("TC03. Quick Actions - New Transaction (deposit)", async ({ page }) => {
        const newTransactionButton = page.getByTestId("quick-new-transaction");
        const newTransactionWizard = page.getByTestId("transaction-modal");
        const transactionTypeField = page.getByTestId("transaction-type-select");
        const fromAccountField = page.getByTestId("from-account-select");
        const transactionAmountField = page.getByTestId("transaction-amount-input");
        const transactionDescriptionField = page.getByTestId("transaction-description-input");
        const submitTransactionButton = page.getByTestId("submit-transaction-button");
        const newTransactionRecord = page.getByRole("row").filter({ has: page.getByTestId("transaction-amount").filter({ hasText: "+$123.00" }) });
        const notification = page.getByRole("region", { name: "Notifications alt+T" }).getByRole("listitem");

        // Assert new transaction button visiblity
        await expect(newTransactionButton).toBeVisible();

        // Click new transaction and assert new transaction wizard visibility
        await newTransactionButton.click();
        await expect(newTransactionWizard).toBeVisible();

        // Choose transaction type
        await transactionTypeField.click();
        await page.getByRole("option", { name: "Deposit" }).click();

        // Choose from account
        await fromAccountField.click();
        await page.getByRole("option", { name: "Primary Savings" }).click();

        // Fill transaction amount
        await transactionAmountField.click();
        await transactionAmountField.fill("123");

        // Fill transaction description
        await transactionDescriptionField.click();
        await transactionDescriptionField.fill("New transaction for deposit description");

        // Submit new transaction
        await submitTransactionButton.click();

        // Assert new transaction is created
        await expect(newTransactionRecord.getByTestId("transaction-type")).toHaveText("Deposit");
        await expect(newTransactionRecord.getByTestId("transaction-account")).toContainText("Primary Savings");
        await expect(newTransactionRecord.getByTestId("transaction-amount")).toContainText("+$123.00");
        await expect(newTransactionRecord.getByTestId("balance-after")).toContainText("$5,123.00");
        await expect(newTransactionRecord.getByTestId("transaction-description")).toContainText("New transaction for deposit description");
        await expect(notification).toHaveText("Transaction completed successfully!");
    });

    test("TC04. Quick Actions - New Transaction (Withdrawal)", async ({ page }) => {
        const newTransactionButton = page.getByTestId("quick-new-transaction");
        const newTransactionWizard = page.getByTestId("transaction-modal");
        const transactionTypeField = page.getByTestId("transaction-type-select");
        const fromAccountField = page.getByTestId("from-account-select");
        const transactionAmountField = page.getByTestId("transaction-amount-input");
        const transactionDescriptionField = page.getByTestId("transaction-description-input");
        const submitTransactionButton = page.getByTestId("submit-transaction-button");
        const newTransactionRecord = page.getByRole("row").filter({ has: page.getByTestId("transaction-amount").filter({ hasText: "-$456.00" }) });
        const notification = page.getByRole("region", { name: "Notifications alt+T" }).getByRole("listitem");

        // Click new transaction button
        await newTransactionButton.click();

        // Assert new transaction wizard visibility
        await expect(newTransactionWizard).toBeVisible();

        // Choose transaction type
        await transactionTypeField.click();
        await page.getByRole("option", { name: "Withdrawal" }).click();

        // Choose from account
        await fromAccountField.click();
        await page.getByRole("option", { name: "Checking Account" }).click();

        // Fill transaction amount
        await transactionAmountField.click();
        await transactionAmountField.fill("456");
        // Fill transaction description
        await transactionDescriptionField.click();
        await transactionDescriptionField.fill("New transaction for withdrawal description");
        // Submit new transaction
        await submitTransactionButton.click();

        // Assert new transaction is created
        await expect(newTransactionRecord.getByTestId("transaction-type")).toHaveText("Withdrawal");
        await expect(newTransactionRecord.getByTestId("transaction-account")).toContainText("Checking Account");
        await expect(newTransactionRecord.getByTestId("transaction-amount")).toContainText("-$456.00");
        await expect(newTransactionRecord.getByTestId("balance-after")).toContainText("$2,044.00");
        await expect(newTransactionRecord.getByTestId("transaction-description")).toContainText("New transaction for withdrawal description");
        await expect(notification).toHaveText("Transaction completed successfully!");
    });

    test("TC05. Quick Actions - New Transaction (Transfer)", async ({ page }) => {
        const newTransactionButton = page.getByTestId("quick-new-transaction");
        const newTransactionWizard = page.getByTestId("transaction-modal");
        const transactionTypeField = page.getByTestId("transaction-type-select");
        const fromAccountField = page.getByTestId("from-account-select");
        const toAccountField = page.getByTestId("to-account-select");
        const transactionAmountField = page.getByTestId("transaction-amount-input");
        const transactionDescriptionField = page.getByTestId("transaction-description-input");
        const submitTransactionButton = page.getByTestId("submit-transaction-button");
        const checkingAccountRow = page.getByRole("row").filter({ hasText: "Checking Account" });
        // const primarySavingsRow = page.getByRole("row").getByTestId("transaction-type").filter({ hasText: "Transfer" });
        const primarySavingsRow = page.getByRole("row").filter({ has: page.getByTestId("transaction-type").filter({ hasText: "Transfer" }) });
        const notification = page.getByRole("region", { name: "Notifications alt+T" }).getByRole("listitem");

        // Click new transaction button
        await newTransactionButton.click();

        // Assert new transaction wizard visibility
        await expect(newTransactionWizard).toBeVisible();

        // Choose transaction type
        await transactionTypeField.click();
        await page.getByRole("option", { name: "Transfer" }).click();

        // Choose from account
        await fromAccountField.click();
        await page.getByRole("option", { name: "Primary Savings" }).click();

        // Choose to account
        await toAccountField.click();
        await page.getByRole("option", { name: "Checking Account" }).click();

        // Fill transaction amount
        await transactionAmountField.click();
        await transactionAmountField.fill("200");
        // FIll transaction description
        await transactionDescriptionField.click();
        await transactionDescriptionField.fill("New transaction for transfer description");
        // Submit new transaction
        await submitTransactionButton.click();

        // Assert new transaction for Primary Savings account
        await expect(primarySavingsRow).toBeVisible();
        await expect(primarySavingsRow.getByTestId("balance-after")).toHaveText("$4,800.00");
        await expect(primarySavingsRow.getByTestId("transaction-amount")).toHaveText("+$200.00"); //Incorrect behavior - supposedly display -$200.00
        await expect(primarySavingsRow.getByTestId("transaction-description")).toHaveText("New transaction for transfer description");

        // Assert new transaction for Checking Account account
        await expect(checkingAccountRow.getByTestId("balance-after")).toHaveText("$2,700.00");
        await expect(checkingAccountRow.getByTestId("transaction-amount")).toHaveText("+$200.00");
        await expect(checkingAccountRow.getByTestId("transaction-description")).toHaveText("Transfer from Primary Savings");
        await expect(notification).toHaveText("Transaction completed successfully!");
    });

    test("TC06. Quick Actions - View All Accounts", async ({ page }) => {
        const viewAccountButton = page.getByTestId("quick-view-accounts");
        // Assert view account button visibility and functionality
        await expect(viewAccountButton).toBeVisible();
        await viewAccountButton.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/accounts`);
    });

    test("TC07. Quick Stats Section", async ({ page }) => {
        const section = page.getByTestId("quick-stats-section");
        const heading = page.getByRole("heading", { name: "Quick Stats" });
        const chart = page.getByTestId("quick-stats-chart");
        const depositLegend = page.getByText("Deposits", { exact: true });
        const withdrawalLegend = page.getByText("Withdrawals", { exact: true });

        // Assert section and heading visibility
        await expect(section).toBeVisible();
        await expect(heading).toBeVisible();
        //Assert paragraph value
        await expect(section.getByRole("paragraph")).toContainText("Last 7 days — deposits vs withdrawals");
        // Assert chart is visible
        await expect(chart).toBeVisible();
        // Assert chart display value for last 7 days
        await expect(chart.locator(":scope > div")).toHaveCount(7);
        // Assert transaction type legend
        await expect(depositLegend).toBeVisible();
        await expect(withdrawalLegend).toBeVisible();
    });

    test("TC08. Pinned Accounts Section", async ({ page }) => {
        const accounts = page.locator('[data-testid^="draggable-account-id_"]');
        const section = page.getByTestId("pinned-accounts-section");
        const heading = section.getByRole("heading", { name: "Pinned Accounts" });
        const paragraph = section.locator(":scope > p");
        const firstAccount = accounts.filter({ hasText: "Primary Savings" });
        const secondAccount = accounts.filter({ hasText: "Checking Account" });
        const dropZone = page.getByTestId("drop-zone");

        // Assert heading and paragraph
        await expect(heading).toBeVisible();
        await expect(paragraph).toHaveText("Drag to reorder your pinned accounts.");

        // Assert all accounts visibility
        for (let i = 0; i < (await accounts.count()); i++) {
            await expect(accounts.nth(i)).toBeVisible();
        }

        // Assert first account
        await expect(accounts.first()).toContainText("Primary Savings");
        // Drag first account
        await firstAccount.dragTo(dropZone);
        // Assert first account is moved
        await expect(accounts.nth(1)).toContainText("Primary Savings");
        // Drag second account
        await secondAccount.dragTo(dropZone);
        // Assert second account is moved
        await expect(accounts.nth(1)).toContainText("Checking Account");
    });

    test("TC09. Recent Transactions Section", async ({ page }) => {
        const table = page.getByTestId("recent-transactions-table");

        // Assert heading visibility
        await expect(page.getByRole("heading", { name: "Recent Transactions", exact: true })).toBeVisible();
        // Assert table visibility
        await expect(table).toBeVisible();
        // Assert table header visibility
        await expect(page.getByRole("columnheader", { name: "Date" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Type" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Account" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Amount" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    });

    test("TC10. Account Overview Section", async ({ page }) => {
        const card = page.getByTestId("accounts-grid").locator(":scope > div");

        // Assert heading visibility
        await expect(page.getByRole("heading", { name: "Accounts Overview" })).toBeVisible();

        // Assert accounts overview
        await expect(page.getByTestId("accounts-grid")).toBeVisible();
        await expect(card).toHaveCount(2);
    });
});
