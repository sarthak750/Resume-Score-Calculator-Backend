const resumeSection = require("../resumeParser/resumeSections");
const jobExperience = require("./jobExperience");
const resumeExperience = require("./resumeExperience");

const experienceScore = async (jobDescription, resumeSections) => {
  const JobExperience = await jobExperience(jobDescription);

  const ResumeExperience = await resumeExperience(resumeSections);

  if (ResumeExperience >= JobExperience) {
    return 1;
  } else {
    return 0;
  }
};

module.exports = experienceScore;
