#! /usr/bin/env node
const yargs = require("yargs");
var randomWords = require("random-words");

import { uploadDir, uploadFile } from "./upload";
import { login } from "./login";
import { createConfiguration } from "./create-configuration";
import { createOrganization } from "./create-organization";
import { listTemplates, createApp } from "./create-app";
import { init } from "./init";
import { publish } from "./publish";

import configuration from "./configuration";

const options = yargs
  .usage(
    "Usage: $0 init, login, create-organization, create-app, upload-dir, upload-file"
  )
  .command("login", "Login to the system", (yargs: any) => {
    yargs
      .option("github", {
        describe: "Login using Github credentials",
        type: "boolean",
        demandOption: false,
      })
      .option("gitlab", {
        describe: "Login using Gitlab credentials",
        type: "boolean",
        demandOption: false,
      })
      .option("bitbucket", {
        describe: "Login using Bitbucket credentials",
        type: "boolean",
        demandOption: false,
      });
  })
  .command("upload-dir", "Upload dir", (yargs: any) => {
    yargs
      .option("path", {
        describe: "Path to directory",
        type: "string",
        demandOption: false,
      })
      .option("protocol", {
        describe: "Upload protocol",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
        demandOption: true,
      })
      .option("project-name", {
        describe: "Project name",
        type: "string",
        demandOption: false,
      })
      .option("organizationId", {
        describe: "Organization where project will be created",
        type: "string",
        demandOption: false,
      });
  })
  .command("upload-file", "Upload file", (yargs: any) => {
    yargs
      .option("path", {
        describe: "Path to directory",
        type: "string",
        demandOption: true,
      })
      .option("protocol", {
        describe: "Upload protocol",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
        demandOption: true,
      })
      .option("project-name", {
        describe: "Project name",
        type: "string",
        demandOption: false,
      })
      .option("organizationId", {
        describe: "Organization where project will be created",
        type: "string",
        demandOption: false,
      });
  })
  .command("publish", "Upload your project setup in spheron.json")
  .command("create-configuration", "Create spheron config file")
  .command("create-organization", "Create organization", (yargs: any) => {
    yargs
      .option("name", {
        describe: "Name of the organization",
        type: "string",
        demandOption: true,
      })
      .option("username", {
        describe: "Username of the organization",
        type: "string",
        demandOption: true,
      });
  })
  .command("init", "Spheron file initialization in project", (yargs: any) => {
    yargs.option("protocol", {
      describe: "Protocol that will be used for uploading ",
      type: "string",
      demandOption: true,
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
    "Create a template application which can run on Spheron out of the box",
    (yargs: any) => {
      yargs
        .option("list", {
          describe: "List all possible templates that user can create",
          type: "boolean",
          demandOption: false,
        })
        .option("react-app", {
          describe: "Create a react app template",
          type: "boolean",
          demandOption: false,
        })
        .option("nft-edition-drop-template", {
          describe: "Create a nft edition drop app template",
          type: "boolean",
          demandOption: false,
        })
        .option("next-app", {
          describe: "Create a next app template",
          type: "boolean",
          demandOption: false,
        })
        .option("portfolio-app", {
          describe: "Create a porftoflio app template",
          type: "boolean",
          demandOption: false,
        })
        .option("project-name", {
          describe: "Project name",
          type: "string",
          demandOption:
            yargs.argv["react-app"] ||
            yargs.argv["nft-edition-drop-template"] ||
            yargs.argv["next-app"] ||
            yargs.argv["portfolio-app"],
        });
    }
  ).argv;

// IMPLEMENTED HANDLERS

if (options._[0] === "login") {
  if (!options.github && !options.gitlab && !options.bitbucket) {
    console.error(
      "Error: you must pass either --github, --gitlab, or --bitbucket when using --login"
    );
    process.exit(1);
  }
  if (options.github) {
    login("github");
  } else if (options.gitlab) {
    login("gitlab");
  } else if (options.bitbucket) {
    login("bitbucket");
  }
}

if (options._[0] === "upload-dir") {
  try {
    const protocol = options["protocol"];
    let projectName = options["project-name"];
    const organizationId = options["organizationId"];
    if (!projectName) {
      projectName = `${randomWords()}-${randomWords()}`;
    }
    let path = options["path"];
    if (!path) {
      path = "./";
    }
    uploadDir(path, protocol, organizationId, projectName);
  } catch (error) {
    console.log(error.message);
  }
}

if (options._[0] === "upload-file") {
  try {
    const protocol = options["protocol"];
    let projectName = options["project-name"];
    const organizationId = options["organizationId"];
    if (!projectName) {
      projectName = `${randomWords()}-${randomWords()}`;
    }
    let path = options["path"];
    uploadFile(path, protocol, organizationId, projectName);
  } catch (error) {
    console.log(error.message);
  }
}

if (options._[0] === "publish") {
  publish();
}

if (options._[0] === "create-configuration") {
  createConfiguration();
}

if (options._[0] === "init") {
  const name = options["name"];
  const protocol = options["protocol"];
  const path = options["rootPath"];
  init(name, protocol, path);
}

if (options._[0] === "create-organization") {
  const organizationName = options["name"];
  const username = options["username"];
  createOrganization(organizationName, username, "app");
}

if (options._[0] === "create-app") {
  if (options.list) {
    listTemplates();
    process.exit(0);
  } else if (options["react-app"]) {
    createApp(configuration.templateUrls["react-app"], options["project-name"]);
  } else if (options["nft-edition-drop-template"]) {
    createApp(
      configuration.templateUrls["nft-edition-drop-template"],
      options["project-name"]
    );
  } else if (options["next-app"]) {
    createApp(configuration.templateUrls["next-app"], options["project-name"]);
  } else if (options["portfolio-app"]) {
    createApp(
      configuration.templateUrls["portfolio-app"],
      options["project-name"]
    );
  } else {
    console.log("Command not recognized. Use --help get more information.");
    process.exit(0);
  }
}

if (!options._[0]) {
  console.log("Run spheron --help to find out what commands you can use");
  process.exit(0);
}
