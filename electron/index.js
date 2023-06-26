const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");

let win;

const createWindow = () => {
  // Creates the browser window.
  win = new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    // frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // Create the URL needed to load the window.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(app.getAppPath(), "./build/index.html"),
      protocol: "file:",
      slashes: true,
    });

  // Load HTML of the app.
  win.loadURL(startUrl);

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  win.once("ready-to-show", () => {
    win.setBackgroundColor("#282e3a");
    win.show();
    win.focus();

    autoUpdater.checkForUpdatesAndNotify();
  });

  // Emitted when the window is closed.
  win.on("closed", function () {
    win = undefined; // delete corresponding element
  });
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

// AUTOUPDATER
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

ipcMain.on("restart", () => {
  autoUpdater.quitAndInstall();
});

// ########## MAC OS ##########
// Quit when all windows are closed, except on MAC OS. It's common
// for applications and their menu bars to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
