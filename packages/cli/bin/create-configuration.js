const uuidv4 = require("uuid");
const { configuration } = require("./configuration");

const { writeToConfigFile, fileExists, writeToJsonFile } = require("./utils");

async function createConfiguration() {
  let executionError = false;
  try {
    if (await fileExists(configuration.configFilePath)) {
      console.log("Config file already exists");
      return;
    }
    console.log("Creating spheron configuration file...");
    const id = uuidv4.v4();
    await writeToConfigFile("id", id);
    await writeToJsonFile(
      "projects",
      [],
      configuration.projectTrackingFilePath
    );
  } catch (error) {
    console.log("Error: ", error.message);
    executionError = true;
  } finally {
    if (executionError) {
      console.log("There was a problem creating spheron configuration file");
    }
    process.exit(0);
  }
}

module.exports = {
  createConfiguration,
};
