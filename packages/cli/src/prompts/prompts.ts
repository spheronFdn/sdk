import { createApp, getTemplateUrlMapping } from "../commands/create-app";

const inquirer = require("inquirer");

export async function promptForLogin(): Promise<any> {
  try {
    const result = await inquirer.prompt([
      {
        type: "list",
        name: "provider",
        message: "Select your provider",
        choices: ["github", "gitlab", "bitbucket"],
      },
    ]);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function promptForUploadFile(): Promise<any> {
  try {
    const questions = [
      {
        type: "input",
        name: "path",
        message: "Path to file (default -> ./):",
      },
      {
        type: "list",
        name: "protocol",
        message: "Upload protocol:",
        choices: ["arweave", "ipfs-filecoin", "ipfs"],
      },
      {
        type: "input",
        name: "projectName",
        message: "Project name (default -> auto generated):",
      },
      {
        type: "input",
        name: "organizationId",
        message:
          "Organization where project will be created (default - from settings):",
      },
    ];
    return inquirer.prompt(questions);
  } catch (error) {
    throw error;
  }
}

export async function promptForCreateOrganization(): Promise<any> {
  try {
    const questions = [
      {
        type: "input",
        name: "name",
        message: "Name of the organization (default -> auto generated):",
      },
      {
        type: "input",
        name: "username",
        message: "Username of the organization (default -> auto generated):",
      },
    ];
    return inquirer.prompt(questions);
  } catch (error) {
    throw error;
  }
}

export async function promptForInit(): Promise<any> {
  try {
    const questions = [
      {
        type: "input",
        name: "name",
        message: "Project name:",
      },
      {
        type: "input",
        name: "protocol",
        message: "Upload protocol:",
      },
      {
        type: "input",
        name: "path",
        message: "Path to directory (default -> ./):",
      },
    ];
    return inquirer.prompt(questions);
  } catch (error) {
    throw error;
  }
}

export async function promptForCreateApp(): Promise<any> {
  try {
    inquirer
      .prompt([
        {
          type: "list",
          name: "projectType",
          message: "What type of project do you want to create?",
          choices: ["Default app", "Start from a template"],
        },
      ])
      .then((answers: any) => {
        if (answers.projectType === "Default app") {
          inquirer
            .prompt([
              {
                type: "list",
                name: "templateType",
                message: "Choose a default app type:",
                choices: ["React", "Next.js"],
              },
              {
                type: "input",
                name: "projectName",
                message: "Enter project name:",
              },
            ])
            .then(async (answers: any) => {
              console.log(
                `Creating a new default ${answers.templateType} project named ${answers.projectName}. Time to become a wizard 🔮`
              );
              const url: string = getTemplateUrlMapping(answers.templateType);
              await createApp(url, answers.projectName);
            });
        } else if (answers.projectType === "Start from a template") {
          inquirer
            .prompt([
              {
                type: "list",
                name: "templateType",
                message: "Choose a template:",
                choices: ["Portfolio", "NFT Drop"],
              },
              {
                type: "input",
                name: "projectName",
                message: "Enter project name:",
              },
            ])
            .then(async (answers: any) => {
              if (!answers.projectName) {
                throw new Error("Project name was not provided");
              }
              console.log(
                `Creating a new spheron project from template ${answers.templateType} with project name ${answers.projectName}. Time to become a wizard 🔮`
              );
              const url: string = getTemplateUrlMapping(answers.templateType);
              await createApp(url, answers.projectName);
            });
        }
      });
  } catch (error) {
    throw error;
  }
}
