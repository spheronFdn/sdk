#! /usr/bin/env node
const yargs = require("yargs");
const { upload } = require("./upload");
const { login } = require("./login");
const { initialize } = require("./initialize");
const { createOrganization } = require("./create-organization");

const { option } = require("yargs");

const options = yargs
  .usage("Usage: $0 --init, --login, --upload --create-organization")
  .option("login", {
    describe: "Login to the system",
    type: "boolean",
    demandOption: false,
  })
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
  })
  .option("upload", {
    describe: "Upload file to the system",
    type: "boolean",
    demandOption: false,
  })
  .option("init", {
    describe: "Create spheron config file",
    type: "boolean",
    demandOption: false,
  })
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
  }).argv;

if (options.login) {
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

if (options.upload) {
  console.log(upload);
  upload();
}

if (options.init) {
  initialize();
}

if (options._[0] === "create-organization") {
  const organizationName = options["name"];
  const username = options["username"];
  createOrganization(organizationName, username, "app");
}
