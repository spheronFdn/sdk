const child_process = require("child_process");
const { configuration } = require("./configuration");

async function createTemplate(templateUrl, folderName) {
  let executionError = false;
  try {
    console.log(templateUrl, folderName);
    await executeCloneOfRepo(templateUrl, folderName);
  } catch (error) {
    console.log("Error: ", error.message);
    executionError = true;
  } finally {
    if (executionError) {
      console.log("There was a problem while creating template");
    }
    process.exit(0);
  }
}

function executeCloneOfRepo(sourceUrl, folderName) {
  return new Promise((resolve) => {
    const child = child_process.spawn("sh", ["./bin/script/clone.sh"], {
      shell: true,
      env: {
        SOURCE_URL: sourceUrl,
        FOLDER_NAME: folderName,
      },
    });
    let scriptOutput = "";
    let exitCode = 0;
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (data) => {
      const log = data.toString().trim();
      console.log(log);
      scriptOutput += `${log}\n`;
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (data) => {
      const log = data.toString().trim();
      console.log(log);
    });
    child.on("error", (err) => {
      exitCode = 1;
      console.log(err);
    });
    child.on("close", () => {
      resolve({ exitCode, scriptOutput });
    });
  });
}
async function listTemplates() {
  console.log(
    `Supported templates: \n ------------------ \n 
    [react-app]                 (${configuration.templateUrls["react-app"]})\n  
    [nft-edition-drop-template] (${configuration.templateUrls["nft-edition-drop-template"]})\n
    [next-app]                  (${configuration.templateUrls["next-app"]})\n
    [portfolio-app]             (${configuration.templateUrls["portfolio-app"]})`
  );
}

module.exports = {
  createTemplate,
  listTemplates,
};
