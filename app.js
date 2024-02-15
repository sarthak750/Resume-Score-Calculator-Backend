const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const jobParser = require("./routes/jobParser");
const resumeUpload = require("./routes/resumeUpload");
const resumeScore = require("./routes/resumeScore");

require("dotenv").config();

const client = new S3Client({ region: "ap-south-1" });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.use("/api/v1/resumeUpload", (req, res, next) => {
  req.client = client;
  req.upload = upload.single("file");
  next();
});

app.use("/api/v1/resumeScore", (req, res, next) => {
  req.client = client;
  next();
});

app.use("/api/v1/jobParser", jobParser);
app.use("/api/v1/resumeUpload", resumeUpload);
app.use("/api/v1/resumeScore", resumeScore);

app.listen(5000, console.log("Server is listening on port 5000..."));
