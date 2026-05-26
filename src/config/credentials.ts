/**
 * User Credentials Configuration
 * Centralized management of test user credentials
 * All secrets are loaded from environment variables for security
 */

export interface UserCredentials {
    username: string;
    password: string;
}

export class CredentialsManager {
    /**
     * Admin user credentials
     */
    static readonly ADMIN: UserCredentials = {
        username: process.env.ADMIN_USERNAME || "",
        password: process.env.ADMIN_PASSWORD || "",
    };

    /**
     * Viewer user credentials (read-only role)
     */
    static readonly VIEWER: UserCredentials = {
        username: process.env.VIEWER_USERNAME || "",
        password: process.env.VIEWER_PASSWORD || "",
    };

    /**
     * Invalid credentials for negative test cases
     */
    static readonly INVALID = {
        username: "invalidUsername",
        password: "invalidPassword",
    };
}
