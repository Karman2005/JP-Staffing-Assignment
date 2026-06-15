async function searchJobs(page, keyword) {

    console.log("Searching LinkedIn Jobs for:", keyword);

    // ✅ Proper LinkedIn Jobs search (last 24 hours filter included)
    const searchUrl = 
        `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&f_TPR=r86400`;

    await page.goto(searchUrl, {
        waitUntil: "domcontentloaded"
    });

    console.log("Jobs page loaded");

    // Wait for job cards to load properly
    await page.waitForTimeout(8000);

    // Optional debug (VERY useful)
    const jobCards = await page.locator("div.job-search-card");
    console.log("Job cards detected:", await jobCards.count());
}

module.exports = searchJobs;