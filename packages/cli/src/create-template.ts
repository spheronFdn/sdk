import child_process from "child_process";
import path from "path";

import configuration from "./configuration";

export async function createTemplate(templateUrl: string, folderName: string) {
  let executionError = false;
  try {
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

function executeCloneOfRepo(sourceUrl: string, folderName: string) {
  return new Promise((resolve) => {
    const child = child_process.spawn(
      "sh",
      [path.join(__dirname, "./scripts/clone.sh")],
      {
        shell: true,
        env: {
          SOURCE_URL: sourceUrl,
          FOLDER_NAME: folderName,
        },
      }
    );
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

export async function listTemplates() {
  console.log(
    `Supported templates: \n ------------------ \n 
    [react-app]                 (${configuration.templateUrls["react-app"]})\n  
    [nft-edition-drop-template] (${configuration.templateUrls["nft-edition-drop-template"]})\n
    [next-app]                  (${configuration.templateUrls["next-app"]})\n
    [portfolio-app]             (${configuration.templateUrls["portfolio-app"]})`
  );
}