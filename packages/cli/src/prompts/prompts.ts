import { YesNoEnum } from "../commands/gpt/gpt";
import SpheronApiService from "../services/spheron-api";
import { MarketplaceApp, MarketplaceCategoryEnum } from "@spheron/core-testing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const inquirer = require("inquirer");

export async function promptForLogin(): Promise<any> {
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "provider",
      message: "Select your provider:",
      choices: ["Github", "Gitlab", "Bitbucket"],
    },
  ]);
  return result;
}

export async function promptForUploadFile(): Promise<any> {
  const pathSegments = process.cwd().split("/");
  const defaultProject = pathSegments[pathSegments.length - 1];
  const questions = [
    {
      type: "input",
      name: "path",
      message: "Path to file:",
      default: "./",
    },
    {
      type: "list",
      name: "protocol",
      message: "Upload protocol:",
      choices: ["Arweave", "Filecoin", "IPFS"],
    },
    {
      type: "input",
      name: "bucket",
      message: "Bucket name:",
      default: defaultProject,
    },
    {
      type: "input",
      name: "organizationId",
      message: "Organization where bucket will be created (optional):",
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptForCreateOrganization(): Promise<any> {
  const defaultName = `org-${Math.floor(Math.random() * 900) + 100}`;
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Name of the organization:",
      default: defaultName,
    },
    {
      type: "input",
      name: "username",
      message: "Username of the organization:",
      default: defaultName,
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptForSwitchOrganization(
  orgNameList: string[]
): Promise<any> {
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "organization",
      message: "Select your organization:",
      choices: orgNameList,
    },
  ]);
  return result;
}

export async function closeInstancePrompt(instanceId: string): Promise<any> {
  return inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: `Do you want to close your instance ${instanceId}?`,
      choices: [YesNoEnum.YES, YesNoEnum.NO],
      default: YesNoEnum.YES,
    },
  ]);
}

export async function promptForGPT(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "gpt",
      message: "Details about the code you wish to generate:",
    },
  ];
  return inquirer.prompt(questions);
}

export async function filePathForGPT(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "inputpath",
      message: "File path for the code you want to update:",
    },
  ];
  return inquirer.prompt(questions);
}

export async function fixBugForGPT(): Promise<any> {
  const questions = [
    {
      type: "list",
      name: "fix",
      message: "Do you want to fix this code:",
      choices: [YesNoEnum.YES, YesNoEnum.NO],
      default: YesNoEnum.YES,
    },
  ];
  return inquirer.prompt(questions);
}

export async function languageForGPT(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "lang",
      message: "Programming Language you want to transpile to:",
    },
  ];
  return inquirer.prompt(questions);
}

export async function languageForGPTTest(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "testlang",
      message: "Programming Language for creating test cases:",
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptForComputeInit(): Promise<any> {
  return inquirer
    .prompt([
      {
        type: "number",
        name: "numberOfDockerfiles",
        message: "How many Docker images do you want to specify?",
        default: 1,
        validate: function (value: any) {
          return !isNaN(parseFloat(value)) || "Please enter a number";
        },
        filter: Number,
      },
    ])
    .then(async (numberOfServicesAnswer: any) => {
      if (numberOfServicesAnswer.numberOfDockerfiles == 1) {
        return inquirer
          .prompt([
            {
              type: "list",
              name: "computeInitializationType",
              message: "Do you want to deploy from template?",
              choices: ["yes", "no"],
            },
          ])
          .then(async (templateAnswer: any) => {
            if (templateAnswer.computeInitializationType === "no") {
              return inquirer
                .prompt([
                  {
                    type: "list",
                    name: "dockerfileType",
                    message: "Do you want to deploy from local dockerfile ?",
                    choices: ["yes", "no"],
                  },
                ])
                .then(async (dockerAnswer: any) => {
                  if (dockerAnswer.dockerfileType === "no") {
                    return null;
                  } else {
                    return inquirer.prompt([
                      {
                        type: "input",
                        name: "dockerfile",
                        message: "Relative path to dockerfile:",
                        default: "./",
                      },
                      {
                        type: "input",
                        name: "tag",
                        message: "Tag to be used when building image:",
                        default: "latest",
                      },
                      {
                        type: "input",
                        name: "dockerhubRepository",
                        message: "Dockerhub repository",
                        default: "dockerprofile/image",
                      },
                    ]);
                  }
                });
            } else if (templateAnswer.computeInitializationType === "yes") {
              const pcategory = await inquirer.prompt([
                {
                  type: "list",
                  name: "category",
                  message: "Choose the category of template:",
                  choices: Object.values(MarketplaceCategoryEnum).map(
                    (option) => option.charAt(0).toUpperCase() + option.slice(1)
                  ),
                },
              ]);
              let templates: MarketplaceApp[] =
                await SpheronApiService.getMarketplaceApps();
              if (
                !Object.values(MarketplaceCategoryEnum).find(
                  (x) => x == pcategory.category
                )
              ) {
                throw new Error("Specified category does not exist");
              }
              templates = templates.filter(
                (x) => x.metadata.category == pcategory.category
              );

              const templatesDto = Array.from(templates.values()).map((t) => ({
                name: t.name,
                value: t,
              }));

              return inquirer.prompt([
                {
                  type: "list",
                  name: "template",
                  message: "Choose a template:",
                  choices: templatesDto,
                },
              ]);
            }
          });
      } else {
        const serviceCount = numberOfServicesAnswer.numberOfDockerfiles;
        const response: {
          dockerfile: Array<any>;
          tag: Array<any>;
          dockerhubRepository: Array<any>;
        } = {
          dockerfile: [],
          tag: [],
          dockerhubRepository: [],
        };

        for (let index = 0; index < serviceCount; index++) {
          const prompt: any = await getServicePrompts(index);

          response.dockerfile.push(prompt?.dockerfile);
          response.tag.push(prompt?.tag);
          response.dockerhubRepository.push(prompt?.dockerhubRepository);
        }

        return {
          ...response,
          serviceCount,
        };
      }
    });
}

export async function promptComputePublish(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "config",
      message: "Path to configuration file:",
      default: "./spheron.yaml",
    },
    {
      type: "input",
      name: "organizationId",
      message: "Organization where instance will be deployed to (optional):",
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptComputeUpdate(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "config",
      message: "Path to configuration file:",
      default: "./spheron.yaml",
    },
    {
      type: "input",
      name: "organizationId",
      message: "Organization where instance is deployed (optional):",
    },
    {
      type: "input",
      name: "instanceId",
      message:
        "Explicitly specify instance ID which you want to update. Will be taken from file if not specified (optional):",
    },
  ];
  return inquirer.prompt(questions);
}

function getServicePrompts(index: number) {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "dockerfileType",
        message: `Do you want to deploy service #${
          index + 1
        } from local dockerfile ?`,
        choices: ["yes", "no"],
      },
    ])
    .then(async (dockerAnswer: any) => {
      if (dockerAnswer.dockerfileType === "no") {
        return null;
      } else {
        return inquirer.prompt([
          {
            type: "input",
            name: `dockerfile${index}`,
            message: `Relative path to dockerfile #${index + 1}:`,
            default: "./",
          },
          {
            type: "input",
            name: `tag${index}`,
            message: `Tag to be used when building image #${index + 1}:`,
            default: "latest",
          },
          {
            type: "input",
            name: `dockerhubRepository${index}`,
            message: `Dockerhub repository for image #${index + 1}`,
            default: "dockerprofile/image",
          },
        ]);
      }
    });
}
