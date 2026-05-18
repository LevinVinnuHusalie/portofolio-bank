import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly userInfo: Locator;
    readonly logoutButton: Locator;
    readonly toggle: Locator;
    readonly rememberCheckBox: Locator;
    readonly loginAlert: Locator;
    readonly viewerBadge: Locator;
    readonly alertMessage = "⚠️ Invalid username or password. Please try again.";
    readonly headingText = "Welcome to SecureBank";
    readonly mainPageUrl = `${process.env.BASE_URL}/dashboard`;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId("username-input");
        this.passwordInput = page.getByTestId("password-input");
        this.loginButton = page.getByTestId("login-button");
        this.userInfo = page.getByTestId("user-info");
        this.logoutButton = page.getByTestId("logout-button");
        this.heading = page.getByRole("heading", { name: this.headingText });
        this.toggle = page.getByTestId("toggle-password-btn");
        this.rememberCheckBox = page.getByTestId("remember-checkbox");
        this.loginAlert = page.getByTestId("login-alert");
        this.viewerBadge = page.getByTestId("viewer-badge");
    }

    async goToUrl(url: string) {
        await this.page.goto(url);
    }

    async fillLoginFields(username: string, passowrd: string) {
        await this.usernameInput.click();
        await this.usernameInput.fill(username);
        await this.passwordInput.click();
        await this.passwordInput.fill(passowrd);
    }

    async login() {
        await this.loginButton.click();
    }

    async assertLoginFields(username: string, passowrd: string) {
        await expect(this.usernameInput).toHaveValue(username);
        await expect(this.passwordInput).toHaveValue(passowrd);
    }

    async logout() {
        this.page.once("dialog", (dialog) => {
            dialog.accept();
            expect(dialog.message()).toEqual("Are you sure you want to logout?");
            expect(dialog.type()).toEqual("confirm");
        });

        await this.logoutButton.click();
    }

    async assertText(locator: Locator, expected: string) {
        await expect(locator).toContainText(expected);
    }

    async click(locator: Locator) {
        await locator.click();
    }

    async assertInLoginPage() {
        await expect(this.page).toHaveURL(`${process.env.BASE_URL}`);
        this.assertText(this.heading, this.headingText);
    }

    async assertAdminLoginSuccess() {
        await expect(this.page).toHaveURL(this.mainPageUrl);
        await this.assertText(this.userInfo, "admin");
    }

    async assertViewerLoginSuccess() {
        await expect(this.page).toHaveURL(this.mainPageUrl);
        await this.assertText(this.userInfo, "viewer");
        await expect(this.viewerBadge).toBeVisible();
        await expect(this.viewerBadge).toContainText("Read-only");
    }
}
