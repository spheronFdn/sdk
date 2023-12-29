#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require("yargs");
import configuration from "./configuration";
import { commandHandler } from "./command-handler";
import { GptCommandEnum } from "./commands/gpt/gpt";
import { ComputeCommandEnum } from "./commands/compute/interfaces";
import { GlobalCommandEnum } from "./commands/interfaces";

(async () => {
  console.log(`Spheron CLI ${configuration.version}\n`);

  const options = yargs
    .command(
      GlobalCommandEnum.LOGIN,
      "Logs into yout Spheron account",
      (yargs: any) => {
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
      }
    )
    .command(
      GlobalCommandEnum.LOGOUT,
      "Logs out of your account",
      (yargs: any) => {
        yargs.version(false).usage("Usage: $0 logout").help();
      }
    )
    .command("compute <command>", "Compute related commands", (yargs: any) => {
      yargs
        .command(
          ComputeCommandEnum.CREATE_ORGANIZATION,
          "Create organization",
          (yargs: any) => {
            yargs
              .option("name", {
                describe: "Name of the organization",
              })
              .option("username", {
                describe: "Username of the organization",
              })
              .version(false)
              .usage(
                `Usage: $0 compute create-organization --name <organization_name> --username <username>`
              )
              .wrap(100)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.SWITCH_ORGANIZATION,
          "Change compute default configuration",
          (yargs: any) => {
            yargs
              .option("organization", {
                describe: "Set id of default organization ",
              })
              .version(false)
              .usage(
                `Usage: $0 compute switch-organization [--organization <organizationId>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.INIT,
          "Create initial spheron compute configuration file",
          (yargs: any) => {
            yargs
              .option("organization", {
                describe: "Set id of default organization ",
              })
              .option("dockerfile", {
                describe:
                  "Set relative path to dockerfile if building from local",
              })
              .option("tag", {
                describe: "Docker image tag",
              })
              .option("dockerhubRepository", {
                describe: "Dockerhub repository ex: user/redis",
              })
              .option("template", {
                describe: "Set template id ",
              })
              .version(false)
              .usage(
                `Usage: $0 compute init [--dockerfile <path>] [--tag <tag>] [--templateId <id>] [--dockerhubRepository <repo>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.DEPLOY,
          "Deploy instance defined in spheron.yaml",
          (yargs: any) => {
            yargs
              .option("organizationId", {
                describe: "Organization ID",
              })
              .option("config", {
                describe: "Relative path to config file",
              })
              .version(false)
              .usage(
                `Usage: $0 compute publish [--organizationId <organizationId>] [--config <path_to_config>] [--dockerhub <profile_name>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.BUILD,
          "Build docker image from spheron.yaml and push it to dockerhub",
          (yargs: any) => {
            yargs
              .option("config", {
                describe: "Relative path to config file",
              })
              .option("u", {
                describe: "Dockerhub username",
              })
              .option("p", {
                describe: "Dockerhub password",
              })
              .version(false)
              .usage(
                `Usage: $0 compute build [--config <path_to_config>] [-u <dockerhub_username>] [-p <dockerhub_password>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.UPDATE,
          "Update instance configuration",
          (yargs: any) => {
            yargs
              .option("config", {
                describe: "Relative path to config file",
                demandOption: false,
              })
              .option("organizationId", {
                describe: "organization ID",
              })
              .option("instanceId", {
                describe: "Instance id",
              })
              .version(false)
              .usage(
                `Usage: $0 compute update --config <config_path> [--instanceId <instanceId>] [--organizationId <orgId>] `
              )

              .wrap(150)
              .help();
          }
        )
        .command(ComputeCommandEnum.CLOSE, "Close instance", (yargs: any) => {
          yargs
            .option("config", {
              describe: "Relative path to config file",
              demandOption: false,
            })
            .option("id", {
              describe: "Instance id",
            })
            .version(false)
            .usage(
              `Usage: $0 compute close --config <config_path> [--id <instanceId>] [--organizationId <orgId>] `
            )

            .wrap(150)
            .help();
        })
        .command(
          ComputeCommandEnum.SHELL,
          "Execute shell command inside of instance",
          (yargs: any) => {
            yargs
              .option("instanceId", {
                describe: "Instance id",
              })
              .option("command", {
                describe: "shell command",
              })
              .version(false)
              .usage(
                `Usage: $0 compute shell --instanceId <instanceId> --command 'ls -a'`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.VALIDATE,
          "Validate spheron configuration (or some other spheron compute configuration file)",
          (yargs: any) => {
            yargs
              .option("config", {
                describe: "Relative path to config file",
                demandOption: false,
              })
              .version(false)
              .usage(`Usage: $0 compute validate [--config <file_path>]`)
              .wrap(150)
              .help();
          }
        );
    })
    .command(
      ComputeCommandEnum.UPDATE,
      "Update instance configuration",
      (yargs: any) => {
        yargs
          .option("config", {
            describe: "Relative path to config file",
            demandOption: false,
          })
          .option("organizationId", {
            describe: "organization ID",
          })
          .option("instanceId", {
            describe: "Instance id",
          })
          .version(false)
          .usage(
            `Usage: $0 compute update --config <config_path> [--organizationId <orgId>] [--instanceId <instanceId>] `
          )
          .wrap(150)
          .help();
      }
    )
    .command("gpt <command>", "GPT related commands", (yargs: any) => {
      yargs
        .command(
          GptCommandEnum.GENERATE,
          "Generate test cases",
          (yargs: any) => {
            yargs
              .option("prompt", {
                describe: "Prompt",
                demandOption: true,
              })
              .option("filepath", {
                describe: "Path to file",
                demandOption: true,
              })
              .version(false)
              .usage(
                `Usage: $0 gpt generate --prompt <prompt> --filepath <file_path>`
              )
              .wrap(100)
              .help();
          }
        )
        .command(GptCommandEnum.UPDATE, "Update code", (yargs: any) => {
          yargs
            .option("prompt", {
              describe: "Prompt",
              demandOption: true,
            })
            .option("filepath", {
              describe: "Path to file",
            })
            .version(false)
            .usage(
              `Usage: $0 gpt update --prompt <prompt> --filepath <file_path>`
            )
            .wrap(100)
            .help();
        })
        .command(GptCommandEnum.FINDBUGS, "Debug code", (yargs: any) => {
          yargs
            .option("filepath", {
              describe: "Path to file",
              demandOption: true,
            })
            .version(false)
            .usage(`Usage: $0 gpt findbugs --filepath <file_path>`)
            .wrap(100)
            .help();
        })
        .command(GptCommandEnum.IMPROVE, "Optimise code", (yargs: any) => {
          yargs
            .option("filepath", {
              describe: "Path to file",
              demandOption: true,
            })
            .version(false)
            .usage(`Usage: $0 gpt improve --filepath <file_path>`)
            .wrap(100)
            .help();
        })
        .command(GptCommandEnum.TRANSPILE, "Transpile code", (yargs: any) => {
          yargs
            .option("filepath", {
              describe: "Path to file",
              demandOption: true,
            })
            .option("language", {
              describe: "Languag",
              demandOption: true,
            })
            .version(false)
            .usage(`Usage: $0 gpt transpile --filepath <file_path>`)
            .wrap(100)
            .help();
        })
        .command(GptCommandEnum.TEST, "Generate test cases", (yargs: any) => {
          yargs
            .option("filepath", {
              describe: "Path to file",
              demandOption: true,
            })
            .version(false)
            .usage(`Usage: $0 gpt ctc --filepath <file_path>`)
            .wrap(100)
            .help();
        });
    }).argv;

  await commandHandler(options);
})();
