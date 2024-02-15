const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(stealthPlugin());

const linkedinData = async (url) => {
  try {
    console.log(1);
    const jobData = {
      comapanyName: "",
      jobTitleContent: "",
      jobLocationContent: "",
      jobPostedTimeContent: "",
      jobAdditionalData: "",
      jobDescriptionContent: "",
    };

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    let comapanyName = await page.evaluate(() => {
      const anchorElement = document.querySelector(".topcard__org-name-link");
      if (anchorElement) {
        // Extract text content, ignoring any SVG elements
        return anchorElement.childNodes[0].textContent;
      }
      return null;
    });

    // const comapanyName = await page.evaluate(() => {
    //   const linkElement = document.querySelector(".topcard__org-name-link");
    //   if (linkElement) {
    //     return linkElement.textContent;
    //   } else {
    //     return null;
    //   }
    // });

    let jobTitleContent = await page
      .$eval(
        ".top-card-layout__title.topcard__title",
        (h1Element) => h1Element.innerText
      )
      .catch((err) => console.log(err));

    let jobLocationContent = await page.evaluate(() => {
      const firstSpanElement = document.querySelector(
        ".topcard__flavor.topcard__flavor--bullet"
      );
      if (firstSpanElement) {
        return firstSpanElement.textContent.trim();
      } else {
        return null;
      }
    });

    let jobPostedTimeContent = await page.evaluate(() => {
      const firstSpanElement = document.querySelector(
        ".posted-time-ago__text.topcard__flavor--metadata"
      );
      if (firstSpanElement) {
        return firstSpanElement.textContent.trim();
      } else {
        return null;
      }
    });

    // let jobAdditionalData = await page.$eval(
    //   ".description__job-criteria-list",
    //   (div) => div.innerHTML
    // );

    let jobAdditionalData = await page.evaluate(() => {
      const ulElement = document.querySelector(
        ".description__job-criteria-list"
      );
      const result = [];

      if (ulElement) {
        const liElements = ulElement.querySelectorAll("li");

        liElements.forEach((li) => {
          const h3Element = li.querySelector("h3");
          const spanElement = li.querySelector("span");

          if (h3Element && spanElement) {
            const h3Text = h3Element.textContent.trim();
            const spanText = spanElement.textContent.trim();

            result.push({ h3Text, spanText });
          }
        });
      }

      return result;
    });

    let jobDescriptionContent = await page.$eval(
      ".show-more-less-html__markup.relative.overflow-hidden",
      (div) => div.innerHTML
    );

    await browser.close();

    if (comapanyName) {
      comapanyName = comapanyName.replace(/\n/g, "");
      jobData.comapanyName = comapanyName;
    }

    if (jobTitleContent) {
      jobData.jobTitleContent = jobTitleContent;
    }
    if (jobLocationContent) {
      jobData.jobLocationContent = jobLocationContent;
    }
    if (jobPostedTimeContent) {
      jobData.jobPostedTimeContent = jobPostedTimeContent;
    }
    if (jobAdditionalData) {
      jobData.jobAdditionalData = jobAdditionalData;
    }
    if (jobDescriptionContent) {
      jobData.jobDescriptionContent = jobDescriptionContent;
    }

    return jobData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = linkedinData;
