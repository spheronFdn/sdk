import path from "path";

const configuration = {
  spheron_server_address: "http://localhost:8080",
  spheron_frontend_address: "https://dev.spheron.network",
  version: "1.0.0",
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
