import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import configuration from "../configuration";
import { fileExists, writeToJsonFile } from "../utils";

export async function createConfiguration() {
  try {
    if (await fileExists(configuration.configFilePath)) {
      console.log("Configuration created");
      return;
    }
    console.log("Setting up spheron configuration...");
    await fs.promises.mkdir(path.join(configuration.home_path, ".spheron"), {
      recursive: true,
      mode: 0o777,
    });
    await fs.promises.chmod(
      path.join(configuration.home_path, ".spheron"),
      0o777
    );

    const id = uuidv4();
    await writeToJsonFile("id", id, configuration.configFilePath);
    await fs.promises.chmod(configuration.configFilePath, 0o777);

    await writeToJsonFile(
      "projects",
      [],
      configuration.projectTrackingFilePath
    );
    await fs.promises.chmod(configuration.projectTrackingFilePath, 0o777);
  } catch (error) {
    console.log("Error: ", error.message);
  }
}
