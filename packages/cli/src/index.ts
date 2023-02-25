#! /usr/bin/env node
const yargs = require("yargs");
var randomWords = require("random-words");

import { uploadDir, uploadFile } from "./upload";
import { login } from "./login";
import { createConfiguration } from "./create-configuration";
import { createOrganization } from "./create-organization";
import { init } from "./init";
import { publish } from "./publish";
import {
  promptForCreateOrganization,
  promptForInit,
  promptForLogin,
  promptForUploadFile,
  promptForCreateApp,
} from "./prompts/prompts";
import configuration from "./configuration";
import {
  fileExists,
  FileTypeEnum,
  getFileType,
  readFromJsonFile,
} from "./utils";

console.log(`Spheron CLI ${configuration.version}`);

const options = yargs
  .usage(
    "Usage: $0 init, login, create-organization, create-app, upload-dir, upload-file"
  )
  .command("login", "Login to the system", (yargs: any) => {
    yargs
      .option("github", {
        describe: "Login using Github credentials",
        type: "boolean",
      })
      .option("gitlab", {
        describe: "Login using Gitlab credentials",
        type: "boolean",
      })
      .option("bitbucket", {
        describe: "Login using Bitbucket credentials",
        type: "boolean",
      });
  })
  .command("upload", "Upload", (yargs: any) => {
    yargs
      .option("path", {
        describe: "Path to file",
        type: "string",
        demandOption: false,
      })
      .option("protocol", {
        describe: "Upload protocol",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
      })
      .option("projectName", {
        describe: "Project name",
        type: "string",
      })
      .option("organizationId", {
        describe: "Organization where project will be created",
        type: "string",
      });
  })
  .command("publish", "Upload your project setup in spheron.json")
  .command("create-configuration", "Create spheron config file")
  .command("create-organization", "Create organization", (yargs: any) => {
    yargs
      .option("name", {
        describe: "Name of the organization",
        type: "string",
      })
      .option("username", {
        describe: "Username of the organization",
        type: "string",
      });
  })
  .command("init", "Spheron file initialization in project", (yargs: any) => {
    yargs.option("protocol", {
      describe: "Protocol that will be used for uploading ",
      type: "string",
      demandOption: false,
    });
    yargs.option("name", {
      describe: "Project name",
      type: "string",
      demandOption: false,
    });
    yargs.option("rootPath", {
      describe: "Path to uploading content",
      type: "string",
      demandOption: false,
    });
  })
  .command(
    "create-app",
    "Create a template application which can run on Spheron out of the box"
  ).argv;

// HANDLERS WITH INQUIRER
if (options._[0] === "login") {
  (async () => {
    const { provider } = await promptForLogin();
    await login(provider);
  })();
}

if (options._[0] === "upload") {
  (async () => {
    let { path, protocol, organizationId, projectName } =
      await promptForUploadFile();
    if (!projectName) {
      projectName = `${randomWords()}-${randomWords()}`;
    }
    if (!path) {
      path = "./";
    }
    if (!organizationId) {
      organizationId = await readFromJsonFile(
        "organization",
        configuration.configFilePath
      );
    }
    const fileType: FileTypeEnum = await getFileType(path);
    console.log(`Uploading ${fileType}`);
    if (fileType === FileTypeEnum.DIRECTORY) {
      await uploadDir(path, protocol, organizationId, projectName);
    } else if (fileType === FileTypeEnum.FILE) {
      await uploadFile(path, protocol, organizationId, projectName);
    }
  })();
}

if (options._[0] === "publish") {
  (async () => {
    publish();
  })();
}

if (options._[0] === "create-configuration") {
  (async () => {
    createConfiguration();
  })();
}

if (options._[0] === "create-organization") {
  (async () => {
    try {
      const { name, username } = await promptForCreateOrganization();
      if (!name) {
        throw new Error("Please insert a name for organization.");
      }
      if (!username) {
        throw new Error("Please insert username for organization.");
      }
      await createOrganization(name, username, "app");
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  })();
}

if (options._[0] === "init") {
  (async () => {
    try {
      let { name, protocol, path } = await promptForInit();
      if (!name) {
        name = `${randomWords()}-${randomWords()}`;
      }
      if (!path) {
        path = "./";
      }
      await init(name, protocol, path);
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  })();
}

if (options._[0] === "create-app") {
  (async () => {
    try {
      await promptForCreateApp();
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  })();
}

if (!options._[0]) {
  console.log(
    "Please use --help to check all commands available with spheron cli"
  );
}
