import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

const adminUsername = `${process.env.ADMIN_USERNAME}`;
const adminPassword = `${process.env.ADMIN_PASSWORD}`;

setup("Authentication", async ({ page }) => {
    const usernameInput = page.getByTestId("username-input");
    const passwordInput = page.getByTestId("password-input");
    const loginButton = page.getByTestId("login-button");

    await page.goto(`${process.env.BASE_URL}`);
    //Input admin username
    await usernameInput.click();
    await usernameInput.fill(adminUsername);

    //Input admin password
    await passwordInput.click();
    await passwordInput.fill(adminPassword);

    //Click login
    await loginButton.click();

    await expect(page).toHaveURL(`${process.env.BASE_URL}/dashboard`);
    await expect(page.getByTestId("nav-dashboard")).toBeVisible();

    await page.context().storageState({ path: authFile });

    const sessionStorage = await page.evaluate(() => {
        const json: Record<string, string> = {};

        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i)!;

            json[key] = window.sessionStorage.getItem(key)!;
        }

        return json;
    });

    fs.writeFileSync("playwright/.auth/session.json", JSON.stringify(sessionStorage, null, 2));
});
