/**
 * Test Data Configuration
 * Centralized storage for all test data organized by domain
 * Follows DRY principle and maintains single source of truth
 */

export namespace TestData {
    export const DEFAULT_ACCOUNT_1 = "Checking Account";
    export const DEFAULT_ACCOUNT_2 = "Primary Savings";
    /**
     * Default Application Accounts
     * These are pre-existing accounts in the test environment
     */
    export namespace Accounts {
        export const ACCOUNT_TYPE_CHECKING = "Checking";
        export const ACCOUNT_TYPE_SAVINGS = "Savings";
        export const ACCOUNT_TYPE_CREDIT_CARD = "Credit Card";

        /**
         * Test Account Data for Create Operations
         */
        export const NEW_ACCOUNT = {
            name: "Testing Account",
            type: ACCOUNT_TYPE_CREDIT_CARD,
            balance: "2000",
            expectedBalance: "$2,000.00",
            displayType: "Credit",
        };

        export const UPDATED_ACCOUNT_1 = {
            name: "Checking Account Updated",
            type: ACCOUNT_TYPE_CREDIT_CARD,
            balance: "3000",
            expectedBalance: "$3,000.00",
            displayType: "Credit",
            status: "Active",
        };

        export const UPDATED_ACCOUNT_2 = {
            name: "Primary Savings Updated",
            type: ACCOUNT_TYPE_CHECKING,
            balance: "1000",
            expectedBalance: "$1,000.00",
            displayType: "Checking",
            status: "Inactive",
        };

        /**
         * Table Headers for Accounts Page
         */
        export const TABLE_HEADERS = ["Account Number", "Name", "Type", "Balance", "Status", "Actions"];

        /**
         * Sort Options
         */
        export const SORT_OPTIONS = {
            BY_DATE_CREATED: "Date Created",
            BY_ACCOUNT_NAME: "Account Name",
            BY_BALANCE: "Balance",
        };
    }

    /**
     * Transactions Test Data
     */
    export namespace Transactions {
        export const TRANSACTION_TYPE_DEPOSIT = "Deposit";
        export const TRANSACTION_TYPE_WITHDRAWAL = "Withdrawal";
        export const TRANSACTION_TYPE_TRANSFER = "Transfer";

        /**
         * Date list for transaction preparation
         * Format: YYYY-MM-DD
         */
        export const TRANSACTION_DATES = ["2026-01-15", "2026-02-05", "2026-02-12", "2026-03-03", "2026-03-24", "2026-04-02", "2026-04-05"];

        /**
         * Test Transaction Data for New Transactions
         */
        export const NEW_DEPOSIT = {
            type: TRANSACTION_TYPE_DEPOSIT,
            fromAccount: DEFAULT_ACCOUNT_2,
            toAccount: "",
            amount: "123",
            displayAmount: "+$123.00",
            description: "New Transaction for Deposit Transaction",
            expectedBalance: "$5,123.00",
        };

        export const NEW_WITHDRAWAL = {
            type: TRANSACTION_TYPE_WITHDRAWAL,
            fromAccount: DEFAULT_ACCOUNT_1,
            toAccount: "",
            amount: "456",
            displayAmount: "-$456.00",
            description: "New Transaction for Withdrawal Transaction",
            expectedBalance: "$2,044.00",
        };

        export const NEW_TRANSFER = {
            type: TRANSACTION_TYPE_TRANSFER,
            fromAccount: DEFAULT_ACCOUNT_2,
            toAccount: DEFAULT_ACCOUNT_1,
            amount: "200",
            displayAmount: "+$200.00",
            description: "New Transaction for Transfer Transaction",
            expectedBalance: "$4,800.00",
        };

        export const TRANSFER_DEPOSIT = {
            type: TRANSACTION_TYPE_DEPOSIT,
            fromAccount: DEFAULT_ACCOUNT_1,
            toAccount: "",
            amount: "200",
            displayAmount: "+$200.00",
            description: "Transfer from Primary Savings",
            expectedBalance: "$2,700.00",
        };

        /**
         * Transaction Summary Data
         */
        export const SUMMARY = {
            deposits: "Deposits: $1,040.00",
            withdrawals: "Withdrawals: $30.00",
            net: "Net: +$1,010.00",
            count: "8 transactions",
        };

        /**
         * Filter Date Ranges
         */
        export const FILTER_DATES = {
            fromDate: "Wednesday, April 1st, 2026",
            toDate: "Monday, April 6th, 2026",
        };

        /**
         * Table Headers for Transactions Page
         */
        export const TABLE_HEADERS = ["Date", "Type", "Account", "Amount", "Status"];
    }
}
