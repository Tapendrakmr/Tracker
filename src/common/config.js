const env = "dev";
let BASE_URL;
if (env === "dev") {
  BASE_URL = "http://601eedcd15e9.ngrok.io";
}

module.exports = {
  BASE_URL,
};
