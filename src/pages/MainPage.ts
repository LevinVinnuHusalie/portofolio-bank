import { expect, Locator, Page } from "@playwright/test";

export class MainPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly dashboardNavbar: Locator;
    readonly transactionsNavbar: Locator;
    readonly accountsNavbar: Locator;
    readonly totalBalanceCard: Locator;
    readonly accountsCountCard: Locator;
    readonly transactionsCountCard: Locator;
    readonly addAccountButton: Locator;
    readonly accountNameField: Locator;
    readonly accountTypeField: Locator;
    readonly balanceField: Locator;
    readonly saveAccountButton: Locator;
    readonly wizardTitle: Locator;
    readonly wizardDescription: Locator;
    readonly newTransactionButton: Locator;
    readonly newTransactionWizard: Locator;
    readonly transactionTypeField: Locator;
    readonly fromAccountField: Locator;
    readonly transactionAmountField: Locator;
    readonly transactionDescriptionField: Locator;
    readonly submitTransactionButton: Locator;
    readonly newTransactionRecord: Locator;
    readonly notification: Locator;
    readonly toAccountField: Locator;
    readonly viewAccountButton: Locator;
    readonly quickStatsSection: Locator;
    readonly quickStatsHeading: Locator;
    readonly chart: Locator;
    readonly dragableAccounts: Locator;
    readonly dropZone: Locator;
    readonly table: Locator;

    constructor(page: Page) {
        this.page = page;
        //Login
        this.usernameInput = page.getByTestId("username-input");
        this.passwordInput = page.getByTestId("password-input");
        this.loginButton = page.getByTestId("login-button");
        // Navbar
        this.dashboardNavbar = page.getByTestId("nav-dashboard");
        this.accountsNavbar = page.getByTestId("nav-accounts");
        this.transactionsNavbar = page.getByTestId("nav-transactions");
        // Summary section
        this.totalBalanceCard = page.getByTestId("total-balance-card");
        this.accountsCountCard = page.getByTestId("accounts-count-card");
        this.transactionsCountCard = page.getByTestId("transactions-count-card");
        // New Account section
        this.addAccountButton = page.getByTestId("quick-add-account");
        this.wizardTitle = page.getByTestId("modal-title");
        this.wizardDescription = page.locator("#modal-description");
        this.accountNameField = page.getByTestId("account-name-input");
        this.accountTypeField = page.getByTestId("account-type-select");
        this.balanceField = page.getByTestId("initial-balance-input");
        this.saveAccountButton = page.getByTestId("save-account-button");
        // New Transaction section
        this.newTransactionButton = page.getByTestId("quick-new-transaction");
        this.newTransactionWizard = page.getByTestId("transaction-modal");
        this.transactionTypeField = page.getByTestId("transaction-type-select");
        this.fromAccountField = page.getByTestId("from-account-select");
        this.toAccountField = page.getByTestId("to-account-select");
        this.transactionAmountField = page.getByTestId("transaction-amount-input");
        this.transactionDescriptionField = page.getByTestId("transaction-description-input");
        this.submitTransactionButton = page.getByTestId("submit-transaction-button");
        this.newTransactionRecord = page.getByRole("row").filter({ has: page.getByTestId("transaction-amount").filter({ hasText: "+$123.00" }) });
        this.notification = page.getByRole("region", { name: "Notifications alt+T" }).getByRole("listitem");
        // View accounts
        this.viewAccountButton = page.getByTestId("quick-view-accounts");
        // Quick Stats section
        this.quickStatsSection = page.getByTestId("quick-stats-section");
        this.quickStatsHeading = page.getByRole("heading", { name: "Quick Stats" });
        this.chart = page.getByTestId("quick-stats-chart");
        // Pinned Accounts section
        this.dragableAccounts = page.locator('[data-testid^="draggable-account-id_"]');
        this.dropZone = page.getByTestId("drop-zone");
        // Recent Transaction section
        this.table = page.getByTestId("recent-transactions-table");
    }

    heading(heading: string): Locator {
        return this.page.getByRole("heading", { name: heading, exact: true });
    }

    accountRowFromAccountName(accountName: string): Locator {
        return this.page
            .getByTestId("accounts-tbody")
            .getByRole("row")
            .filter({ has: this.page.getByTestId("account-name").filter({ hasText: accountName }) });
    }

    transactionRowFromDescription(desc: string): Locator {
        return this.page
            .getByTestId("transactions-tbody")
            .getByRole("row")
            .filter({ has: this.page.getByTestId("transaction-description").filter({ hasText: desc }) });
    }

    section(section: string): Locator {
        return this.page.getByTestId(section);
    }

    async createNewAccount(accountName: string, accountType: string, balance: string) {
        await this.accountNameField.click();
        await this.accountNameField.fill(accountName);

        // Choose account type
        await this.accountTypeField.click();
        await this.page.getByRole("option", { name: accountType }).click();
        await expect(this.accountTypeField).toHaveText(accountType);

        // Fill account initial balance
        await this.balanceField.click();
        await this.balanceField.fill(balance);

        // Save account
        await this.saveAccountButton.click();
    }

    async createNewTransaction(transactionType: string, fromAccount: string, toAccount: string, amount: string, description: string) {
        await this.transactionTypeField.click();
        await this.page.getByRole("option", { name: transactionType }).click();

        // Choose from account
        await this.fromAccountField.click();
        await this.page.getByRole("option", { name: fromAccount }).click();

        if (transactionType == "Transfer") {
            await this.toAccountField.click();
            await this.page.getByRole("option", { name: toAccount }).click();
        }

        // Fill transaction amount
        await this.transactionAmountField.click();
        await this.transactionAmountField.fill(amount);

        // Fill transaction description
        await this.transactionDescriptionField.click();
        await this.transactionDescriptionField.fill(description);

        // Submit new transaction
        await this.submitTransactionButton.click();
    }

    async assertAllDragableAccounts() {
        const accounts = await this.dragableAccounts.all();
        for (const account of accounts) {
            await expect(account).toBeVisible();
        }
    }

    async assertWizard(wizard: Locator, title: string, desc: string) {
        await expect(wizard).toBeVisible();
        await expect(this.wizardTitle).toContainText(title);
        await expect(this.wizardDescription).toContainText(desc);
    }

    async assertTableHeader(table: Locator, headerList: string[]) {
        // const headers = await table.getByRole("columnheader").all();
        for (const header of headerList) {
            await expect(table.getByRole("columnheader", { name: header })).toBeVisible();
        }
    }

    async assertNewAccount(locator: Locator, accountName: string, accountType: string, balance: string) {
        await expect(locator).toBeVisible();
        await expect(locator.getByTestId("account-name")).toContainText(accountName);
        await expect(locator.getByTestId("account-type")).toContainText(accountType);
        await expect(locator.getByTestId("account-balance")).toContainText(balance);
        await expect(locator.getByTestId("account-status")).toContainText("Active");
    }

    async assertNewTransaction(locator: Locator, transactionType: string, fromAccount: string, amount: string, balanceAfter: string, description: string) {
        await expect(locator).toBeVisible();
        await expect(locator.getByTestId("transaction-type")).toContainText(transactionType);
        await expect(locator.getByTestId("transaction-account")).toContainText(fromAccount);
        await expect(locator.getByTestId("transaction-amount")).toContainText(amount);
        await expect(locator.getByTestId("balance-after")).toContainText(balanceAfter);
        await expect(locator.getByTestId("transaction-description")).toContainText(description);
        await expect(this.notification).toContainText("Transaction completed successfully!");
    }
}
