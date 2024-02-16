const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(stealthPlugin());
require("dotenv").config();

const linkedinData = async (url) => {
  try {
    const jobData = {
      jobTitleLinkedIn: "Not Provided",
      jobDescriptionLinkedIn: "Not Provided",
      jobSkillsLinkedIn: "Not Provided",
      companyNameLinkedIn: "Not Provided",
    };

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setCookie({
      name: "JSESSIONID",
      value: process.env.JSESSIONID,
      domain: ".linkedin.com",
    });

    await page.setCookie({
      name: "li_at",
      value: process.env.li_at,
      domain: ".linkedin.com",
    });

    await page.goto(url);

    try {
      await page.waitForSelector(
        ".job-details-jobs-unified-top-card__job-title"
      );
      jobData.jobTitleLinkedIn = await page.evaluate(() => {
        const div = document.querySelector(
          ".job-details-jobs-unified-top-card__job-title"
        );
        if (div) {
          return div.innerText;
        }
        return "Not Provided";
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        ".job-details-jobs-unified-top-card__primary-description-without-tagline"
      );
      jobData.companyNameLinkedIn = await page.evaluate(() => {
        const div = document.querySelector(
          ".job-details-jobs-unified-top-card__primary-description-without-tagline"
        );
        if (div) {
          return div.innerText;
        }
        return "Not Provided";
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        ".app-aware-link.job-details-how-you-match__skills-item-subtitle"
      );
      jobData.jobSkillsLinkedIn = await page.evaluate(() => {
        const div = document.querySelector(
          ".app-aware-link.job-details-how-you-match__skills-item-subtitle"
        );
        if (div) {
          return div.innerText;
        }
        return "Not Provided";
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector("#job-details", { visible: true });
      jobData.jobDescriptionLinkedIn = await page.evaluate(() => {
        const div = document.querySelector("#job-details");
        if (div) {
          return div.innerHTML;
        }
        return "Not Provided";
      });
    } catch (error) {
      console.log(error);
    }

    await browser.close();

    return jobData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = linkedinData;
