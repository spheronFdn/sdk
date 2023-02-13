const path = require("path");

const configuration = {
  spheron_server_address: "http://localhost:8080",
  spheron_frontend_address: "https://app.spheron.network",
  version: "1.0.0",
  configFilePath: path.join(process.env.HOME, ".spheron/config.yaml"),
};

module.exports = {
  configuration,
};
