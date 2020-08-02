var fs = require("fs");
var AWS = require("aws-sdk");
const { s3 } = require("../../util/aws");
// const ioHook = require("iohook");

// Electron
var electron = window.require("electron");
var desktopCapturer = electron.desktopCapturer;
var shell = electron.shell;
var remote = electron.remote;
var screen = remote.screen;
var ipcRenderer = electron.ipcRenderer;

// Test
const keyMouse = () => {
  // ioHook.on("mousemove", (event) => {
  //   console.log(event); // { type: 'mousemove', x: 700, y: 400 }
  // });
  // // Register and start hook
  // ioHook.start();
  // // Alternatively, pass true to start in DEBUG mode.
  // ioHook.start(true);
};
const activate = (dataFromtrack) => {
  const result = ipcRenderer.sendSync("CheckCapture");
};

const every10Min = (dataFromtrack) => {
  console.log("after every 10 minnnnn calllll", dataFromtrack);
  let randomTime = Math.round(Math.random() * 600000);
  // let randomTime = Math.round(Math.random() * 60000);
  setTimeout(function () {
    console.log("data from tack random =========", dataFromtrack);
    snipScreen(dataFromtrack);
  }, randomTime);
};

const snipScreen = async (dataFromtrack) => {
  try {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);

    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio,
      },
    });

    const entireScreenSource = sources.find(
      (source) => source.name === "Entire Screen" || source.name === "Screen 1"
    );

    if (entireScreenSource) {
      let today = new Date();
      let imageName = today.getTime();
      const outputPath = await ipcRenderer.sendSync("CheckCapture", imageName);
      console.log(outputPath);
      // Convert image into Png
      const image = entireScreenSource.thumbnail.toPNG();

      fs.writeFile(outputPath, image, (err) => {
        if (err) {
          return console.error(err);
        }
        shell.openExternal(`file://${outputPath}`);
      });

      //  for Screenshot
      const thumbuffer = entireScreenSource.thumbnail
        .resize({
          width: 150,
          height: 100,
        })
        .toPNG();

      const thumbPath = await ipcRenderer.sendSync("FetchThumbUrl", imageName);

      fs.writeFile(thumbPath, thumbuffer, (err) => {
        if (err) {
          return console.error(err);
        }
        // console.log("thumbnail generate sucessfully");
      });

      dataFromtrack.FullImagePath = outputPath;
      dataFromtrack.ThumbimagePath = thumbPath;
      dataFromtrack.ImageName = imageName;

      //   console.log("Catching fullimage function");
      // Now pass al data to FullImage Upload
      if (dataFromtrack.networkConnection === "online") {
        // console.log("data from traack ============= inside =================");
        getFullImageData(dataFromtrack, "insert"); // for fullImage
      } else {
        dataFromtrack.Uploded = false;
        databaseInsert(dataFromtrack);
      }

      console.log("catching thumbnail function");
    } else {
      console.log("something error");
    }
  } catch (err) {
    console.error(err);
  }
};

