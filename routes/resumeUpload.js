const express = require("express");
const router = express.Router();

const resumeUpload = require("../controllers/resumeUpload");

router.route("/").post(resumeUpload);

module.exports = router;
