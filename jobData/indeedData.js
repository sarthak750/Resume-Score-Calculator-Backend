const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(stealthPlugin());

const indeedData = async (url) => {
  try {
    console.log(1);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const jobData = {
      comapanyName: "",
      jobLocationContent: "",
      jobTitleContent: "",
      jobSalaryAndJobTypeContent: "",
      jobDescriptionContent: "",
    };
    let comapanyName = await page.evaluate(() => {
      const anchorElement = document.querySelector(".css-775knl");
      if (anchorElement) {
        // Extract text content, ignoring any SVG elements
        return anchorElement.childNodes[0].textContent;
      }
      return null;
    });
    const jobLocationContent = await page.$eval(
      ".css-1ikmi61",
      (div) => div.innerHTML
    );
    const jobTitleContent = await page.$eval(
      ".jobsearch-JobInfoHeader-title",
      (div) => div.innerHTML
    );
    const jobSalaryAndJobTypeContent = await page.$eval(
      "#salaryInfoAndJobType",
      (div) => div.innerHTML
    );
    const jobDescriptionContent = await page.$eval(
      "#jobDescriptionText",
      (div) => div.innerHTML
    );

    await browser.close();

    if (comapanyName) {
      comapanyName = comapanyName.replace(/[^a-zA-Z0-9\s]/g, "");
      jobData.comapanyName = comapanyName;
    }
    if (jobLocationContent) {
      jobData.jobLocationContent = jobLocationContent;
    }
    if (jobTitleContent) {
      jobData.jobTitleContent = jobTitleContent;
    }
    if (jobSalaryAndJobTypeContent) {
      jobData.jobSalaryAndJobTypeContent = jobSalaryAndJobTypeContent;
    }
    if (jobDescriptionContent) {
      jobData.jobDescriptionContent = jobDescriptionContent;
    }

    return jobData;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = indeedData;
