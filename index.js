const loginLinkedIn = require("./linkedin");
const sendEmail = require("./sendMail");
const recruiters = require("./data/recruiters.json");

(async () => {

    const { page } = await loginLinkedIn();

    const keyword = "Java Developer Contract";

    console.log("Searching jobs...");

    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&f_TPR=r86400`;

    await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60000
    });

    console.log("Jobs page loaded");

    // 🔥 Let LinkedIn render + trigger lazy loading
    await page.waitForTimeout(5000);
    await page.mouse.wheel(0, 2500);
    await page.waitForTimeout(5000);

    console.log("Scraping job cards...");

    // 🔥 SAFE MULTI-SELECTOR STRATEGY
    let jobs = page.locator("div.job-search-card");
    let count = await jobs.count();

    if (count === 0) {
        jobs = page.locator("div.base-card");
        count = await jobs.count();
    }

    if (count === 0) {
        jobs = page.locator("li.scaffold-layout__list-item");
        count = await jobs.count();
    }

    console.log("Jobs found:", count);

    if (count === 0) {
        console.log("❌ No jobs detected. LinkedIn layout/session issue.");
        await page.close();
        return;
    }

    const sentEmails = new Set();

    for (let i = 0; i < Math.min(count, 10); i++) {

        try {
            const text = await jobs.nth(i).innerText();
            const lowerText = text.toLowerCase();

            console.log("\n----- JOB PREVIEW -----");
            console.log(text.slice(0, 200));

            // 🔥 FILTER CONDITION
            if (
    
                lowerText.includes("developer") ||
    
                lowerText.includes("software") ||
    
                lowerText.includes("frontend")
           ) {

                console.log("MATCH FOUND");

                const recruiter = recruiters[0]; // demo-safe mapping

                if (!sentEmails.has(recruiter.email)) {

                    sentEmails.add(recruiter.email);

                    console.log("Sending email to:", recruiter.email);

                    await sendEmail({
                        email: recruiter.email,
                        jobTitle: recruiter.jobTitle
                    });

                    console.log("EMAIL SENT");
                }
            }

        } catch (err) {
            console.log("Skipping job card...");
        }
    }

    console.log("\nAutomation completed.");

    await page.waitForTimeout(3000);
    await page.close();

})();