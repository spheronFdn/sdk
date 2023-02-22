import { v4 as uuidv4 } from "uuid";
import path from "path";

import { writeToJsonFile, fileExists, readFromJsonFile } from "./utils";
import configuration  from "./configuration";

export async function init(name: string, protocol: string, projectPath: string) {
  let executionError = false;
  try {
    if (await fileExists("./spheron.json")) {
      throw new Error("Spheron file already exists");
    }
    console.log("Spheron initialization...");
    const id = uuidv4();
    console.log(`${path.join(process.cwd(), "./spheron.json")}`);
    await writeToJsonFile("id", id, "./spheron.json");
    const spheron_configuration = {
      name,
      protocol: protocol,
      path: projectPath ? projectPath : path.join(process.cwd(), "./"),
    };
    await writeToJsonFile(
      "configuration",
      spheron_configuration,
      path.join(process.cwd(), "./spheron.json")
    );
    //link to project tracking file
    const projects = await readFromJsonFile(
      "projects",
      configuration.projectTrackingFilePath
    );
    projects.push({
      name,
      path: projectPath ? projectPath : path.join(process.cwd(), "./"),
    });
    await writeToJsonFile(
      "projects",
      projects,
      configuration.projectTrackingFilePath
    );

    console.log("Spheron initialized");
  } catch (error) {
    console.log("Error: ", error.message);
    executionError = true;
  } finally {
    if (executionError) {
      console.log("Failed to initialize spheron in project");
    }
    process.exit(0);
  }
}
