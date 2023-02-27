import path from "path";

import { writeToJsonFile, fileExists, readFromJsonFile } from "../utils";
import configuration from "../configuration";

export async function init(
  name: string,
  protocol: string,
  projectPath: string
) {
  let executionError = false;
  try {
    if (await fileExists("./spheron.json")) {
      throw new Error("Spheron file already exists");
    }
    console.log("Spheron initialization...");
    console.log(`${path.join(process.cwd(), "./spheron.json")}`);
    const pathSegments = process.cwd().split("/");
    const spheron_configuration = {
      name: name ? name : pathSegments[pathSegments.length - 1],
      protocol: protocol,
      rootPath: projectPath ? projectPath : "./", // by default it's a relative path from spheron.json point of view
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
      name: name ? name : pathSegments[pathSegments.length - 1],
      path: projectPath ? projectPath : path.join(process.cwd(), "./"),
      protocol: protocol,
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
