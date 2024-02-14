const jobExperience = async (jobDescription) => {
  function findJobExperience(jobText) {
    const aliases = {
      Fresher: ["Fresher", "Freshers", "Entry Level", "Beginner", "Trainee"],
      Intermediate: ["Intermediate", "Mid-Level", "Mid Level", "Experienced"],
      Senior: ["Senior", "Expert", "Lead", "Manager"],
    };

    for (const category in aliases) {
      for (const alias of aliases[category]) {
        const aliasRegex = new RegExp("\\b" + alias + "\\b", "i");
        if (aliasRegex.test(jobText)) {
          return category;
        }
      }
    }

    return null;
  }

  let experience = findJobExperience(jobDescription);
  if (experience) {
    if (experience == "Fresher") {
      return 0;
    } else if (experience == "Intermediate") {
      return 2;
    } else {
      return 5;
    }
  } else {
    return 0;
  }
};

module.exports = jobExperience;
