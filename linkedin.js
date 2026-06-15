const { chromium } = require("playwright");
require("dotenv").config();

async function loginLinkedIn() {

    const browser = await chromium.launch({
        headless: false,
        slowMo: 50
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Opening LinkedIn login page...");

    await page.goto("https://www.linkedin.com/login", {
        waitUntil: "domcontentloaded"
    });

    // Fill credentials
    await page.fill("#username", process.env.LINKEDIN_EMAIL);
    await page.fill("#password", process.env.LINKEDIN_PASSWORD);

    await page.click("button[type='submit']");

    console.log("Login submitted... waiting for redirect");

    // ✅ REAL SUCCESS CHECK (IMPORTANT)
    try {
        await page.waitForURL("**/feed/**", { timeout: 60000 });
        console.log("Login successful → Feed loaded");
    } catch (err) {
        console.log("❌ Login failed or verification required");
        console.log("Current URL:", page.url());

        await page.screenshot({ path: "login-error.png", fullPage: true });

        throw new Error("LinkedIn login not successful");
    }

    // Save session (for reuse later)
    await context.storageState({ path: "linkedin-state.json" });

    return { browser, context, page };
}

module.exports = loginLinkedIn;