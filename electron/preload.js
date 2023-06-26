const pjson = require("../package.json");
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  versions: {
    app: pjson.version,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
  handle: (channel, cb) => {
    ipcRenderer.on(channel, (event, ...args) => {
      ipcRenderer.removeAllListeners(channel);
      cb(...args);
    });
  },
  update: () => ipcRenderer.send("restart"),
});
