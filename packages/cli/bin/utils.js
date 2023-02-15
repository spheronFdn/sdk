const fs = require("fs");
const path = require("path");
const { configuration } = require("./configuration");

async function writeToConfigFile(key, value) {
  let config = {};
  try {
    // Check if the config file exists
    await fs.promises.stat(configuration.configFilePath);
    const fileContents = await fs.promises.readFile(
      configuration.configFilePath,
      "utf-8"
    );
    config = JSON.parse(fileContents);
  } catch (err) {
    console.log("Spheron config file not found. Creating a new file.");
    await fs.promises.mkdir(path.join(process.env.HOME, ".spheron"), {
      recursive: true,
    });
    await fs.promises.writeFile(configuration.configFilePath, "{}", "utf-8");
  }
  config[key] = value;
  const jsonString = JSON.stringify(config);
  await fs.promises.writeFile(
    configuration.configFilePath,
    jsonString,
    "utf-8"
  );
}

async function readFromConfigFile(key) {
  let config = {};
  try {
    const fileContents = await fs.promises.readFile(
      configuration.configFilePath,
      "utf-8"
    );
    config = JSON.parse(fileContents);
  } catch (err) {
    console.error("Error reading Spheron config file:", err.message);
    return undefined;
  }
  return config[key];
}

async function configFileExists() {
  try {
    const x = await fs.promises.stat(configuration.configFilePath);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  writeToConfigFile,
  readFromConfigFile,
  configFileExists,
};