#! /usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require("yargs");
import { DeploymentStatusEnum, ProjectStateEnum } from "@spheron/core";
import configuration from "./configuration";
import { commandHandler } from "./command-handler";
import { FrameworkOptions } from "./commands/site/init";
import {
  ComputeResourceEnum,
  SiteResourceEnum,
} from "./commands/get-resources";
import { GptCommandEnum } from "./commands/gpt/gpt";
import {
  ComputeCommandEnum,
  ComputeInstanceType,
} from "./commands/compute/interfaces";
import { SiteCommandEnum } from "./commands/site/interfaces";
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
    .command("site <command>", "Site related commands", (yargs: any) => {
      yargs
        .command(SiteCommandEnum.UPLOAD, "Upload", (yargs: any) => {
          yargs
            .option("path", {
              describe: "Relative path to file",
              demandOption: false,
            })
            .option("protocol", {
              describe: "Upload protocol",
              choices: ["arweave", "filecoin", "ipfs"],
            })
            .option("bucket", {
              describe: "Bucket name",
            })
            .option("organization", {
              describe: "Organization where project will be created",
            })
            .version(false)
            .usage(
              `Usage: $0 site upload --path <file_path> --protocol [arweave| filecoin| ipfs] [--bucket <bucket_name>] [--organization <organizationId>]`
            )
            .wrap(100)
            .help();
        })
        .command(
          SiteCommandEnum.PUBLISH,
          "Upload your project setup in spheron.json",
          (yargs: any) => {
            yargs
              .option("organization", {
                describe: "Organization ID",
              })
              .version(false)
              .usage(
                `Usage: $0 site publish [--organizationId <organizationId>]`
              )
              .help();
          }
        )
        .command(
          SiteCommandEnum.CREATE_ORGANIZATION,
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
                `Usage: $0 site create-organization --name <organization_name> --username <username>`
              )
              .wrap(100)
              .help();
          }
        )
        .command(
          `${SiteCommandEnum.GET} <resource>`,
          "Get resource/s <<resource>>",
          (yargs: any) => {
            yargs.positional("resource", {
              describe: "The resource to get information about",
              choices: Object.values(SiteResourceEnum),
            });
            yargs.version(false).wrap(150).help();
            yargs.epilogue(`Custom help text for 'get <resource>' command.
  
        Examples:
          - get organization            : options: --id 
          - get organizations           : (all organization for your user will be returned)
          - get deployment              : options: --id
          - get deployments             : options: --projectId, --skip (optional), --limit (optional), --status (optional)  
          - get project                 : options: --id
          - get projects                : options: --organizationId (optional), --skip (optional), --limit (optional), --state (optional)
          - get domains                 : options: --projectId
          - get deployment-environments : options: --projectId
          Note* : 
          deployment status field can be ${Object.values(DeploymentStatusEnum)}
          project state field can be ${Object.values(ProjectStateEnum)} 
        `);
          }
        )
        .command(
          SiteCommandEnum.INIT,
          "Spheron file initialization in project",
          (yargs: any) => {
            yargs
              .option("protocol", {
                describe: "Protocol that will be used for uploading ",
                choices: ["arweave", "filecoin", "ipfs"],
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
                `Usage: $0 site  init --protocol <protocol> [--project <project_name>] [--path <path>] [--framework <framework>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          SiteCommandEnum.SWITCH_ORGANIZATION,
          "Change site default configuration",
          (yargs: any) => {
            yargs
              .option("organization", {
                describe: "Set id of default organization ",
              })
              .version(false)
              .usage(
                `Usage: $0 site switch-organization [--organization <organizationId>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          SiteCommandEnum.CREATE_DAPP,
          "Create a dapp which can run on Spheron out of the box",
          (yargs: any) => {
            yargs
              .version(false)
              .usage(`Usage: $0 site create-dapp <name>`)
              .wrap(100)
              .help();
          }
        );
    })
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
              .version(false)
              .usage(`Usage: $0 compute init`)
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.PUBLISH,
          "Deploy instance defined in spheron.yaml",
          (yargs: any) => {
            yargs
              .option("organizationId", {
                describe: "Organization ID",
              })
              .version(false)
              .usage(`Usage: $0 publish [--organizationId <organizationId>]`)
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.VALIDATE,
          "Validate spheron.yaml (or some other spheron compute configuration file)",
          (yargs: any) => {
            yargs
              .option("path", {
                describe: "Relative path to file",
                demandOption: false,
              })
              .version(false)
              .usage(`Usage: $0 publish [--filepath <file_path>]`)
              .wrap(150)
              .help();
          }
        )
        .command(
          ComputeCommandEnum.DIRECT_DEPLOY,
          "Spheron direct deployment of docker container",
          (yargs: any) => {
            yargs
              .option("cluster-name", {
                describe:
                  "Name of cluster where instance will reside (will be created if it doesnt exist) ",
              })
              .option("instance-name", {
                describe: "Alias for instance",
              })
              .option("image", {
                describe: "Docker image name",
              })
              .option("tag", {
                describe: "Docker image tag",
                // choices: Object.values(FrameworkOptions),
              })
              .option("replicas", {
                describe: "Number of replicas for this service",
              })
              .option("region", {
                describe: "Region where instance will be deployed",
              })
              .option("plan", {
                describe: "Plan name (fetch plans to see possible values)",
                choices: Object.values(FrameworkOptions),
              })
              .option("ports", {
                describe:
                  "Port mapping in containerPort:exposedPort pairs ex: 8080:80, 8081:random",
              })
              .option("env-var", {
                describe:
                  "Env variable (can be called multiple times) NAME=VALUE ",
              })
              .option("env-var-secret", {
                describe:
                  "Secret env variable (can be called multiple times) NAME=VALUE ",
              })
              .option("type", {
                describe: "Instance type",
                choices: Object.values(ComputeInstanceType),
              })
              .version(false)
              .usage(
                `Usage: $0 site  init --cluster-name <protocol> [--project <project_name>] [--path <path>] [--framework <framework>]`
              )
              .wrap(150)
              .help();
          }
        )
        .command(
          `${ComputeCommandEnum.GET} <resource>`,
          "Get resource/s <<resource>>",
          (yargs: any) => {
            yargs.positional("resource", {
              describe: "The resource to get information about",
              choices: Object.values(ComputeResourceEnum),
            });
            yargs.version(false).wrap(150).help();
            yargs.epilogue(`Custom help text for 'get <resource>' command.
  
        Examples:
          - get organization            : options: --id 
          - get organizations           : (all organization for your user will be returned)
          - get plans                   : options: --name
          - get regions                   
          - get clusters                : options: --organizationId
          - get instance                : options: --id  
          - get instances               : options: --clusterId
        `);
          }
        );
    })
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
