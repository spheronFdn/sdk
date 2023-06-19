import { createDapp, templateTypesMap } from "../commands/create-dapp";
import { FixBugEnum } from "../commands/gpt";
import { FrameworkOptions } from "../commands/init";

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

export async function promptForInit(): Promise<any> {
  const pathSegments = process.cwd().split("/");
  const defaultProject = pathSegments[pathSegments.length - 1];
  const questions = [
    {
      type: "input",
      name: "project",
      message: "Project name:",
      default: defaultProject,
    },
    {
      type: "list",
      name: "protocol",
      choices: ["Arweave", "Filecoin", "IPFS"],
      message: "Upload protocol:",
    },
    {
      type: "input",
      name: "path",
      message: "Relative path to content:",
      default: "./",
    },
    {
      type: "list",
      name: "framework",
      choices: Object.values(FrameworkOptions).map(
        (option) => option.charAt(0).toUpperCase() + option.slice(1)
      ),
      message: "Framework:",
      default: "static",
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptForConfigure(): Promise<any> {
  const questions = [
    {
      type: "input",
      name: "organization",
      message: "Default organization ID:",
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptForCreateDapp(appName?: string): Promise<any> {
  inquirer
    .prompt([
      {
        type: "list",
        name: "projectType",
        message: "What type of dapp do you want to create?",
        choices: templateTypes,
      },
    ])
    .then((answers: any) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "template",
            message: `Choose template:`,
            choices: answers.projectType,
          },
          {
            type: "input",
            name: "project",
            message: "Project name:",
            default: function (answers: any) {
              if (appName) {
                return appName;
              }
              return answers.template.defaultProjectName;
            },
          },
          {
            type: "list",
            name: "protocol",
            message: "Upload protocol:",
            choices: ["Arweave", "Filecoin", "IPFS"],
            default: "Arweave",
          },
        ])
        .then(async (answers: any) => {
          console.log(
            `\nCreating a new ${answers.template.alias} dapp with project name: ${answers.project}. Time to become a wizard 🔮`
          );
          await createDapp(
            answers.template,
            answers.project,
            answers.protocol.toLowerCase()
          );
        });
    });
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
      choices: [FixBugEnum.YES, FixBugEnum.NO],
      default: FixBugEnum.YES,
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

const templateTypes = Array.from(templateTypesMap.values()).map((t) => ({
  name: t.alias,
  value: t.dapps,
}));
