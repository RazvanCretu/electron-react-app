/* eslint-disable no-template-curly-in-string */

module.exports = {
  //  Electron Builder Settings
  appId: "com.electron.electron-react-app",
  artifactName: "${productName} setup.${ext}",
  // The below is need so that `electron-builder` won't search
  // for public/electron.js but rather in the paths
  // included in `files` property. electron/index.js our case.
  extends: null,
  files: ["build/**/*", "electron/**/*", "package.json"],
  directories: { output: "./dist/${version}" },
  publish: {
    provider: "github",
    owner: "YourGithub",
    repo: "YourRepo",
    token: "${env.GH_TOKEN}",
  },
};
