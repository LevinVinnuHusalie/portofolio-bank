/**
 * UI Messages and Assertions Configuration
 * Centralized storage for all user-facing messages and expected assertion values
 * This ensures consistency across all test files
 */

export namespace UIMessages {
    /**
     * Login Page Messages
     */
    export namespace Login {
        export const PAGE_HEADING = "Welcome to SecureBank";
        export const ERROR_MESSAGE = "⚠️ Invalid username or password. Please try again.";
        export const LOGOUT_CONFIRMATION_MESSAGE = "Are you sure you want to logout?";
        export const LOGOUT_CONFIRMATION_TYPE = "confirm";
        export const VIEWER_BADGE_TEXT = "Read-only";
        export const USER_ROLE_ADMIN = "admin";
        export const USER_ROLE_VIEWER = "viewer";
    }

    /**
     * Navigation and Heading Messages
     */
    export namespace Headings {
        export const QUICK_ACTIONS = "Quick Actions";
        export const QUICK_STATS = "Quick Stats";
        export const PINNED_ACCOUNTS = "Pinned Accounts";
        export const RECENT_TRANSACTIONS = "Recent Transactions";
        export const ACCOUNTS_OVERVIEW = "Accounts Overview";
        export const YOUR_BANK_ACCOUNTS = "Your Bank Accounts";
        export const YOUR_TRANSACTIONS = "Your Transactions";
    }

    /**
     * Account Wizard Messages
     */
    export namespace AccountWizard {
        export const ADD_ACCOUNT_TITLE = "Add New Account";
        export const ADD_ACCOUNT_DESCRIPTION = "Fill in the details to create a new account.";
    }

    /**
     * Dashboard Card Titles
     */
    export namespace Cards {
        export const TOTAL_BALANCE = "Total Balance";
        export const ACTIVE_ACCOUNTS = "Active Accounts";
        export const TOTAL_TRANSACTIONS = "Total Transactions";
    }

    /**
     * Section Descriptions
     */
    export namespace Descriptions {
        export const PINNED_ACCOUNTS_DESC = "Drag to reorder your pinned accounts.";
        export const QUICK_STATS_DESC = "Last 7 days — deposits vs withdrawals";
    }

    /**
     * Status Messages
     */
    export namespace Status {
        export const ACTIVE = "Active";
        export const TRANSACTION_SUCCESS = "Transaction completed successfully!";
    }
}
