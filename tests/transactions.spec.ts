import { test, expect } from "../src/fixtures/BankFixture";
import { TestData, UIMessages } from "../src/config";

test.beforeEach("Prepare Data", async ({ transactionsPage }) => {
    await transactionsPage.prepareData(TestData.Transactions.TRANSACTION_DATES);
});

test.describe("TransactionsPage Test Cases", () => {
    test("TC01. Validate TransactionPage skeleton", async ({ page, transactionsPage }) => {
        // Assert filter section
        await expect(page.locator("#filters-section")).toBeVisible();
        // Assert transaction summary section
        await expect(page.getByTestId("transactions-summary-bar")).toBeVisible();
        await transactionsPage.assertSummary(transactionsPage.summaryDeposit, TestData.Transactions.SUMMARY.deposits);
        await transactionsPage.assertSummary(transactionsPage.summaryWithdrawals, TestData.Transactions.SUMMARY.withdrawals);
        await transactionsPage.assertSummary(transactionsPage.summaryNet, TestData.Transactions.SUMMARY.net);
        await transactionsPage.assertSummary(transactionsPage.summaryCount, TestData.Transactions.SUMMARY.count);
        // Assert heading and table are visible
        await expect(page.getByRole("heading", { name: UIMessages.Headings.YOUR_TRANSACTIONS })).toBeVisible();
        await expect(page.locator("#transactions-table-wrapper")).toBeVisible();
    });

    test("TC02. Transactions filter", async ({ page, transactionsPage }) => {
        // Assert filter for From date
        await transactionsPage.filterTransactions(transactionsPage.dateFromFilter, TestData.Transactions.FILTER_DATES.fromDate, 3);

        // Assert filter for To date
        await transactionsPage.filterTransactions(transactionsPage.dateToFilter, TestData.Transactions.FILTER_DATES.toDate, 2);

        // Assert filter for transaction type
        await transactionsPage.filterTransactions(transactionsPage.transTypeFilter, TestData.Transactions.TRANSACTION_TYPE_DEPOSIT, 1);

        // Assert filter for reset button
        await page.getByTestId("reset-filters-button").click();
        await expect(transactionsPage.tableBody.getByRole("row")).toHaveCount(8);

        // Assert filter for account
        await transactionsPage.filterTransactions(transactionsPage.accountFilter, TestData.DEFAULT_ACCOUNT_2, 4);
    });

    test("TC03. Transactions Table Paging", async ({ page, transactionsPage }) => {
        const nextPage = page.getByTestId("pagination-page-2");

        // Assert table displays 8 transaction initially
        await transactionsPage.countAccountRow(8);
        // Assert second page is not visible
        await expect(nextPage).not.toBeVisible();

        // Change rows per page value to 5
        await page.getByTestId("rows-per-page-select").click();
        await page.getByRole("option", { name: "5", exact: true }).click();
        // Assert table only displays 5 records
        await transactionsPage.countAccountRow(5);

        // Assert second page is visible
        await expect(nextPage).toBeVisible();
        // Go to second page
        await nextPage.click();
        // Assert the rest of transactions are displayed
        await transactionsPage.countAccountRow(3);
    });
});
