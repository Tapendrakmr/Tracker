var path = require("path");

const snipScreen = (imageName) => {
  console.log("fetch path start");

  const definedire = path.join(
    __dirname,
    "../../../AppData/fullImage",
    `${imageName}.jpg`
  );

  return definedire;
};

const generateThumbPath = async (imageName) => {
  const imagepath = path.join(
    __dirname,
    "../../../AppData/thumbimage",
    `thumb_${imageName}.jpg`
  );
  console.log(imagepath);
  return imagepath;
};
module.exports = {
  snipScreen,
  generateThumbPath,
};
