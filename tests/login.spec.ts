import { test } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";

const adminUsername = `${process.env.ADMIN_USERNAME}`;
const adminPassword = `${process.env.ADMIN_PASSWORD}`;
const viewerUsername = `${process.env.VIEWER_USERNAME}`;
const viewerPassword = `${process.env.VIEWER_PASSWORD}`;

test.beforeEach("Initial Step", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToUrl(`${process.env.BASE_URL}`);
    await loginPage.assertInLoginPage();
});

test.describe("LoginPage Test Cases", () => {
    test("TC01. Successful login with admin credentials until logout", async ({ page }) => {
        const loginPage = new LoginPage(page);
        // Login with admin user
        await loginPage.fillLoginFields(adminUsername, adminPassword);
        await loginPage.assertLoginFields(adminUsername, adminPassword);
        await loginPage.login();

        // Assert page redirected to MainPage = Login success
        await loginPage.assertAdminLoginSuccess();

        // Logi=out
        await loginPage.logout();

        // Assert page redirected to LoginPage again = Logout success
        await loginPage.assertInLoginPage();
    });

    test("TC02. Failed login with invalid credentials with password toogle", async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Login with invalid user
        await loginPage.fillLoginFields("invalidUsername", "invalidPassword");

        // Click password toogle to show password
        await loginPage.click(loginPage.toggle); //will add visual assert in future
        // Assert value on username and password field
        await loginPage.assertLoginFields("invalidUsername", "invalidPassword");

        //Click login
        await loginPage.login();
        //Assert error message
        await loginPage.assertText(loginPage.loginAlert, loginPage.alertMessage);

        //Assert page is not redirected and still in LoginPage = Login failed
        await loginPage.assertInLoginPage();
    });

    test("TC03. Login with viewer user with remember me checkbox", async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Login with viewer user
        await loginPage.fillLoginFields(viewerUsername, viewerPassword);
        //Check remember me checkbox
        await loginPage.click(loginPage.rememberCheckBox);

        //Click login
        await loginPage.login();

        //Assert page is redirected to MainPage = Login success with viewer user
        await loginPage.assertViewerLoginSuccess();

        // Click logout
        await loginPage.logout();

        // Assert username is filled after checked rememberme checkbox
        await loginPage.assertInLoginPage();
        await loginPage.assertLoginFields(viewerUsername, "");
    });
});
