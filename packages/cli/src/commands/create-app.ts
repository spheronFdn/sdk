import { execSync } from "child_process";
import fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk");
import { FrameworkOptions, init } from "./init";

export async function createApp(
  template: ITemplateApp,
  projectName: string,
  protocol: string
) {
  try {
    console.log(`- Initializing dapp in ${projectName}`);
    const url: string = template.url;
    execSync(`git clone --quiet ${url} ${projectName}`);
    console.log(
      `${chalk.green("✓")} ${chalk.cyan(template.alias)} dapp initialized`
    );
    cleanUpFiles(projectName);
    process.chdir(projectName);
    await init(
      projectName,
      protocol,
      template.rootPath,
      template.framework,
      true
    );
    process.chdir("..");
    console.log(
      `${chalk.green("✓")} ${chalk.cyan(
        template.alias
      )} dapp created in ${projectName} 🚀`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  }
}

function cleanUpFiles(folderName: string) {
  fs.rmSync(path.join(process.cwd(), folderName, ".git"), {
    recursive: true,
    force: true,
  });
}

export enum DappCategory {
  Default = "default",
  Template = "template",
}

export interface ITemplateApp {
  alias: string; // shown to user
  dappType: DappCategory;
  url: string;
  framework: FrameworkOptions;
  rootPath: string;
  defaultProjectName: string;
}

export const templateDappsMap: Map<string, ITemplateApp> = new Map<
  string,
  ITemplateApp
>([
  [
    "default-react",
    {
      alias: "React",
      dappType: DappCategory.Default,
      url: "https://github.com/spheronFdn/react-boilerplate",
      framework: FrameworkOptions.React,
      rootPath: "./",
      defaultProjectName: "my-react-app",
    },
  ],
  [
    "default-nextjs",
    {
      alias: "Next.js",
      dappType: DappCategory.Default,
      url: "https://github.com/spheronFdn/next-boilerplate",
      framework: FrameworkOptions.Next,
      rootPath: "./",
      defaultProjectName: "my-nextjs-app",
    },
  ],
  [
    "template-portfolio",
    {
      alias: "Portfolio",
      dappType: DappCategory.Template,
      url: "https://github.com/spheronFdn/portfolio-template",
      framework: FrameworkOptions.Next,
      rootPath: "./",
      defaultProjectName: "my-portfolio-app",
    },
  ],
  [
    "template-linktree",
    {
      alias: "Link Tree",
      dappType: DappCategory.Template,
      url: "https://github.com/spheronFdn/link-tree-app",
      framework: FrameworkOptions.React,
      rootPath: "./",
      defaultProjectName: "my-linktree-app",
    },
  ],
]);

export interface ITemplateCategory {
  alias: string; // shown to user
  dapps: Array<ITemplateApp>;
}

export const templateTypesMap: Map<DappCategory, ITemplateCategory> = new Map<
  DappCategory,
  any
>([
  [
    DappCategory.Default,
    {
      alias: "Default dapp",
      dapps: Array.from(templateDappsMap.values())
        .filter((app) => app.dappType === DappCategory.Default)
        .map((app) => ({ name: app.alias, value: app })),
    },
  ],
  [
    DappCategory.Template,
    {
      alias: "Template",
      dapps: Array.from(templateDappsMap.values())
        .filter((app) => app.dappType === DappCategory.Template)
        .map((app) => ({ name: app.alias, value: app })),
    },
  ],
]);
