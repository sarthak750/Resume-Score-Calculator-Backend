const resumeExperience = async (resumeSections) => {
  function extractResumeExperience(text) {
    const tokens = text.split(" ");
    const numbers = tokens.filter((token) => {
      const num = parseFloat(token);
      return (
        !isNaN(num) &&
        ((num >= 2000 && num <= 3000) || (num >= 10 && num <= 40))
      );
    });
    let extractedNumbers = numbers.map((token) => parseFloat(token));

    if (extractedNumbers.length === 1) {
      const currentYear = new Date().getFullYear();
      if (extractedNumbers[0] > 2000) {
        extractedNumbers.push(currentYear);
      } else {
        extractedNumbers.push(parseInt(currentYear.toString().substring(2)));
      }
    }
    let totalExperience = 0;
    for (let i = 1; i < extractedNumbers.length; i++) {
      totalExperience += extractedNumbers[i] - extractedNumbers[i - 1];
    }

    return totalExperience;
  }

  if (resumeSections.experience) {
    return extractResumeExperience(resumeSections.experience);
  } else {
    return 0;
  }
};

module.exports = resumeExperience;
