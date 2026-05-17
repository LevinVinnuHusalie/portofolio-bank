import { test, expect, Locator } from "@playwright/test";

test.beforeEach("Authenticate", async ({ page }) => {
    const usernameInput = page.getByTestId("username-input");
    const passwordInput = page.getByTestId("password-input");
    const loginButton = page.getByTestId("login-button");
    const newTransactionButton = page.getByTestId("quick-new-transaction");
    const transactionTypeField = page.getByTestId("transaction-type-select");
    const fromAccountField = page.getByTestId("from-account-select");
    const transactionAmountField = page.getByTestId("transaction-amount-input");
    const transactionDescriptionField = page.getByTestId("transaction-description-input");
    const submitTransactionButton = page.getByTestId("submit-transaction-button");
    const dateList = ["2026-01-15", "2026-02-05", "2026-02-12", "2026-03-03", "2026-03-24", "2026-04-02", "2026-04-05"];

    await page.goto(`${process.env.BASE_URL}`);
    //Input admin username
    await usernameInput.click();
    await usernameInput.fill(`${process.env.ADMIN_USERNAME}`);

    //Input admin password
    await passwordInput.click();
    await passwordInput.fill(`${process.env.ADMIN_PASSWORD}`);

    //Click login
    await loginButton.click();

    const addTransaction = async (amount: number) => {
        for (let index = 0; index < amount; index++) {
            await page.clock.setFixedTime(new Date(dateList[index]));

            await page.getByTestId("nav-dashboard").click();
            await newTransactionButton.click();
            await transactionTypeField.click();
            if (index % 2 === 0) {
                await page.getByRole("option", { name: "Deposit" }).click();
            } else await page.getByRole("option", { name: "Withdrawal" }).click();

            // Choose from account
            await fromAccountField.click();
            if (index % 2 === 0) {
                await page.getByRole("option", { name: "Checking Account" }).click();
            } else await page.getByRole("option", { name: "Primary Savings" }).click();

            // Fill transaction amount
            await transactionAmountField.click();
            await transactionAmountField.fill("10");

            // Fill transaction description
            await transactionDescriptionField.click();
            await transactionDescriptionField.fill(`New transaction for deposit ${index + 1} description`);

            // Submit new transaction
            await submitTransactionButton.click();

            await page.waitForTimeout(500);
        }
    };
    // Precondition: Create transactions with different dates
    await addTransaction(dateList.length);

    await page.getByTestId("nav-transactions").click();
});

test.describe("TransactionsPage Test Cases", () => {
    test("TC01. Validate TransactionPage skeleton", async ({ page }) => {
        // Assert filter section
        await expect(page.locator("#filters-section")).toBeVisible();
        // Assert transaction summary section
        await expect(page.getByTestId("transactions-summary-bar")).toBeVisible();
        await expect(page.locator("#summary-deposits")).toBeVisible();
        await expect(page.locator("#summary-deposits")).toContainText("Deposits: $1,040.00");
        await expect(page.locator("#summary-withdrawals")).toBeVisible();
        await expect(page.locator("#summary-withdrawals")).toContainText("Withdrawals: $30.00");
        await expect(page.locator("#summary-net")).toBeVisible();
        await expect(page.locator("#summary-net")).toContainText("Net: +$1,010.00");
        await expect(page.locator("#summary-count")).toBeVisible();
        await expect(page.locator("#summary-count")).toContainText("8 transactions");
        // Assert heading and table are visible
        await expect(page.getByRole("heading", { name: "Your Transactions" })).toBeVisible();
        await expect(page.locator("#transactions-table-wrapper")).toBeVisible();
    });

    test("TC02. Transactions filter", async ({ page }) => {
        const tableBody = page.getByTestId("transactions-tbody");

        // Assert filter for From date
        await page.getByTestId("date-from-input").click();
        await page.getByRole("button", { name: "Go to the Previous Month" }).click();
        await page.getByRole("button", { name: "Friday, March 20th, 2026" }).click();
        await page.getByTestId("apply-filters-button").click();
        await expect(tableBody.getByRole("row")).toHaveCount(3);

        // Assert filter for To date
        await page.getByTestId("date-to-input").click();
        await page.getByRole("button", { name: "Friday, April 3rd, 2026" }).first().click();
        await page.getByTestId("apply-filters-button").click();
        await expect(tableBody.getByRole("row")).toHaveCount(2);

        // Assert filter for transaction type
        await page.getByTestId("filter-transaction-type-select").click();
        await page.getByRole("option", { name: "Deposit" }).click();
        await page.getByTestId("apply-filters-button").click();
        await expect(tableBody.getByRole("row")).toHaveCount(1);

        // Assert filter for reset button
        await page.getByTestId("reset-filters-button").click();
        await expect(tableBody.getByRole("row")).toHaveCount(8);

        // Assert filter for account
        await page.getByTestId("filter-account-select").click();
        await page.getByRole("option", { name: "Primary Savings" }).click();
        await page.getByTestId("apply-filters-button").click();
        await expect(tableBody.getByRole("row")).toHaveCount(4);
    });

    test("TC03. Transactions Table Page", async ({ page }) => {
        const tableBody = page.getByTestId("transactions-tbody");

        // Assert table displays 8 transaction initially
        await expect(tableBody.getByRole("row")).toHaveCount(8);
        // Assert second page is not visible
        await expect(page.getByTestId("pagination-page-2")).not.toBeVisible();

        // Change rows per page value to 5
        await page.getByTestId("rows-per-page-select").click();
        await page.getByRole("option", { name: "5", exact: true }).click();
        // Assert table only displays 5 records
        await expect(tableBody.getByRole("row")).toHaveCount(5);

        // Assert second page is visible
        await expect(page.getByTestId("pagination-page-2")).toBeVisible();
        // Go to second page
        await page.getByTestId("pagination-page-2").click();
        // Assert the rest of transactions are displayed
        await expect(tableBody.getByRole("row")).toHaveCount(3);
    });
});
