#! /usr/bin/env node
const yargs = require("yargs");
const { upload } = require("./upload");
const { login } = require("./login");

const options = yargs
  .usage("Usage: $0 --init, --login, --upload")
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
  .help(true).argv;

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
    login("bitubcket");
  }
}

if (options.upload) {
  console.log(upload);
  upload();
}
