var AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRECT_KEY,
  Bucket: process.env.REACT_APP_BUCKET,
  signatureVersion: "v4",
  region: process.env.REACT_APP_REGION,
});

module.exports = {
  s3,
};
