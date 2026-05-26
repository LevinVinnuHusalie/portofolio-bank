/**
 * Application Constants Configuration
 */

export namespace AppConstants {
    /**
     * Base URL Configuration
     */
    export const BASE_URL = process.env.BASE_URL || "";

    /**
     * Full URLs
     */
    export namespace URLs {
        export const LOGIN_PAGE = BASE_URL;
        export const DASHBOARD_PAGE = `${BASE_URL}/dashboard`;
        export const ACCOUNTS_PAGE = `${BASE_URL}/accounts`;
        export const TRANSACTIONS_PAGE = `${BASE_URL}/transactions`;
    }
}
