import { Locator, Page, expect } from "@playwright/test";

export class TransactionsPage {
    readonly summaryDeposit: Locator;
    readonly summaryWithdrawals: Locator;
    readonly summaryNet: Locator;
    readonly summaryCount: Locator;
    readonly tableBody: Locator;
    readonly dateFromFilter: Locator;
    readonly dateToFilter: Locator;
    readonly transTypeFilter: Locator;
    readonly accountFilter: Locator;

    constructor(readonly page: Page) {
        this.summaryDeposit = page.locator("#summary-deposits");
        this.summaryWithdrawals = page.locator("#summary-withdrawals");
        this.summaryNet = page.locator("#summary-net");
        this.summaryCount = page.locator("#summary-count");
        this.tableBody = page.getByTestId("transactions-tbody");
        this.dateFromFilter = page.getByTestId("date-from-input");
        this.dateToFilter = page.getByTestId("date-to-input");
        this.transTypeFilter = page.getByTestId("filter-transaction-type-select");
        this.accountFilter = page.getByTestId("filter-account-select");
    }

    async prepareData(dateList: string[]) {
        const newTransactionButton = this.page.getByTestId("quick-new-transaction");
        const transactionTypeField = this.page.getByTestId("transaction-type-select");
        const fromAccountField = this.page.getByTestId("from-account-select");
        const transactionAmountField = this.page.getByTestId("transaction-amount-input");
        const transactionDescriptionField = this.page.getByTestId("transaction-description-input");
        const submitTransactionButton = this.page.getByTestId("submit-transaction-button");
        for (let index = 0; index < dateList.length; index++) {
            await this.page.clock.setFixedTime(new Date(dateList[index]));

            await this.page.getByTestId("nav-dashboard").click();
            await newTransactionButton.click();
            await transactionTypeField.click();
            if (index % 2 === 0) {
                await this.page.getByRole("option", { name: "Deposit" }).click();
            } else await this.page.getByRole("option", { name: "Withdrawal" }).click();

            // Choose from account
            await fromAccountField.click();
            if (index % 2 === 0) {
                await this.page.getByRole("option", { name: "Checking Account" }).click();
            } else await this.page.getByRole("option", { name: "Primary Savings" }).click();

            // Fill transaction amount
            await transactionAmountField.click();
            await transactionAmountField.fill("10");

            // Fill transaction description
            await transactionDescriptionField.click();
            await transactionDescriptionField.fill(`New transaction for deposit ${index + 1} description`);

            // Submit new transaction
            await submitTransactionButton.click();

            await this.page.waitForTimeout(500);
        }
    }

    async countAccountRow(amount: number) {
        await expect(this.tableBody.getByRole("row")).toHaveCount(amount);
    }

    async assertSummary(locator: Locator, text: string) {
        await expect(locator).toBeVisible();
        await expect(locator).toContainText(text);
    }

    async filterTransactions(locator: Locator, value: string, expected: number) {
        await locator.click();
        // await page.getByRole("button", { name: "Go to the Previous Month" }).click();
        await this.page
            .getByRole("button", { name: value })
            .or(this.page.getByRole("option", { name: value }))
            .first()
            .click();
        await this.page.getByTestId("apply-filters-button").click();
        await this.countAccountRow(expected);
    }
}
