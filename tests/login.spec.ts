import { test } from "../src/fixtures/BankFixture";
import { CredentialsManager } from "../src/config";

test.describe("LoginPage Test Cases", () => {
    test("TC01. Successful login with admin credentials until logout", async ({ loginPage }) => {
        // Login with admin user
        await loginPage.fillLoginFields(CredentialsManager.ADMIN.username, CredentialsManager.ADMIN.password);
        await loginPage.assertLoginFields(CredentialsManager.ADMIN.username, CredentialsManager.ADMIN.password);
        await loginPage.login();

        // Assert page redirected to MainPage = Login success
        await loginPage.assertAdminLoginSuccess();

        // Logi=out
        await loginPage.logout();

        // Assert page redirected to LoginPage again = Logout success
        await loginPage.assertInLoginPage();
    });

    test("TC02. Failed login with invalid credentials with password toogle", async ({ loginPage }) => {
        // Login with invalid user
        await loginPage.fillLoginFields(CredentialsManager.INVALID.username, CredentialsManager.INVALID.password);

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

    test("TC03. Login with viewer user with remember me checkbox", async ({ loginPage }) => {
        // Login with viewer user
        await loginPage.fillLoginFields(CredentialsManager.VIEWER.username, CredentialsManager.VIEWER.password);
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
        await loginPage.assertLoginFields(CredentialsManager.VIEWER.username, "");
    });
});
