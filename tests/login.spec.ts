import { test, expect } from "@playwright/test";

test("Login Page", async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}`);

    const heading = page.getByRole("heading", { name: "Welcome to SecureBank" });
    expect(heading).toHaveText("Welcome to SecureBank");
});
