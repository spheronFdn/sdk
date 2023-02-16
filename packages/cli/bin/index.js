#! /usr/bin/env node
const yargs = require("yargs");
var randomWords = require("random-words");

const { uploadDir, uploadFile } = require("./upload");
const { login } = require("./login");
const { initialize } = require("./initialize");
const { createOrganization } = require("./create-organization");
const { listTemplates, createTemplate } = require("./create-template");
const { createWorkspace } = require("./create-workspace");
const { configuration } = require("./configuration");

const options = yargs
  .usage("Usage: $0 init, login, create-organization, create-template, upload-dir, upload-file")
  .command("login", "Login to the system", (yargs) => {
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
  .command("upload-dir", "Upload dir", (yargs) => {
    yargs
      .option("directory", {
        describe: "Directory",
        type: "string",
        demandOption: true,
      })
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
  .command("upload-file", "Upload file", (yargs) => {
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
  .command("init", "Create spheron config file")
  .command("create-organization", "Create organization", (yargs) => {
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
  .command("create-workspace", "Create workspace", (yargs) => {
    yargs
      .option("name", {
        describe: "Workspace name",
        type: "string",
        demandOption: true,
      })
  })
  .command(
    "create-template",
    "Create a template application which runs on Spheron",
    (yargs) => {
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
    const directory = options["directory"];
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
    uploadDir(directory, path, protocol, organizationId, projectName);
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

if (options._[0] === "init") {
  initialize();
}

if (options._[0] === "create-organization") {
  const organizationName = options["name"];
  const username = options["username"];
  createOrganization(organizationName, username, "app");
}

if (options._[0] === "create-template") {
  if (options.list) {
    listTemplates();
    return;
  } else if (options["react-app"]) {
    createTemplate(
      configuration.templateUrls["react-app"],
      options["project-name"]
    );
  } else if (options["nft-edition-drop-template"]) {
    createTemplate(
      configuration.templateUrls["nft-edition-drop-template"],
      options["project-name"]
    );
  } else if (options["next-app"]) {
    createTemplate(
      configuration.templateUrls["next-app"],
      options["project-name"]
    );
  } else if (options["portfolio-app"]) {
    createTemplate(
      configuration.templateUrls["portfolio-app"],
      options["project-name"]
    );
  }
}
if(options._[0] === "create-workspace"){
  createWorkspace(options["name"]);
}
