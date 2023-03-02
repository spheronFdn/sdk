#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require("yargs");
const randomWords = require("random-words");
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
  console.log(`Spheron CLI ${configuration.version}\n`);

  const options = yargs
    .command("login", "Logs into yout Spheron account", (yargs: any) => {
      yargs
        .option("github", {
          describe: "Login using Github credentials",
        })
        .option("gitlab", {
          describe: "Login using Gitlab credentials",
        })
        .option("bitbucket", {
          describe: "Login using Bitbucket credentials",
        })
        .version(false)
        .usage("Usage: $0 login [--github|--gitlab|--bitbucket]")
        .wrap(100)
        .help();
    })
    .command("logout", "Logs out of your account", (yargs: any) => {
      yargs.version(false).usage("Usage: $0 logout").help();
    })
    .command("upload", "Upload", (yargs: any) => {
      yargs
        .option("path", {
          describe: "Path to file",
          demandOption: false,
        })
        .option("protocol", {
          describe: "Upload protocol",
          choices: ["arweave", "ipfs-filecoin", "ipfs"],
        })
        .option("project", {
          describe: "Project name",
        })
        .option("organization", {
          describe: "Organization where project will be created",
        })
        .version(false)
        .usage(
          `Usage: $0 upload --path <file_path> --protocol [ipfs|ipfs-filecoin|arweave] [--project <project_name>] [--organization <org_name>]`
        )
        .wrap(100)
        .help();
    })
    .command(
      "publish",
      "Upload your project setup in spheron.json",
      (yargs: any) => {
        yargs.version(false).usage(`Usage: $0 publish`).help();
      }
    )
    .command(
      "create-configuration",
      "Create spheron config file",
      (yargs: any) => {
        yargs.version(false);
      }
    )
    .command("create-organization", "Create organization", (yargs: any) => {
      yargs
        .option("name", {
          describe: "Name of the organization",
        })
        .option("username", {
          describe: "Username of the organization",
        })
        .version(false)
        .usage(
          `Usage: $0 create-organization --name <organization_name> --username <username>`
        )
        .wrap(100)
        .help();
    })
    .command("init", "Spheron file initialization in project", (yargs: any) => {
      yargs.option("protocol", {
        describe: "Protocol that will be used for uploading ",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
      });
      yargs.option("project", {
        describe: "Project name",
      });
      yargs
        .option("path", {
          describe: "Path to uploading content",
        })
        .version(false)
        .usage(
          `Usage: $0 init --protocol <protocol> [--project <project_name>] [--path <path>]`
        )
        .wrap(100)
        .help();
    })
    .command(
      "create-app",
      "Create a template application which can run on Spheron out of the box",
      (yargs: any) => {
        yargs.version(false);
      }
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
    const validOptions = ["path", "protocol", "project", "organization"];
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
        projectName = options.project;
      } else {
        const prompt = await promptForUploadFile();
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
    const validOptions = ["protocol", "project", "path"];
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
        let project, protocol, path;
        if (options.protocol) {
          project = options.project;
          protocol = options.protocol;
          path = options.path;
        } else {
          const prompt = await promptForInit();
          project = prompt.project;
          protocol = prompt.protocol;
          path = prompt.path;
        }
        if (!project) {
          project = `${randomWords()}-${randomWords()}`;
        }
        if (!path) {
          path = "./";
        }
        await init(project, protocol, path);
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
