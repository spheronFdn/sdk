import path from "path";

const configuration = {
  spheronServerAddress: "https://api-dev.spheron.network",
  spheronFrontendAddress: "https://dev.spheron.network",
  version: "1.0.0",
  configFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/config.json"
  ),
  projectTrackingFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/project-tracking.json"
  ),
  homePath: process.env.HOME || "",
};

export default configuration;
