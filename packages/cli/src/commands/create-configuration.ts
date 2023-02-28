import { v4 as uuidv4 } from "uuid";
import configuration from "../configuration";
import { writeToConfigFile, fileExists, writeToJsonFile } from "../utils";

export async function createConfiguration() {
  let executionError = false;
  try {
    if (await fileExists(configuration.configFilePath)) {
      console.log("Configuration created");
      return;
    }
    console.log("Setting up spheron configuration...");
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
      console.log("There was a problem in creating spheron configuration");
    }
    process.exit(0);
  }
}
