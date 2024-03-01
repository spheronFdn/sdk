#! /usr/bin/env node
import yargs from "yargs";
import configuration from "./configuration";
import { commandHandler } from "./command-handler";
import { ComputeCommandEnum } from "./commands/compute/interfaces";
import { GlobalCommandEnum } from "./commands/interfaces";

(async () => {
  console.log(`Spheron CLI ${configuration.version}\n`);

  const options = yargs
    .command(
      GlobalCommandEnum.LOGIN,
      "Log in to your Spheron account — Enter your credentials when prompted.",
      (yargs: any) => {
        yargs
          .option("github", {
            describe: "Log in using Github credentials.",
          })
          .option("gitlab", {
            describe: "Log in using Gitlab credentials.",
          })
          .option("bitbucket", {
            describe: "Log in using Bitbucket credentials.",
          })
          .option("token", {
            describe: "Log in by copying the api token from the platform.",
          })
          .version(false)
          .usage("Usage: $0 login [--github|--gitlab|--bitbucket|--token]")
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      GlobalCommandEnum.LOGOUT,
      "Log out of your account — Ends your current session.",
      (yargs: any) => {
        yargs
          .version(false)
          .usage("Usage: $0 logout")
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.CREATE_ORGANIZATION,
      "Create a new organization — Follow the prompts to specify organization.",
      (yargs: any) => {
        yargs
          .option("name", {
            describe: "Name of the organization.",
          })
          .version(false)
          .usage(`Usage: $0 create-organization --name <ORG NAME>`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.SWITCH_ORGANIZATION,
      "Switch your active organization — Select from available organizations when prompted.",
      (yargs: any) => {
        yargs
          .option("organization", {
            describe: "Set name of your organization.",
          })
          .version(false)
          .usage(`Usage: $0 switch-organization [--organization <ORG ID>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.INIT,
      "Initialize deployment configuration — Creates a Spheron configuration file in your project directory.",
      (yargs: any) => {
        yargs
          .option("import", {
            describe: "Set relative path to docker compose file.",
          })
          .option("dockerFile", {
            describe: "Set relative path to dockerfile.",
          })
          .option("marketplace", {
            describe: "Set marketplace app ID.",
          })
          .version(false)
          .usage(
            `Usage: $0 init [--import <DOCKER COMPOSE PATH>] [--dockerFile <DOCKERFILE PATH>] [--marketplace <APP ID>]`
          )
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.DEPLOY,
      "Deploy your instance — Uses the spheron.yaml file to launch your instance.",
      (yargs: any) => {
        yargs
          .option("config", {
            describe: "Set relative path to spheron.yaml file",
          })
          .version(false)
          .usage(`Usage: $0 publish [--config <PATH_TO_CONFIG>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.BUILD,
      "Build and push Docker image — Compiles an image from spheron.yaml and uploads it to Docker Hub.",
      (yargs: any) => {
        yargs
          .option("config", {
            describe: "Set relative path to spheron.yaml file",
          })
          .option("u", {
            describe: "Set dockerhub username",
          })
          .option("p", {
            describe: "Set dockerhub password",
          })
          .version(false)
          .usage(
            `Usage: $0 build [--config <PATH TO CONFIG>] [-u <DOCKERHUB USERNAME>] [-p <DOCKERHUB PASSWORD>]`
          )
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.UPDATE,
      "Update instance settings — Modifies configuration based on spheron.yaml.",
      (yargs: any) => {
        yargs
          .option("config", {
            describe: "Set relative path to spheron.yaml file",
            demandOption: false,
          })
          .option("instance", {
            describe: "Set instance ID",
          })
          .version(false)
          .usage(
            `Usage: $0 update [--config <PATH TO CONFIG>] [--instance <INSTANCE ID>]`
          )
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.CLOSE,
      "Terminate the instance — Shuts down the specified active instance.",
      (yargs: any) => {
        yargs
          .option("instance", {
            describe: "Set instance ID",
          })
          .version(false)
          .usage(`Usage: $0 close [--id <INSTANCE ID>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    // .command(
    //   ComputeCommandEnum.SHELL,
    //   "Execute shell command inside of instance",
    //   (yargs: any) => {
    //     yargs
    //       .option("instanceId", {
    //         describe: "Instance id",
    //       })
    //       .option("command", {
    //         describe: "shell command",
    //       })
    //       .version(false)
    //       .usage(
    //         `Usage: $0 compute shell --instanceId <instanceId> --command 'ls -a'`
    //       )
    //       .wrap(150)
    //       .help();
    //   }
    // )
    // .command(
    //   ComputeCommandEnum.VALIDATE,
    //   "Validate spheron configuration (or some other spheron compute configuration file)",
    //   (yargs: any) => {
    //     yargs
    //       .option("config", {
    //         describe: "Relative path to config file",
    //         demandOption: false,
    //       })
    //       .version(false)
    //       .usage(`Usage: $0 compute validate [--config <file_path>]`)
    //       .wrap(150)
    //       .help();
    //   }
    // )
    .command(
      ComputeCommandEnum.MARKETPLACE_APPS,
      "List all marketplace apps — Displays available apps in the Spheron marketplace.",
      (yargs: any) => {
        yargs
          .option("category", {
            describe: "Set category of the marketplace",
            demandOption: false,
          })
          .version(false)
          .usage(`Usage: $0 marketplace-apps [--category <CATEGORY>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.INSTANCES,
      "List project instances — Displays all instances within a specified project.",
      (yargs: any) => {
        yargs
          .option("project", {
            describe: "Set project ID",
            demandOption: false,
          })
          .version(false)
          .usage(`Usage: $0 instances [--project <PROJECT NAME>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.INSTANCE,
      "Fetch instance and service details — Provides information on an instance and its associated services.",
      (yargs: any) => {
        yargs
          .option("id", {
            describe: "Set instance ID",
            demandOption: false,
          })
          .version(false)
          .usage(`Usage: $0 instance [--id <INSTANCE ID>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.SERVICE,
      "Get service details within an instance — Shows information for services in a specific instance.",
      (yargs: any) => {
        yargs
          .option("id", {
            describe: "Set instance ID",
            demandOption: false,
          })
          .option("name", {
            describe: "Set service name",
            demandOption: false,
          })
          .version(false)
          .usage(
            `Usage: $0 service [--instance <INSTANCE ID>] [--name <SERVICE NAME>]`
          )
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.PLANS,
      "List available plans — Displays all plans offered by Spheron.",
      (yargs: any) => {
        yargs
          .option("region", {
            describe: "Set region name",
            demandOption: false,
          })
          .version(false)
          .usage(`Usage: $0 plans [--region <REGION>]`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.REGIONS,
      "Show available regions — Displays all regions where services can be deployed.",
      (yargs: any) => {
        yargs
          .version(false)
          .usage(`Usage: $0 regions`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.PROJECTS,
      "Retrieve project and instance information — Shows details of the project along with its instances.",
      (yargs: any) => {
        yargs
          .version(false)
          .usage(`Usage: $0 projects`)
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .command(
      ComputeCommandEnum.LOGS,
      "Fetch service logs — Retrieves all logs for a specific service within an instance.",
      (yargs: any) => {
        yargs
          .option("instance", {
            describe: "Set instance ID",
            demandOption: false,
          })
          .option("service", {
            describe: "Set service name",
            demandOption: false,
          })
          .version(false)
          .usage(
            `Usage: $0 logs [--instance <INSTANCE ID>] [--name <SERVICE NAME>]`
          )
          .wrap(yargs.terminalWidth() * 0.8)
          .help();
      }
    )
    .wrap(yargs.terminalWidth() * 0.8).argv;

  await commandHandler(options);
})();
