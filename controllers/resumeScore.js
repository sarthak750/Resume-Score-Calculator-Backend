const { GetObjectCommand } = require("@aws-sdk/client-s3");
const pdfParser = require("../resumeParser/pdfParser");
const docxParser = require("../resumeParser/docxParser");
const resumeSection = require("../resumeParser/resumeSections");
const resumeScoreCalculator = require("../resumeScore/resumeScoreCalculator");

const resumeScore = async (req, res) => {
  try {
    const client = req.client;
    let jobData = JSON.parse(req.body.jobData);
    jobData = jobData.jobData;
    let resumeType = req.body.resumePath.slice(-4) === ".pdf" ? "pdf" : "docx";
    let resumeText = "";

    const command = new GetObjectCommand({
      Bucket: "resume-score-calculator",
      Key: req.body.resumePath,
    });

    const response = await client.send(command);

    const str = await response.Body.transformToByteArray();
    const buffer = Buffer.from(str);

    if (resumeType === "pdf") {
      resumeText = await pdfParser(buffer);
    } else {
      resumeText = await docxParser(buffer);
    }

    const resumeSections = await resumeSection(resumeText);

    const score = await resumeScoreCalculator(resumeSections, jobData);
    console.log(score);

    res.status(200).json({ score: score });
  } catch (error) {
    res.status(401).json({ msg: error });
  }
};

module.exports = resumeScore;
