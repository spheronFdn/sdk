import path from "path";

const configuration = {
  spheron_server_address: "https://api-dev.spheron.network",
  spheron_frontend_address: "https://dev.spheron.network",
  version: "1.0.1",
  configFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/config.json"
  ),
  projectTrackingFilePath: path.join(
    process.env.HOME ? process.env.HOME : "/home/ubuntu",
    ".spheron/project-tracking.json"
  ),
  home_path: process.env.HOME || "",
};

export default configuration;
