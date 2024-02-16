const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(stealthPlugin());

const indeedData = async (url) => {
  try {
    const browser = await puppeteer.launch({ timeout: 60000 });
    const page = await browser.newPage();
    await page.goto(url);

    const jobData = {
      companyNameIndeed: "Not Provided",
      jobLocationIndeed: "Not Provided",
      jobTitleIndeed: "Not Provided",
      jobSalaryAndJobTypeIndeed: "Not Provided",
      jobDescriptionIndeed: "Not Provided",
    };

    jobData.companyNameIndeed = await page.evaluate(() => {
      const anchorElement = document.querySelector(".css-775knl");
      if (anchorElement) {
        const companyName = anchorElement.childNodes[0].textContent;
        return companyName.replace(/[^a-zA-Z0-9\s]/g, "");
      }
      return null;
    });

    jobData.jobLocationIndeed = await page.evaluate(() => {
      const div = document.querySelector(".css-1ikmi61");
      if (div) {
        return div.textContent;
      }
      return "Not Provided";
    });

    jobData.jobTitleIndeed = await page.evaluate(() => {
      const div = document.querySelector(".jobsearch-JobInfoHeader-title");
      if (div) {
        return div.textContent;
      }
      return "Not Provided";
    });

    jobData.jobSalaryAndJobTypeIndeed = await page.evaluate(() => {
      const div = document.querySelector("#salaryInfoAndJobType");
      if (div) {
        return div.innerHTML;
      }
      return "Not Provided";
    });

    jobData.jobDescriptionIndeed = await page.evaluate(() => {
      const div = document.querySelector("#jobDescriptionText");
      if (div) {
        return div.innerHTML;
      }
      return "Not Provided";
    });

    await browser.close();

    // if (comapanyNameIndeed) {
    //   comapanyName = comapanyName.replace(/[^a-zA-Z0-9\s]/g, "");
    //   jobData.comapanyName = comapanyName;
    // }
    // if (jobLocationContent) {
    //   jobData.jobLocationContent = jobLocationContent;
    // }
    // if (jobTitleContent) {
    //   jobData.jobTitleContent = jobTitleContent;
    // }
    // if (jobSalaryAndJobTypeContent) {
    //   jobData.jobSalaryAndJobTypeContent = jobSalaryAndJobTypeContent;
    // }
    // if (jobDescriptionContent) {
    //   jobData.jobDescriptionContent = jobDescriptionContent;
    // }

    return jobData;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = indeedData;
