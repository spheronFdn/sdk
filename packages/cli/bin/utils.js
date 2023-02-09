const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

async function writeToConfigFile(key, value) {
  let config = {};
  const configFilePath = path.join(process.env.HOME, ".spheron/config.yaml");
  try {
    // Check if the config file exists
    await fs.promises.stat(configFilePath);
    const fileContents = await fs.promises.readFile(configFilePath, "utf-8");
    config = yaml.parse(fileContents);
  } catch (err) {
    console.log("Spheron config file not found. Creating a new file.");
    await fs.promises.mkdir(path.join(process.env.HOME, ".spheron"), {
      recursive: true,
    });
    await fs.promises.writeFile(configFilePath, "", "utf-8");
  }
  config[key] = value;
  const yamlString = yaml.stringify(config);
  await fs.promises.writeFile(configFilePath, yamlString, "utf-8");
}

module.exports = {
  writeToConfigFile,
};
