import { v4 as uuidv4 } from "uuid";
import configuration from "../configuration";
import { writeToConfigFile, fileExists, writeToJsonFile } from "../utils";

export async function createConfiguration() {
  let executionError = false;
  try {
    if (await fileExists(configuration.configFilePath)) {
      console.log("Config file already exists");
      return;
    }
    console.log("Creating spheron configuration file...");
    const id = uuidv4();
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
