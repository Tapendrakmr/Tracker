console.log("Backend File Running");

const { BrowserWindow, app, ipcMain, globalShortcut } = require("electron");

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

// Our constructor
const {
  Initialise,
  InsertData,
  SearchAllUnsendData,
  searchAll,
  UpdateRecord,
  DeleteEntry,
} = require("./Database/Data");

const { snipScreen, generateThumbPath } = require("./FrontendFunctions/front");

let win;
function createWindow() {
  win = new BrowserWindow({
    // transparent: true,
    // frame: false,\

    webPreferences: {
      nodeIntegration: true,
    },
    width: 325,
    height: 670,
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../build/index.html")}`
  );

  win.webContents.openDevTools();
  // Execute when window load
  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("close", () => {
    win = null;
  });
}
//

// Fetch Screen
ipcMain.on("CheckCapture", async (event, data) => {
  let result = await snipScreen(data);
  console.log(result);
  event.returnValue = result;
});

ipcMain.on("FetchThumbUrl", async (event, data) => {
  let result = await generateThumbPath(data);
  console.log("thumburl");
  event.returnValue = result;
});

// Database Created
ipcMain.on("Intialise_db", function (event) {
  let result = Initialise();
  console.log(result);
  event.returnValue = result;
});

// Insertdata into DataBase
ipcMain.on("Insert_data", async function (event, data) {
  let result = await InsertData(data);
  console.log(data);
  event.returnValue = result;
});

// Fetch all object whose images are not uploaded Database

ipcMain.on("Fetch_UnsendData", async function (event) {
  let answer = await SearchAllUnsendData();
  console.log("fetch data in electron page");
  console.log(answer);
  event.returnValue = answer;
});

// Selcet all data

// ipcMain.on("Selectall_Data", async function (event) {
//   let answer = await searchAll();
//   event.returnValue = answer;
// });
// Update

ipcMain.on("Update Records", async function (event, data) {
  let answer = await UpdateRecord(data);
  event.returnValue = answer;
});
// Delete

ipcMain.on("DeleteData", function (event) {
  let answer = DeleteEntry();
  event.returnValue = answer;
});

//  for Windows

app.whenReady().then(() => {
  globalShortcut.register("CommandOrControl+X", () => {
    console.log("CommandOrControl+X is pressed");
  });
});
app.on("ready", createWindow);

// For Mac user

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (win == null) {
    createWindow();
  }
});
