import { test, expect} from "../src/fixtures/BankFixture";

test.describe("TransactionsPage Test Cases", () => {
    test("TC01. Validate TransactionPage skeleton", async ({ page, transactionsPage }) => {
        // Assert filter section
        await expect(page.locator("#filters-section")).toBeVisible();
        // Assert transaction summary section
        await expect(page.getByTestId("transactions-summary-bar")).toBeVisible();
        await transactionsPage.assertSummary(transactionsPage.summaryDeposit, "Deposits: $1,040.00");
        await transactionsPage.assertSummary(transactionsPage.summaryWithdrawals, "Withdrawals: $30.00");
        await transactionsPage.assertSummary(transactionsPage.summaryNet, "Net: +$1,010.00");
        await transactionsPage.assertSummary(transactionsPage.summaryCount, "8 transactions");
        // Assert heading and table are visible
        await expect(page.getByRole("heading", { name: "Your Transactions" })).toBeVisible();
        await expect(page.locator("#transactions-table-wrapper")).toBeVisible();
    });

    test("TC02. Transactions filter", async ({ page, transactionsPage }) => {
        // Assert filter for From date
        await transactionsPage.filterTransactions(transactionsPage.dateFromFilter, "Wednesday, April 1st, 2026", 3);

        // Assert filter for To date
        await transactionsPage.filterTransactions(transactionsPage.dateToFilter, "Monday, April 6th, 2026", 2);

        // Assert filter for transaction type
        await transactionsPage.filterTransactions(transactionsPage.transTypeFilter, "Deposit", 1);

        // Assert filter for reset button
        await page.getByTestId("reset-filters-button").click();
        await expect(transactionsPage.tableBody.getByRole("row")).toHaveCount(8);

        // Assert filter for account
        await transactionsPage.filterTransactions(transactionsPage.accountFilter, "Primary Savings", 4);
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
