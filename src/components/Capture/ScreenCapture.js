// import React, { Component } from "react";
// import Select from "@material-ui/core/Select";
// import Button from "@material-ui/core/Button";
// import PhotoCamera from "@material-ui/icons/PhotoCamera";
// import { Typography } from "@material-ui/core";
// import AWS from "aws-sdk";

// export class ScreenCapture extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       timePeriod: 5, //Defined the capture timeperiod
//       controlCapture: "", //Store the setInterval value
//       networkConnection: "offline", //store network connections
//       sessionStartTime: "", //store when sesseion start
//       sessionDate: "", //Date of session
//       ImageCaptureTime: "", //Image Capturing Time
//       ImagePath: "",
//     };
//     this.handleCheckConnection = this.handleCheckConnection.bind(this);

//     //fetch dependencies
//     this.path = window.require("path");
//     this.os = window.require("os");
//     this.fs = window.require("fs");
//     // Electron
//     this.electron = window.require("electron");
//     this.desktopCapturer = this.electron.desktopCapturer;
//     this.shell = this.electron.shell;
//     this.remote = this.electron.remote;
//     this.screen = this.remote.screen;

//     this.ipcRenderer = this.electron.ipcRenderer;
//   }
//   // Store Value in DataBase

//   handleStoreData = () => {
//     var data = {
//       sessionDate: this.state.sessionDate,
//       sessionStartTime: this.state.sessionStartTime,
//       ImageCaptureTime: this.state.ImageCaptureTime,
//       networkConnection: this.state.networkConnection,
//       ImagePath: this.state.ImagePath,
//     };
//     var result = this.ipcRenderer.sendSync("Insert_data", data);
//     console.log(result);
//   };

//   // Execute DesktopCapture
//   onSnipClick = async () => {
//     let tempTime = new Date();
//     let hours = tempTime.getHours();
//     let minute = tempTime.getMinutes();

//     try {
//       const screenSize = this.screen.getPrimaryDisplay().workAreaSize;
//       const maxDimension = Math.max(screenSize.width, screenSize.height);

//       const sources = await this.desktopCapturer.getSources({
//         types: ["screen"],
//         thumbnailSize: {
//           width: maxDimension * window.devicePixelRatio,
//           height: maxDimension * window.devicePixelRatio,
//         },
//       });

//       const entireScreenSource = sources.find(
//         (source) =>
//           source.name === "Entire Screen" || source.name === "Screen 1"
//       );
//       let imagelocation;
//       if (entireScreenSource) {
//         console.log(entireScreenSource);

//         let imageName = `image${hours}_${minute}.jpg`;
//         const outputPath = this.path.join(this.os.homedir(), imageName);
//         console.log(outputPath);

//         // Convert image into Png
//         const image = entireScreenSource.thumbnail.toPNG();

//         console.log(image);

//         this.fs.writeFile(outputPath, image, (err) => {
//           if (err) {
//             return console.error(err);
//           }

//           this.shell.openExternal(`file://${outputPath}`);
//         });
//         console.log(`file://${outputPath}`);
//         this.setState({
//           ImageCaptureTime: `${hours}:${minute}`,
//           ImagePath: `file://${outputPath}`,
//         });
//         console.log(this.state);

//         new Promise((resolve, reject) => {
//           this.fs.readFile(outputPath, async function (err, data) {
//             if (err) {
//               reject(err);
//             } else {
//               console.log(data);
//               resolve(data);
//             }
//           });
//         })
//           .then((data) => {
//             this.handleAWSUpdate(data);
//           })
//           .catch((err) => {
//             throw err;
//           });

//         // Store value in db
//         this.handleStoreData();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Select time period
//   changeTimePeriod = async (event) => {
//     await this.setState({
//       timePeriod: Number(event.target.value),
//     });
//     console.log(this.state.timePeriod);
//   };

//   // Check Connection
//   handleCheckConnection = () => {
//     var ifConnected = navigator.onLine;
//     console.log(ifConnected);
//     if (ifConnected) {
//       return this.setState({
//         networkConnection: "online",
//       });
//     } else {
//       return this.setState({
//         networkConnection: "offline",
//       });
//     }
//   };

//   //  testing
//   //  AWS
//   handleAWSUpdate = (image) => {
//     console.log("handleAws");
//     console.log(image);
//     // console.log(file.data);

