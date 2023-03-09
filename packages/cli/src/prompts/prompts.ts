import { createApp, getTemplateUrlMapping } from "../commands/create-app";
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
      name: "project",
      message: "Project name:",
      default: defaultProject,
    },
    {
      type: "input",
      name: "organizationId",
      message: "Organization where project will be created (optional):",
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
      choices: Object.values(FrameworkOptions),
      message: "Framework:",
      default: "static",
    },
  ];
  return inquirer.prompt(questions);
}

export async function promptForCreateApp(appName?: string): Promise<any> {
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
              name: "project",
              message: "Project name:",
              default: function (answers: any) {
                if (appName) {
                  return appName;
                }
                if (answers.templateType === "React") {
                  return "my-react-app";
                } else if (answers.templateType === "Next.js") {
                  return "my-nextjs-app";
                }
                return ""; // fallback default value
              },
            },
          ])
          .then(async (answers: any) => {
            console.log(
              `Creating a new default ${answers.templateType} project name ${answers.project}. Time to become a wizard 🔮`
            );
            const url: string = getTemplateUrlMapping(answers.templateType);
            await createApp(url, answers.project);
          });
      } else if (answers.projectType === "Start from a template") {
        inquirer
          .prompt([
            {
              type: "list",
              name: "templateType",
              message: "Choose a template:",
              choices: ["Portfolio"],
            },
            {
              type: "input",
              name: "project",
              message: "Project name:",
              default: function (answers: any) {
                if (appName) {
                  return appName;
                }
                if (answers.templateType === "Portfolio") {
                  return "my-portfolio-app";
                }
                return ""; // fallback default value
              },
            },
          ])
          .then(async (answers: any) => {
            if (!answers.project) {
              throw new Error("Project name was not provided");
            }
            console.log(
              `Creating a new spheron project from template ${answers.templateType} with project name ${answers.project}. Time to become a wizard 🔮`
            );
            const url: string = getTemplateUrlMapping(answers.templateType);
            await createApp(url, answers.project);
          });
      }
    });
}
