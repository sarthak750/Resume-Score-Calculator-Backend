const express = require("express");
const router = express.Router();

const resumeScore = require("../controllers/resumeScore");

router.route("/").post(resumeScore);

module.exports = router;
