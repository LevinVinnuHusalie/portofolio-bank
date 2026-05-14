import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}`);

    const heading = page.getByRole("heading", { name: "Welcome to SecureBank" });
    expect(heading).toHaveText("Welcome to SecureBank");
});

test("TC01. Successful login with admin credentials until logout", async ({ page }) => {
    const usernameInput = page.getByTestId("username-input");
    const passwordInput = page.getByTestId("password-input");
    const loginButton = page.getByTestId("login-button");

    await usernameInput.click();
    await usernameInput.fill(`${process.env.ADMIN_USERNAME}`);

    await passwordInput.click();
    await passwordInput.fill(`${process.env.ADMIN_PASSWORD}`);

    await loginButton.click();

    expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);

    const userInfo = page.getByTestId("user-info");
    await expect(userInfo).toContainText("admin");

    page.once("dialog", (dialog) => {
        dialog.accept();
        expect(dialog.message()).toEqual("Are you sure you want to logout?");
        expect(dialog.type()).toEqual("confirm");
    });

    const logoutButton = page.getByTestId("logout-button");
    await logoutButton.click();

    expect(page).toHaveURL(`${process.env.BASE_URL}`);
});

test("TC02. Failed login with invalid credentials with password toogle", async ({ page }) => {
    const usernameInput = page.getByTestId("username-input");
    const passwordInput = page.getByTestId("password-input");
    const loginButton = page.getByTestId("login-button");

    await usernameInput.click();
    await usernameInput.fill("invalid");
    await expect(usernameInput).toHaveValue("invalid");

    await passwordInput.click();
    await passwordInput.fill("invalid");

    const toogle = page.getByTestId("toggle-password-btn");
    await toogle.click();
    await expect(passwordInput).toHaveValue("invalid");

    await loginButton.click();
    await expect(page.getByTestId("login-alert")).toContainText("⚠️ Invalid username or password. Please try again.");

    expect(page).toHaveURL(`${process.env.BASE_URL}`);
});

test("TC03. Login with viewer user with remember me checkbox", async ({ page }) => {
    const usernameInput = page.getByTestId("username-input");
    const passwordInput = page.getByTestId("password-input");
    const loginButton = page.getByTestId("login-button");

    await usernameInput.click();
    await usernameInput.fill(`${process.env.VIEWER_USERNAME}`);

    await passwordInput.click();
    await passwordInput.fill(`${process.env.VIEWER_PASSWORD}`);

    await page.getByTestId("remember-checkbox").click();

    await loginButton.click();

    expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);

    await expect(page.locator("#username-display")).toContainText("viewer");
    await expect(page.getByTestId("viewer-badge")).toBeVisible();
    await expect(page.getByTestId("viewer-badge")).toContainText("Read-only");

    page.once("dialog", (dialog) => {
        dialog.accept();
        expect(dialog.message()).toEqual("Are you sure you want to logout?");
        expect(dialog.type()).toEqual("confirm");
    });

    const logoutButton = page.getByTestId("logout-button");
    await logoutButton.click();

    await expect(usernameInput).toHaveValue(`${process.env.VIEWER_USERNAME}`);
    await expect(passwordInput).toBeEmpty();
});
