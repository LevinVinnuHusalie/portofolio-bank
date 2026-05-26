import { expect, Locator, Page } from "@playwright/test";
import { UIMessages, AppConstants } from "../config";

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
    readonly alertMessage = UIMessages.Login.ERROR_MESSAGE;
    readonly headingText = UIMessages.Login.PAGE_HEADING;
    readonly mainPageUrl = AppConstants.URLs.DASHBOARD_PAGE;

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
            expect(dialog.message()).toEqual(UIMessages.Login.LOGOUT_CONFIRMATION_MESSAGE);
            expect(dialog.type()).toEqual(UIMessages.Login.LOGOUT_CONFIRMATION_TYPE);
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
        await expect(this.page).toHaveURL(AppConstants.URLs.LOGIN_PAGE);
        this.assertText(this.heading, this.headingText);
    }

    async assertAdminLoginSuccess() {
        await expect(this.page).toHaveURL(this.mainPageUrl);
        await this.assertText(this.userInfo, UIMessages.Login.USER_ROLE_ADMIN);
    }

    async assertViewerLoginSuccess() {
        await expect(this.page).toHaveURL(this.mainPageUrl);
        await this.assertText(this.userInfo, UIMessages.Login.USER_ROLE_VIEWER);
        await expect(this.viewerBadge).toBeVisible();
        await expect(this.viewerBadge).toContainText(UIMessages.Login.VIEWER_BADGE_TEXT);
    }
}
