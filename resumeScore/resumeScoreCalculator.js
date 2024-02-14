const { JSDOM } = require("jsdom");
const documentScore = require("./documentScore");
const skillsScore = require("./skillsScore");
const educationScore = require("./educationScore");
const experienceScore = require("./experienceScore");

const resumeScoreCalculator = async (resumeSections, jobData) => {
  function extractTextFromHTML(htmlContent) {
    const dom = new JSDOM(htmlContent);
    const plainText = dom.window.document.body.textContent || "";
    const cleanText = plainText.replace(/\n\s*\n/g, "\n");
    return cleanText.trim();
  }
  console.log(jobData);
  const jobDescription = extractTextFromHTML(jobData.jobDescriptionContent);
  const DocumentScore = await documentScore(jobDescription, resumeSections);
  const SkillsScore = await skillsScore(jobDescription, resumeSections);
  const EducationScore = await educationScore(jobDescription, resumeSections);
  const ExperienceScore = await experienceScore(jobDescription, resumeSections);

  if (SkillsScore == 0) {
    return {
      overallScore: 0,
      documentScore: 0,
      skillsScore: 0,
      educationScore: 0,
      experienceScore: 0,
    };
  }

  let score = (DocumentScore + SkillsScore + ExperienceScore) / 3;
  score = Math.ceil(score * 10) / 10;
  console.log(score);
  return {
    overallScore: score,
    documentScore: DocumentScore,
    skillsScore: SkillsScore,
    educationScore: EducationScore,
    experienceScore: ExperienceScore,
  };
};

module.exports = resumeScoreCalculator;