const getFullImageData = (dataFromtrack, type, callback) => {
  new Promise((resolve, reject) => {
    fs.readFile(dataFromtrack.FullImagePath, function (err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  })
    .then(async (data) => {
      if (!dataFromtrack.Uploded) {
        // callback(data, dataFromtrack, type);
        let result = await FullImageAwsUpload(data, dataFromtrack, type);
      }
    })
    .catch((err) => {
      console.log("unable to upload");
      throw err;
    });
};

const FullImageAwsUpload = async (image, dataFromtrack, type) => {
  uploadFile(image, dataFromtrack, type);
};

const thumbImageData = (dataFromtrack, type) => {
  new Promise((resolve, reject) => {
    fs.readFile(dataFromtrack.ThumbimagePath, function (err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  })
    .then(async (data) => {
      let result = await uploadthumb(data, dataFromtrack, type);
      console.log(result);
    })

    .catch((err) => {
      console.log("unable to upload");
      throw err;
    });
};

const uploadthumb = (image, dataFromtrack, type) => {
  //   s3bucket.createBucket(function (err, data) {
  //     let filename =
  //       `userId_${dataFromtrack.userId}/projectId_${dataFromtrack.projectId}/sessionDate_${dataFromtrack.sessionDate}/Thumbnail/` +
  //       "thumb_" +
  //       `${dataFromtrack.ImageName}.jpg`;
  //     var params = {
  //       Bucket: "bigdesk-private",
  //       Key: filename,
  //       signatureVersion: "v4",
  //       Body: image,
  //     };
  //     s3bucket.upload(params, function (err, data) {
  //       if (err) {
  //         console.log("error in callback");
  //         dataFromtrack.Uploded = false;
  //         console.log(err);
  //       } else {
  //         console.log("Uploading thumbnail...");
  //         dataFromtrack.Uploded = true;
  //         dataFromtrack.ThumbKey = data.key;
  //         console.log("insidie data");
  //         console.log(data);
  //       }
  //       // dataFromtrack.key = "";
  //       console.log(dataFromtrack);
  //       // fulldetails(dataFromtrack);
  //       console.log(type);
  //       if (type == "insert") {
  //         databaseInsert(dataFromtrack);
  //       } else {
  //         updateField(dataFromtrack);
  //       }
  //     });
  //   });
};

// const fulldetails = (dataFromtrack) => {
//   console.log(dataFromtrack);
// };

// // DataBase operation

// create table in sql
const databaseTableCreate = () => {
  const database = ipcRenderer.sendSync("Intialise_db");
  // console.log(database);
};

// Insert Data into database
const databaseInsert = (dataFromtrack) => {
  console.log("all data inse");
  console.log(dataFromtrack);
  var result = ipcRenderer.sendSync("Insert_data", dataFromtrack);
  console.log(result);
  // if (dataFromtrack.Uploded === true) {
  //   deletefile(dataFromtrack.FullImagePath);
  //   deletefile(dataFromtrack.ThumbimagePath);
  // }
};
// fetch all images which are not uploaded yet
const UnsendImage = () => {
  const unsendObject = ipcRenderer.sendSync("Fetch_UnsendData");
  if (unsendObject.length > 0) {
    //   console.log("all unsend images =======================", unsendObject);
    unsendObject.forEach((element) => {
      getFullImageData(element, "update");
    });
  } else {
    console.log("everything updated");
  }

  console.log(unsendObject);
};

// Update data
const updateField = (updateDate) => {
  console.log("update value");
  const answer = ipcRenderer.sendSync("Update Records", updateDate);
  console.log(updateDate);
  // if (updateDate.Uploded === true) {
  //   deletefile(updateDate.FullImagePath);
  //   deletefile(updateDate.ThumbimagePath);
  // }
};

// const selectAll = () => {
//   const answer = ipcRenderer.sendSync("Selectall_Data");
//   return answer;
// };

// const deleteTable = () => {
//   const deletedat = ipcRenderer.sendSync("DeleteData");
//   console.log(deletedat);
// };
// delete file c
const deletefile = (imagelocation) => {
  new Promise((resolve, reject) => {
    fs.unlink(imagelocation, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
      .then((data) => {
        console.log(data);
        console.log("file deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        console.log("there is something wrong with file");
      });
  });
};

const uploadFile = (image, dataFromtrack, type) => {
  s3.createBucket(function (err, data) {
    let filename =
      `userId_${dataFromtrack.userId}/projectId_${dataFromtrack.projectId}/sessionDate_${dataFromtrack.sessionDate}/FullImage/` +
      `${dataFromtrack.ImageName}.jpg`;
    var params = {
      Bucket: process.env.REACT_APP_BUCKET,
      Key: filename,
      signatureVersion: "v4",
      Body: image,
    };
    s3.upload(params, function (err, data) {
      if (err) {
        console.log("error in file upload ================", err);
        dataFromtrack.Uploded = false;
        console.log(err);
      } else {
        console.log("Uploading fullimage ...");
        dataFromtrack.Uploded = true;
        dataFromtrack.FullImageKey = data.key;
        console.log("insidie data");
        console.log(data);
      }
    });
  });
};

const startMouseAndKeyboard = () => {
  ipcRenderer.sendSync("StarTracking");
};

module.exports = {
  databaseTableCreate,
  snipScreen,
  UnsendImage,
  activate,
  every10Min,
  // deleteTable,
  // selectAll,
  keyMouse,
};
