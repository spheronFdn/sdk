#! /usr/bin/env node
const yargs = require("yargs");
const { upload } = require("./upload");
const { login } = require("./login");

const options = yargs
  .usage("Usage: $0 --login or --upload")
  .option("login", {
    describe: "Login to the system",
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
  login();
}

if (options.upload) {
  console.log(upload);
  upload();
}
