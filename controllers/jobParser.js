const indeedData = require("../jobData/indeedData");
const linkedinData = require("../jobData/linkedinData");

const jobParser = async (req, res) => {
  try {
    let jobData = {};

    if (req.body.jobPlatform === "indeed") {
      jobData = await indeedData(req.body.url);
    } else {
      jobData = await linkedinData(req.body.url);
    }

    console.log(jobData);

    res.status(200).json({
      msg: "Data received",
      jobData: jobData,
      jobPlatform: req.body.jobPlatform,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: error });
  }
};

module.exports = jobParser;
