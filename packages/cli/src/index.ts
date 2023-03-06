#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
// require = require("esm")(module); //allows require of modules that are ES6
const yargs = require("yargs");
import configuration from "./configuration";
import { commandHandler } from "./command-handler";
import { FrameworkOptions } from "./commands/init";

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
          describe: "Relative path to file",
          demandOption: false,
        })
        .option("protocol", {
          describe: "Upload protocol",
          choices: ["Arweave", "Filecoin", "IPFS"],
        })
        .option("project", {
          describe: "Project name",
        })
        .option("organization", {
          describe: "Organization where project will be created",
        })
        .version(false)
        .usage(
          `Usage: $0 upload --path <file_path> --protocol [Arweave| Filecoin| IPFS] [--project <project_name>] [--organization <org_name>]`
        )
        .wrap(100)
        .help();
    })
    .command(
      "publish",
      "Upload your project setup in spheron.json",
      (yargs: any) => {
        yargs
          .version(false)
          .usage(`Usage: $0 publish [--organization <organizationId>]`)
          .help();
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
      yargs
        .option("protocol", {
          describe: "Protocol that will be used for uploading ",
          choices: ["Arweave", "Filecoin", "IPFS"],
        })
        .option("project", {
          describe: "Project name",
        })
        .option("path", {
          describe: "Relative path to uploading content",
        })
        .option("framework", {
          describe: "Framework choice for the project",
          choices: Object.values(FrameworkOptions),
          default: "static",
        })
        .version(false)
        .usage(
          `Usage: $0 init --protocol <protocol> [--project <project_name>] [--path <path>] [--framework <framework>]`
        )
        .wrap(150)
        .help();
    })
    .command(
      "create-dapp",
      "Create a template application which can run on Spheron out of the box",
      (yargs: any) => {
        yargs
          .version(false)
          .usage(`Usage: $0 create-dapp <name>`)
          .wrap(100)
          .help();
      }
    ).argv;

  await commandHandler(options);
})();
