import { test, expect } from "../src/fixtures/BankFixture";
import { TestData, UIMessages, AppConstants } from "../src/config";

test.describe("MainPage Test Cases", () => {
    test("TC01. Checking Navbar and Summary Section", async ({ page, mainPage }) => {
        // Assert navbar links are visible
        await expect(mainPage.dashboardNavbar).toBeVisible();
        await expect(mainPage.accountsNavbar).toBeVisible();
        await expect(mainPage.transactionsNavbar).toBeVisible();

        // Assert navbar is working correctly
        await mainPage.accountsNavbar.click();
        await expect(page).toHaveURL(AppConstants.URLs.ACCOUNTS_PAGE);
        await mainPage.transactionsNavbar.click();
        await expect(page).toHaveURL(AppConstants.URLs.TRANSACTIONS_PAGE);
        await mainPage.dashboardNavbar.click();
        await expect(page).toHaveURL(AppConstants.URLs.DASHBOARD_PAGE);

        // Assert summary section
        await expect(page.locator("#summary-section")).toBeVisible();

        // Assert all cards in summary section
        await expect(mainPage.totalBalanceCard).toBeVisible();
        await expect(mainPage.accountsCountCard).toBeVisible();
        await expect(mainPage.transactionsCountCard).toBeVisible();

        // Assert cards title
        await expect(mainPage.totalBalanceCard).toContainText(UIMessages.Cards.TOTAL_BALANCE);
        await expect(mainPage.accountsCountCard).toContainText(UIMessages.Cards.ACTIVE_ACCOUNTS);
        await expect(mainPage.transactionsCountCard).toContainText(UIMessages.Cards.TOTAL_TRANSACTIONS);
    });

    test("TC02. Quick Actions - Add Account", async ({ page, mainPage }) => {
        // Assert Quick Actions heading
        await expect(mainPage.heading(UIMessages.Headings.QUICK_ACTIONS)).toBeVisible();
        // Assert add account button visibility
        await expect(mainPage.addAccountButton).toBeVisible();

        // Click add button
        await mainPage.addAccountButton.click();
        // Assert create account wizard visibility, title, and description
        await mainPage.assertWizard(page.getByTestId("account-modal"), UIMessages.AccountWizard.ADD_ACCOUNT_TITLE, UIMessages.AccountWizard.ADD_ACCOUNT_DESCRIPTION);

        await mainPage.createNewAccount(TestData.Accounts.NEW_ACCOUNT.name, TestData.Accounts.NEW_ACCOUNT.type, TestData.Accounts.NEW_ACCOUNT.balance);

        // Assert new account is created
        await mainPage.assertNewAccount(mainPage.accountRowFromAccountName(TestData.Accounts.NEW_ACCOUNT.name), TestData.Accounts.NEW_ACCOUNT.name, TestData.Accounts.NEW_ACCOUNT.displayType, TestData.Accounts.NEW_ACCOUNT.expectedBalance);
    });

    test("TC03. Quick Actions - New Transaction (deposit)", async ({ mainPage }) => {
        // Assert new transaction button visibility
        await expect(mainPage.newTransactionButton).toBeVisible();

        // Click new transaction and assert new transaction wizard visibility
        await mainPage.newTransactionButton.click();
        await expect(mainPage.newTransactionWizard).toBeVisible();

        await mainPage.createNewTransaction(
            TestData.Transactions.NEW_DEPOSIT.type,
            TestData.Transactions.NEW_DEPOSIT.fromAccount,
            TestData.Transactions.NEW_DEPOSIT.toAccount,
            TestData.Transactions.NEW_DEPOSIT.amount,
            TestData.Transactions.NEW_DEPOSIT.description,
        );

        // Assert new transaction is created
        await mainPage.assertNewTransaction(
            mainPage.transactionRowFromDescription(TestData.Transactions.NEW_DEPOSIT.description),
            TestData.Transactions.NEW_DEPOSIT.type,
            TestData.Transactions.NEW_DEPOSIT.fromAccount,
            TestData.Transactions.NEW_DEPOSIT.displayAmount,
            TestData.Transactions.NEW_DEPOSIT.expectedBalance,
            TestData.Transactions.NEW_DEPOSIT.description,
        );
    });

    test("TC04. Quick Actions - New Transaction (Withdrawal)", async ({ mainPage }) => {
        // Click new transaction button
        await mainPage.newTransactionButton.click();

        // Assert new transaction wizard visibility
        await expect(mainPage.newTransactionWizard).toBeVisible();

        await mainPage.createNewTransaction(
            TestData.Transactions.NEW_WITHDRAWAL.type,
            TestData.Transactions.NEW_WITHDRAWAL.fromAccount,
            TestData.Transactions.NEW_WITHDRAWAL.toAccount,
            TestData.Transactions.NEW_WITHDRAWAL.amount,
            TestData.Transactions.NEW_WITHDRAWAL.description,
        );

        // Assert new transaction is created
        await mainPage.assertNewTransaction(
            mainPage.transactionRowFromDescription(TestData.Transactions.NEW_WITHDRAWAL.description),
            TestData.Transactions.NEW_WITHDRAWAL.type,
            TestData.Transactions.NEW_WITHDRAWAL.fromAccount,
            TestData.Transactions.NEW_WITHDRAWAL.displayAmount,
            TestData.Transactions.NEW_WITHDRAWAL.expectedBalance,
            TestData.Transactions.NEW_WITHDRAWAL.description,
        );
    });

    test("TC05. Quick Actions - New Transaction (Transfer)", async ({ mainPage }) => {
        // Click new transaction button
        await mainPage.newTransactionButton.click();

        // Assert new transaction wizard visibility
        await expect(mainPage.newTransactionWizard).toBeVisible();

        await mainPage.createNewTransaction(
            TestData.Transactions.NEW_TRANSFER.type,
            TestData.Transactions.NEW_TRANSFER.fromAccount,
            TestData.Transactions.NEW_TRANSFER.toAccount,
            TestData.Transactions.NEW_TRANSFER.amount,
            TestData.Transactions.NEW_TRANSFER.description,
        );

        // Assert new transactions are created
        await mainPage.assertNewTransaction(
            mainPage.transactionRowFromDescription(TestData.Transactions.NEW_TRANSFER.description),
            TestData.Transactions.NEW_TRANSFER.type,
            TestData.Transactions.NEW_TRANSFER.fromAccount,
            TestData.Transactions.NEW_TRANSFER.displayAmount,
            TestData.Transactions.NEW_TRANSFER.expectedBalance,
            TestData.Transactions.NEW_TRANSFER.description,
        ); //Incorrect behavior for transaction-amount - - supposedly display -$200.00

        await mainPage.assertNewTransaction(
            mainPage.transactionRowFromDescription(TestData.Transactions.TRANSFER_DEPOSIT.description),
            TestData.Transactions.TRANSFER_DEPOSIT.type,
            TestData.Transactions.TRANSFER_DEPOSIT.fromAccount,
            TestData.Transactions.TRANSFER_DEPOSIT.displayAmount,
            TestData.Transactions.TRANSFER_DEPOSIT.expectedBalance,
            TestData.Transactions.TRANSFER_DEPOSIT.description,
        );
    });

    test("TC06. Quick Actions - View All Accounts", async ({ page, mainPage }) => {
        // Assert view account button visibility and functionality
        await expect(mainPage.viewAccountButton).toBeVisible();
        await mainPage.viewAccountButton.click();
        await expect(page).toHaveURL(AppConstants.URLs.ACCOUNTS_PAGE);
    });

    test("TC07. Quick Stats Section", async ({ page, mainPage }) => {
        // Assert section and heading visibility
        await expect(mainPage.section("quick-stats-section")).toBeVisible();
        await expect(mainPage.heading(UIMessages.Headings.QUICK_STATS)).toBeVisible();
        //Assert paragraph value
        await expect(mainPage.section("quick-stats-section").getByRole("paragraph")).toContainText(UIMessages.Descriptions.QUICK_STATS_DESC);
        // Assert chart is visible
        await expect(mainPage.chart).toBeVisible();
        // Assert chart display value for last 7 days
        await expect(mainPage.chart.locator(":scope > div")).toHaveCount(7);
        // Assert transaction type legend
        await expect(page.getByText(`${TestData.Transactions.TRANSACTION_TYPE_DEPOSIT}s`, { exact: true })).toBeVisible();
        await expect(page.getByText(`${TestData.Transactions.TRANSACTION_TYPE_WITHDRAWAL}s`, { exact: true })).toBeVisible();
    });

    test("TC08. Pinned Accounts Section", async ({ mainPage }) => {
        // Assert heading and paragraph
        await expect(mainPage.heading(UIMessages.Headings.PINNED_ACCOUNTS)).toBeVisible();
        await expect(mainPage.section("pinned-accounts-section").locator(":scope > p")).toHaveText(UIMessages.Descriptions.PINNED_ACCOUNTS_DESC);

        await mainPage.assertAllDragableAccounts();

        // Assert first account
        await expect(mainPage.dragableAccounts.first()).toContainText(TestData.DEFAULT_ACCOUNT_2);
        // Drag first account
        await mainPage.dragableAccounts.filter({ hasText: TestData.DEFAULT_ACCOUNT_2 }).dragTo(mainPage.dropZone);
        // Assert first account is moved
        await expect(mainPage.dragableAccounts.nth(1)).toContainText(TestData.DEFAULT_ACCOUNT_2);
        // Drag second account
        await mainPage.dragableAccounts.filter({ hasText: TestData.DEFAULT_ACCOUNT_1 }).dragTo(mainPage.dropZone);
        // Assert second account is moved
        await expect(mainPage.dragableAccounts.nth(1)).toContainText(TestData.DEFAULT_ACCOUNT_1);
    });

    test("TC09. Recent Transactions Section", async ({ mainPage }) => {
        // Assert heading visibility
        await expect(mainPage.heading(UIMessages.Headings.RECENT_TRANSACTIONS)).toBeVisible();
        // Assert table visibility
        await expect(mainPage.table).toBeVisible();
        // Assert table header visibility
        await mainPage.assertTableHeader(mainPage.table, TestData.Transactions.TABLE_HEADERS);
    });

    test("TC10. Account Overview Section", async ({ page, mainPage }) => {
        const cards = page.getByTestId("accounts-grid").locator(":scope > div");

        // Assert heading visibility
        await expect(mainPage.heading(UIMessages.Headings.ACCOUNTS_OVERVIEW)).toBeVisible();

        // Assert accounts overview
        await expect(page.getByTestId("accounts-grid")).toBeVisible();
        await expect(cards).toHaveCount(2);
    });
});
