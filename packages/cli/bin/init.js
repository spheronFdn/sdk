const uuidv4 = require("uuid");
const path = require("path");

const { writeToJsonFile, fileExists, readFromJsonFile } = require("./utils");
const { configuration } = require("./configuration");

async function init(name, protocol, projectPath) {
  let executionError = false;
  try {
    if (await fileExists("./spheron.json")) {
      throw new Error("Spheron file already exists");
    }
    console.log("Spheron initialization...");
    const id = uuidv4.v4();
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

module.exports = {
  init,
};
