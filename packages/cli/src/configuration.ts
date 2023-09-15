import path from "path";

const configuration = {
  spheronServerAddress: "http://localhost:8085",
  spheronFrontendAddress: "https://dev.spheron.network",
  version: "1.0.16",
  configFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/config.json"
  ),
  projectTrackingFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/project-tracking.json"
  ),
  computeClusterTrackingFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/compute-cluster-tracking.json"
  ),
  homePath: process.env.HOME || "",
};

export default configuration;
