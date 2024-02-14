const express = require("express");
const router = express.Router();

const jobParser = require("../controllers/jobParser");

router.route("/").post(jobParser);

module.exports = router;
