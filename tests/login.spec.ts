import { test, expect, Locator } from "@playwright/test";

let heading: Locator, usernameInput: Locator, passwordInput: Locator, loginButton: Locator, userInfo: Locator, logoutButton: Locator, toggle: Locator, rememberCheckBox: Locator;

test.beforeEach("Initial Step", async ({ page }) => {
    usernameInput = page.getByTestId("username-input");
    passwordInput = page.getByTestId("password-input");
    loginButton = page.getByTestId("login-button");
    userInfo = page.getByTestId("user-info");
    logoutButton = page.getByTestId("logout-button");
    heading = page.getByRole("heading", { name: "Welcome to SecureBank" });
    toggle = page.getByTestId("toggle-password-btn");
    rememberCheckBox = page.getByTestId("remember-checkbox");

    await page.goto(`${process.env.BASE_URL}`);
    expect(heading).toHaveText("Welcome to SecureBank");
});

test.describe("LoginPage Test Cases", () => {
    test("TC01. Successful login with admin credentials until logout", async ({ page }) => {
        //Input admin username
        await usernameInput.click();
        await usernameInput.fill(`${process.env.ADMIN_USERNAME}`);

        //Input admin password
        await passwordInput.click();
        await passwordInput.fill(`${process.env.ADMIN_PASSWORD}`);

        //Click login
        await loginButton.click();

        // Assert page redirected to MainPage = Login success
        await expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);
        //Assert user login with admin user
        await expect(userInfo).toContainText("admin");

        //Intercept alert
        page.once("dialog", (dialog) => {
            dialog.accept();
            expect(dialog.message()).toEqual("Are you sure you want to logout?");
            expect(dialog.type()).toEqual("confirm");
        });

        // Click logout
        await logoutButton.click();

        // Assert page redirected to LoginPage again = Logout success
        expect(page).toHaveURL(`${process.env.BASE_URL}`);
        expect(heading).toHaveText("Welcome to SecureBank");
    });

    test("TC02. Failed login with invalid credentials with password toogle", async ({ page }) => {
        // Input invalid username
        await usernameInput.click();
        await usernameInput.fill("invalid");

        // Input invalid password
        await passwordInput.click();
        await passwordInput.fill("invalid");

        // Click password toogle to show passowrd
        await toggle.click();
        // Assert value on username and password field
        await expect(usernameInput).toHaveValue("invalid");
        await expect(passwordInput).toHaveValue("invalid");

        //Click login
        await loginButton.click();
        //Assert error message
        await expect(page.getByTestId("login-alert")).toContainText("⚠️ Invalid username or password. Please try again.");

        //Assert page is not redirected and still in LoginPage = Login failed
        expect(page).toHaveURL(`${process.env.BASE_URL}`);
    });

    test("TC03. Login with viewer user with remember me checkbox", async ({ page }) => {
        //Input viewer username
        await usernameInput.click();
        await usernameInput.fill(`${process.env.VIEWER_USERNAME}`);

        //Input viewer passwrod
        await passwordInput.click();
        await passwordInput.fill(`${process.env.VIEWER_PASSWORD}`);

        //Checkec remember me checkbox
        await page.getByTestId("remember-checkbox").click();

        //Click login
        await loginButton.click();

        //Assert page is redirected to MainPage = Login success
        expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);

        //Assert user login with viewer user
        await expect(page.locator("#username-display")).toContainText("viewer");
        await expect(page.getByTestId("viewer-badge")).toBeVisible();
        await expect(page.getByTestId("viewer-badge")).toContainText("Read-only");

        //Intercept alert
        page.once("dialog", (dialog) => {
            dialog.accept();
            expect(dialog.message()).toEqual("Are you sure you want to logout?");
            expect(dialog.type()).toEqual("confirm");
        });

        // Click logout
        await logoutButton.click();

        // Assert username is filled after checked rememberme checkbox
        await expect(usernameInput).toHaveValue(`${process.env.VIEWER_USERNAME}`);
        // Assert password is empty
        await expect(passwordInput).toBeEmpty();
    });
});
