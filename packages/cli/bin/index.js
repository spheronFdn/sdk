#! /usr/bin/env node
const yargs = require("yargs");
const { upload } = require("./upload");
const { login } = require("./login");
const { initialize } = require("./initialize");
const { createOrganization } = require("./create-organization");
const { listTemplates, createTemplate } = require("./create-template");
const { configuration } = require("./configuration");

const options = yargs
  .usage("Usage: $0 --init, --login, --upload --create-organization")
  .option("login", {
    describe: "Login to the system",
    type: "boolean",
    demandOption: false,
  })
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
  .command("upload", "Upload file to the system")
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

if (options._[0] === "upload") {
  upload();
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
