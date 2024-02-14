const resumeSection = async (resumeText) => {
  function extractSectionsFromResume(resumeText) {
    const sectionAliases = {
      experience: [
        "EXPERIENCE",
        "Experience",
        "Work Experience",
        "Professional Experience",
      ],
      internship: [
        "INTERNSHIP",
        "Internship",
        "Intern Experience",
        "INTERNSHIPS",
        "Internships",
        "Intern",
        "INTERN",
      ],
      skills: ["SKILLS", "Skills", "Technical Skills"],
      education: ["EDUCATION", "Education", "Academic Qualifications"],
      projects: ["PROJECTS", "Projects", "Side Projects"],
      achievements: ["ACHIEVEMENTS", "Achievements", "Accomplishments"],
    };

    const sectionOrder = Object.keys(sectionAliases).sort((a, b) => {
      const positionA = getSectionPosition(a);
      const positionB = getSectionPosition(b);
      return positionA - positionB;
    });

    function getSectionPosition(section) {
      const aliases = sectionAliases[section];
      let position = Number.MAX_SAFE_INTEGER;
      for (const alias of aliases) {
        const index = resumeText.indexOf(alias);
        if (index !== -1 && index < position) {
          position = index;
        }
      }
      return position;
    }

    const sectionData = {};
    let lastPosition = 0;

    for (const section of sectionOrder) {
      const aliases = sectionAliases[section];
      let position = Number.MAX_SAFE_INTEGER;
      for (const alias of aliases) {
        const index = resumeText.indexOf(alias, lastPosition);
        if (index !== -1 && index < position) {
          position = index;
        }
      }
      if (position !== Number.MAX_SAFE_INTEGER) {
        let endPosition = resumeText.length;
        const nextIndex = sectionOrder.indexOf(section) + 1;
        if (nextIndex < sectionOrder.length) {
          const nextSection = sectionOrder[nextIndex];
          const nextAliases = sectionAliases[nextSection];
          for (const alias of nextAliases) {
            const index = resumeText.indexOf(alias, position + 1);
            if (index !== -1 && index < endPosition) {
              endPosition = index;
            }
          }
        }
        sectionData[section] = resumeText
          .substring(position, endPosition)
          .trim();
        lastPosition = endPosition;
      } else {
        sectionData[section] = "";
      }
    }
    return sectionData;
  }

  const resumeSections = extractSectionsFromResume(resumeText);

  return resumeSections;
};

module.exports = resumeSection;