//     //  testing
//     let s3bucket = new AWS.S3({
//       accessKeyId: "AKIAJUI4M2ZASR7DCLQQ",
//       secretAccessKey: "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",
//       Bucket: "bigdesk-private",
//       signatureVersion: "v4",
//       region: "ap-south-1",
//     });
//     return s3bucket.createBucket(function (err, data) {
//       let filename =
//         "tapendra/folder/" + `tap_binary${Math.floor(Math.random() * 100)}.jpg`;

//       var params = {
//         Bucket: "bigdesk-private",
//         // ACL: "public-read-write",
//         Key: filename,
//         signatureVersion: "v4",
//         Body: image,
//       };
//       s3bucket.upload(params, function (err, data) {
//         if (err) {
//           console.log("error in callback");
//           console.log(err);
//         }
//         console.log("succcess");
//         s3bucket.getSignedUrl(
//           "getObject",
//           {
//             Bucket: "bigdesk-private",
//             Key: filename,

//             Expires: 60 * 5,
//           },

//           function (err, url) {
//             console.log("The URL is", url);
//           }
//         );
//         console.log(data);
//       });
//     });
//   };

//   //  Start Window
//   componentDidMount() {
//     // Start Check Database Connection
//     const database = this.ipcRenderer.sendSync("Intialise_db");
//     console.log(database);
//     //  End

//     let day = new Date();

//     this.setState({
//       sessionDate: `${day.getDate()}/${day.getMonth()}/${day.getFullYear()}`,
//       sessionStartTime: `${day.getHours()}-${day.getMinutes()}`,
//     });
//     setInterval(this.handleCheckConnection, 1000);

//     // StartCapturing
//     let time = this.state.timePeriod + Math.floor(Math.random() * 5);
//     let startCapturing = setInterval(this.onSnipClick, time * 60 * 1000);
//     this.setState({
//       controlCapture: startCapturing,
//     });
//   }

//   // Stop Capturing of screen
//   stopCapture = () => {
//     console.log("dismmised");
//     clearInterval(this.state.controlCapture);
//   };

//   //  Search
//   handleSearch = () => {
//     console.log("Search Button");
//     let result = this.ipcRenderer.sendSync("Search_entries");
//     console.log(result);
//   };

//   // Update
//   handleUpdate = () => {
//     console.log("Update Button");
//     let result = this.ipcRenderer.sendSync("Update Records");
//     console.log(result);
//   };

//   // Delete
//   handleDelete = () => {
//     console.log("Delete Button");
//     let result = this.ipcRenderer.sendSync("Delete Entries");
//     console.log(result);
//   };

//   render() {
//     return (
//       <div>
//         <h1>Capture the screen</h1>
//         <br />
//         <Typography variant="h3">
//           You are :{this.state.networkConnection}
//         </Typography>
//         <br />
//         <center>
//           <Button
//             variant="contained"
//             color="primary"
//             component="span"
//             onClick={this.onSnipClick}
//             endIcon={<PhotoCamera />}
//           >
//             Snap The Screen
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             component="span"
//             onClick={this.stopCapture}
//           >
//             Stop
//           </Button>
//           <br />
//           <PhotoCamera />
//         </center>
//         <br />
//         Select Time Period : &nbsp;
//         <Select
//           native
//           value={this.state.timePeriod}
//           name="Time Period"
//           onChange={this.changeTimePeriod}
//           label="Select Time Period"
//         >
//           <option value="5">5 min</option>
//           <option value="10">10 min"</option>
//           <option value="15">15 min"</option>
//         </Select>
//         <br />
//         <br />
//         <Button
//           variant="contained"
//           color="secondary"
//           component="span"
//           onClick={this.handleSearch}
//         >
//           Check all of your record
//         </Button>
//         <br />
//         <br />
//         <Button
//           variant="contained"
//           color="secondary"
//           component="span"
//           onClick={this.handleUpdate}
//         >
//           Update
//         </Button>
//         <br />
//         <br />
//         <Button
//           variant="contained"
//           color="secondary"
//           component="span"
//           onClick={this.handleDelete}
//         >
//           delete
//         </Button>
//         <Button
//           variant="contained"
//           color="secondary"
//           component="span"
//           onClick={this.handleAWSUpdate}
//         >
//           AWS
//         </Button>
//       </div>
//     );
//   }
// }

// export default ScreenCapture;
