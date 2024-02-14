const { PutObjectCommand } = require("@aws-sdk/client-s3");

const resumeUpload = async (req, res) => {
  try {
    req.upload(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).send("Error uploading file");
      }

      const file = req.file;
      const client = req.client;

      const timestamp = Date.now();
      const key = `${timestamp}_${file.originalname}`;

      const main = async () => {
        const command = new PutObjectCommand({
          Bucket: "resume-score-calculator",
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        try {
          const response = await client.send(command);
          console.log(response);
          return res
            .status(200)
            .json({
              msg: "Resume Uploaded",
              path: key,
              fileName: file.originalname,
            });
        } catch (err) {
          console.error(err);
          return res.status(500).send("Error uploading file to S3");
        }
      };

      main();
    });
  } catch (error) {
    res.status(401).json({ msg: error });
  }
};

module.exports = resumeUpload;
