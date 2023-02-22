import path from "path";

const configuration = {
  spheron_server_address: "http://localhost:8080",
  spheron_frontend_address: "https://app.spheron.network",
  upload_api_address: "https://api-dev.spheron.network",
  version: "1.0.0",
  configFilePath: path.join(process.env.HOME? process.env.HOME: "/home/ubuntu" , ".spheron/config.json"),
  projectTrackingFilePath: path.join(
    process.env.HOME? process.env.HOME: "/home/ubuntu",
    ".spheron/project-tracking.json"
  ),
  templateUrls: {
    "react-app": "https://github.com/spheronFdn/react-boilerplate",
    "nft-edition-drop-template":
      "https://github.com/spheronFdn/react-boilerplate",
    "next-app": "https://github.com/spheronFdn/react-boilerplate",
    "portfolio-app": "https://github.com/spheronFdn/portfolio-template",
  },
  home_path: process.env.HOME || "",
};

export default configuration;