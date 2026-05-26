import { test, expect } from "../src/fixtures/BankFixture";

test.describe("MainPage Test Cases", () => {
    test("TC01. Checking Navbar and Summary Section", async ({ page, mainPage }) => {
        // Assert navbar links are visible
        await expect(mainPage.dashboardNavbar).toBeVisible();
        await expect(mainPage.accountsNavbar).toBeVisible();
        await expect(mainPage.transactionsNavbar).toBeVisible();

        // Assert navbar is working correctly
        await mainPage.accountsNavbar.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/accounts`);
        await mainPage.transactionsNavbar.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/transactions`);
        await mainPage.dashboardNavbar.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);

        // Assert summary section
        await expect(page.locator("#summary-section")).toBeVisible();

        // Assert all cards in summary section
        await expect(mainPage.totalBalanceCard).toBeVisible();
        await expect(mainPage.accountsCountCard).toBeVisible();
        await expect(mainPage.transactionsCountCard).toBeVisible();

        // Assert cards title
        await expect(mainPage.totalBalanceCard).toContainText("Total Balance");
        await expect(mainPage.accountsCountCard).toContainText("Active Accounts");
        await expect(mainPage.transactionsCountCard).toContainText("Total Transactions");
    });

    test("TC02. Quick Actions - Add Account", async ({ page, mainPage }) => {
        // Assert Quick Actions heading
        await expect(mainPage.heading("Quick Actions")).toBeVisible();
        // Assert add account button visibility
        await expect(mainPage.addAccountButton).toBeVisible();

        // Click add button
        await mainPage.addAccountButton.click();
        // Assert create account wizard visibility, title, and description
        await mainPage.assertWizard(page.getByTestId("account-modal"), "Add New Account", "Fill in the details to create a new account.");

        await mainPage.createNewAccount("Testing Account", "Credit Card", "2000");

        // Assert new account is created
        await mainPage.assertNewAccount(mainPage.accountRowFromAccountName("Testing Account"), "Testing Account", "Credit", "$2,000.00");
    });

    test("TC03. Quick Actions - New Transaction (deposit)", async ({ mainPage }) => {
        // Assert new transaction button visibility
        await expect(mainPage.newTransactionButton).toBeVisible();

        // Click new transaction and assert new transaction wizard visibility
        await mainPage.newTransactionButton.click();
        await expect(mainPage.newTransactionWizard).toBeVisible();

        await mainPage.createNewTransaction("Deposit", "Primary Savings", "", "123", "New Transaction for Deposit Transaction");

        // Assert new transaction is created
        await mainPage.assertNewTransaction(mainPage.transactionRowFromDescription("New Transaction for Deposit Transaction"), "Deposit", "Primary Savings", "+$123.00", "$5,123.00", "New Transaction for Deposit Transaction");
    });

    test("TC04. Quick Actions - New Transaction (Withdrawal)", async ({ mainPage }) => {
        // Click new transaction button
        await mainPage.newTransactionButton.click();

        // Assert new transaction wizard visibility
        await expect(mainPage.newTransactionWizard).toBeVisible();

        await mainPage.createNewTransaction("Withdrawal", "Checking Account", "", "456", "New Transaction for Withdrawal Transaction");

        // Assert new transaction is created
        await mainPage.assertNewTransaction(mainPage.transactionRowFromDescription("New Transaction for Withdrawal Transaction"), "Withdrawal", "Checking Account", "-$456.00", "$2,044.00", "New Transaction for Withdrawal Transaction");
    });

    test("TC05. Quick Actions - New Transaction (Transfer)", async ({ mainPage }) => {
        // Click new transaction button
        await mainPage.newTransactionButton.click();

        // Assert new transaction wizard visibility
        await expect(mainPage.newTransactionWizard).toBeVisible();

        await mainPage.createNewTransaction("Transfer", "Primary Savings", "Checking Account", "200", "New Transaction for Transfer Transaction");

        // Assert new transactions are created
        await mainPage.assertNewTransaction(mainPage.transactionRowFromDescription("New Transaction for Transfer Transaction"), "Transfer", "Primary Savings", "+$200.00", "$4,800.00", "New Transaction for Transfer Transaction"); //Incorrect behavior for transaction-amount - - supposedly display -$200.00

        await mainPage.assertNewTransaction(mainPage.transactionRowFromDescription("Transfer from Primary Savings"), "Deposit", "Checking Account", "+$200.00", "$2,700.00", "Transfer from Primary Savings");
    });

    test("TC06. Quick Actions - View All Accounts", async ({ page, mainPage }) => {
        // Assert view account button visibility and functionality
        await expect(mainPage.viewAccountButton).toBeVisible();
        await mainPage.viewAccountButton.click();
        await expect(page).toHaveURL(`${process.env.BASE_URL}/accounts`);
    });

    test("TC07. Quick Stats Section", async ({ page, mainPage }) => {
        // Assert section and heading visibility
        await expect(mainPage.section("quick-stats-section")).toBeVisible();
        await expect(mainPage.heading("Quick Stats")).toBeVisible();
        //Assert paragraph value
        await expect(mainPage.section("quick-stats-section").getByRole("paragraph")).toContainText("Last 7 days — deposits vs withdrawals");
        // Assert chart is visible
        await expect(mainPage.chart).toBeVisible();
        // Assert chart display value for last 7 days
        await expect(mainPage.chart.locator(":scope > div")).toHaveCount(7);
        // Assert transaction type legend
        await expect(page.getByText("Deposits", { exact: true })).toBeVisible();
        await expect(page.getByText("Withdrawals", { exact: true })).toBeVisible();
    });

    test("TC08. Pinned Accounts Section", async ({ mainPage }) => {
        // Assert heading and paragraph
        await expect(mainPage.heading("Pinned Accounts")).toBeVisible();
        await expect(mainPage.section("pinned-accounts-section").locator(":scope > p")).toHaveText("Drag to reorder your pinned accounts.");

        await mainPage.assertAllDragableAccounts();

        // Assert first account
        await expect(mainPage.dragableAccounts.first()).toContainText("Primary Savings");
        // Drag first account
        await mainPage.dragableAccounts.filter({ hasText: "Primary Savings" }).dragTo(mainPage.dropZone);
        // Assert first account is moved
        await expect(mainPage.dragableAccounts.nth(1)).toContainText("Primary Savings");
        // Drag second account
        await mainPage.dragableAccounts.filter({ hasText: "Checking Account" }).dragTo(mainPage.dropZone);
        // Assert second account is moved
        await expect(mainPage.dragableAccounts.nth(1)).toContainText("Checking Account");
    });

    test("TC09. Recent Transactions Section", async ({ mainPage }) => {
        const headerList = ["Date", "Type", "Account", "Amount", "Status"];

        // Assert heading visibility
        await expect(mainPage.heading("Recent Transactions")).toBeVisible();
        // Assert table visibility
        await expect(mainPage.table).toBeVisible();
        // Assert table header visibility
        await mainPage.assertTableHeader(mainPage.table, headerList);
    });

    test("TC10. Account Overview Section", async ({ page, mainPage }) => {
        const cards = page.getByTestId("accounts-grid").locator(":scope > div");

        // Assert heading visibility
        await expect(mainPage.heading("Accounts Overview")).toBeVisible();

        // Assert accounts overview
        await expect(page.getByTestId("accounts-grid")).toBeVisible();
        await expect(cards).toHaveCount(2);
    });
});
