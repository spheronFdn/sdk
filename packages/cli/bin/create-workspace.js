const uuidv4 = require("uuid");

const { writeToWorkspaceFile } = require("./utils");
const { fileExists } = require("./utils");

async function createWorkspace(name) {
  let executionError = false;
  try {
    if(await fileExists("./.spheron-workspace.json")){
        throw new Error("Workspace already created");
    }
    console.log("Creating workspace...");
    const id = uuidv4.v4();
    await writeToWorkspaceFile("id", id);
    await writeToWorkspaceFile("name", name);
    await writeToWorkspaceFile("projects", []);
    console.log("Workspace created");
  } catch (error) {
    console.log("Error: ", error.message);
    executionError = true;
  } finally {
    if (executionError) {
      console.log("There was a problem while creating workspace");
    }
    process.exit(0);
  }
}

module.exports = {
    createWorkspace,
};
