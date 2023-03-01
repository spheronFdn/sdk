#! /usr/bin/env node
const yargs = require("yargs");
var randomWords = require("random-words");
import { createSpinner } from "nanospinner";

import { upload } from "./commands/upload";
import { login } from "./commands/login";
import { createConfiguration } from "./commands/create-configuration";
import { createOrganization } from "./commands/create-organization";
import { init } from "./commands/init";
import { publish } from "./commands/publish";
import {
  promptForCreateOrganization,
  promptForInit,
  promptForLogin,
  promptForUploadFile,
  promptForCreateApp,
} from "./prompts/prompts";
import configuration from "./configuration";
import { FileTypeEnum, getFileType, readFromJsonFile } from "./utils";
import { logout } from "./commands/logout";

(async () => {
  console.log(`Spheron CLI ${configuration.version}`);

  const options = yargs
    .usage(
      "Usage: $0 init, create-app, login, upload, publish, create-organization"
    )
    .command("login", "Logs into yout Spheron account", (yargs: any) => {
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
    .command("logout", "Logs out of your account")
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
        .option("projectname", {
          describe: "Project name",
          type: "string",
        })
        .option("organization", {
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
      yargs.option("path", {
        describe: "Path to uploading content",
        type: "string",
        demandOption: false,
      });
    })
    .command(
      "create-app",
      "Create a template application which can run on Spheron out of the box"
    ).argv;

  // HANDLERS - if options that are mandatory are not passed open up prompter

  if (options._[0] === "login") {
    const validOptions = ["github", "gitlab", "bitbucket"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      if (options.github) {
        await login("github");
      } else if (options.gitlab) {
        await login("gitlab");
      } else if (options.bitbucket) {
        await login("bitbucket");
      } else {
        const { provider } = await promptForLogin();
        await login(provider);
      }
    })();
  }

  if (options._[0] === "logout") {
    (async () => {
      await logout();
    })();
  }

  if (options._[0] === "upload") {
    const validOptions = ["path", "protocol", "projectname", "organization"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      let path, protocol, organizationId, projectName;
      if (options.path && options.protocol) {
        path = options.path;
        protocol = options.protocol;
        organizationId = options.organization;
        projectName = options.projectname;
      } else {
        let prompt = await promptForUploadFile();
        path = prompt.path;
        protocol = prompt.protocol;
        organizationId = prompt.organizationId;
        projectName = prompt.projectName;
      }
      if (!projectName) {
        projectName = `${randomWords()}-${randomWords()}`;
        console.log(`Generated default project name: ${projectName}`);
      }
      if (!organizationId) {
        organizationId = await readFromJsonFile(
          "organization",
          configuration.configFilePath
        );
      }
      if (!path) {
        path = "./";
      }
      const fileType: FileTypeEnum = await getFileType(path);
      const spinner = createSpinner(`Uploading ${fileType} `).start();
      try {
        await upload(path, protocol, organizationId, projectName);
      } catch (error) {
        spinner.error();
        process.exit(1);
      }
      spinner.success();
    })();
  }

  if (options._[0] === "publish") {
    (async () => {
      const spinner = createSpinner(`Publish `).start();
      try {
        await publish();
      } catch (error) {
        spinner.error();
        process.exit(1);
      }
      spinner.success();
    })();
  }

  if (options._[0] === "create-configuration") {
    (async () => {
      createConfiguration();
    })();
  }

  if (options._[0] === "create-organization") {
    const validOptions = ["name", "username"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      try {
        let name, username;
        if (options.name && options.username) {
          name = options.name;
          username = options.username;
        } else {
          const prompt = await promptForCreateOrganization();
          name = prompt.name;
          username = prompt.username;
        }
        if (!name) {
          throw new Error("Please insert a name for organization.");
        }
        if (!username) {
          throw new Error("Please insert username for organization.");
        }
        const spinner = createSpinner(
          `Creating organization name: ${name}, username: ${username} `
        ).start();
        console.log("");

        try {
          await createOrganization(name, username, "app");
        } catch (error) {
          spinner.error();
          process.exit(1);
        }
        spinner.success();
      } catch (error) {
        console.log(error.message);
        process.exit(1);
      }
    })();
  }

  if (options._[0] === "init") {
    const validOptions = ["protocol", "name", "path"];
    const unknownOptions = Object.keys(options).filter(
      (option) =>
        option !== "_" && option !== "$0" && !validOptions.includes(option)
    );
    if (unknownOptions.length > 0) {
      console.log(`Unrecognized options: ${unknownOptions.join(", ")}`);
      process.exit(1);
    }
    (async () => {
      try {
        let name, protocol, path;
        if (options.protocol) {
          name = options.name;
          protocol = options.protocol;
          path = options.path;
        } else {
          const prompt = await promptForInit();
          name = prompt.name;
          protocol = prompt.protocol;
          path = prompt.path;
        }
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
})();
