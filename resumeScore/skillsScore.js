const stopwords = require("stopword");
const natural = require("natural");
const TfIdf = natural.TfIdf;

const skillsScore = async (jobDescription, resumeSections) => {
  function removeStopWords(text) {
    const tokens = text.toLowerCase().split(/\s+/);
    const filteredTokens = stopwords.removeStopwords(tokens);
    return filteredTokens.join(" ");
  }

  function extractNamedEntities(text) {
    const tokenizer = new natural.WordPunctTokenizer();
    const tokens = tokenizer.tokenize(text);

    const lexicon = new natural.Lexicon("EN", "Noun");
    const ruleSet = new natural.RuleSet("EN");
    const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
    const taggedTokens = tagger.tag(tokens);

    const namedEntities = taggedTokens.taggedWords
      .filter(
        (word) => word.token.length > 1 || ["c", "C"].includes(word.token)
      )
      .filter((word) => word.token.match(/^\D+$/))
      .filter(
        (word) => word.tag === "NNP" || word.tag === "NN" || word.tag === "Noun"
      )
      .map((word) => word.token);

    return namedEntities.map((noun) => noun.toLowerCase());
  }

  function calculateCosineSimilarity(resumeNouns, jobNouns) {
    const tfidf = new TfIdf();
    tfidf.addDocument(resumeNouns);
    tfidf.addDocument(jobNouns);

    const resumeVector = tfidf.listTerms(0).reduce((acc, term) => {
      acc[term.term] = term.tfidf;
      return acc;
    }, {});
    const jobVector = tfidf.listTerms(1).reduce((acc, term) => {
      acc[term.term] = term.tfidf;
      return acc;
    }, {});

    const terms = new Set([
      ...Object.keys(resumeVector),
      ...Object.keys(jobVector),
    ]);
    const dotProduct = [...terms].reduce(
      (acc, term) => acc + (resumeVector[term] || 0) * (jobVector[term] || 0),
      0
    );
    const resumeNorm = Math.sqrt(
      Object.values(resumeVector).reduce(
        (acc, value) => acc + Math.pow(value, 2),
        0
      )
    );
    const jobNorm = Math.sqrt(
      Object.values(jobVector).reduce(
        (acc, value) => acc + Math.pow(value, 2),
        0
      )
    );

    return dotProduct / (resumeNorm * jobNorm);
  }

  let jobText = jobDescription;
  jobText = removeStopWords(jobText);
  let resumeText = resumeSections.skills;
  resumeText = removeStopWords(resumeText);
  const resumeNouns = extractNamedEntities(resumeText);
  const jobNouns = extractNamedEntities(jobText);

  let cosineSimilarity = calculateCosineSimilarity(resumeNouns, jobNouns);
  cosineSimilarity = Math.ceil(cosineSimilarity * 30) / 10;
  return cosineSimilarity;
};

module.exports = skillsScore;
