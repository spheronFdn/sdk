import { execSync } from "child_process";
import fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk");
import { FrameworkOptions, init } from "./init";

export async function createApp(
  templateAlias: string,
  projectName: string,
  protocol: string
) {
  try {
    console.log(`- Initializing dapp in ${projectName}`);
    const url: string = getTemplateUrlMapping(templateAlias);
    execSync(`git clone --quiet ${url} ${projectName}`);
    console.log(
      `${chalk.green("✓")} ${chalk.cyan(templateAlias)} dapp initialized`
    );
    cleanUpFiles(projectName);
    const framework = getTemplateFrameworkMapping(templateAlias);
    const rootPath = getTemplateRootPathMapping(templateAlias);
    process.chdir(projectName);
    await init(projectName, protocol, rootPath, framework, true);
    process.chdir("..");
    console.log(
      `${chalk.green("✓")} ${chalk.cyan(
        templateAlias
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

export function getTemplateUrlMapping(alias: string): string {
  if (alias === "Portfolio") {
    return "https://github.com/spheronFdn/portfolio-template";
  } else if (alias === "React") {
    return "https://github.com/spheronFdn/react-boilerplate";
  } else if (alias === "Next.js") {
    return "https://github.com/spheronFdn/next-boilerplate";
  }
  throw new Error("Mapping for template not found");
}

export function getTemplateFrameworkMapping(alias: string): FrameworkOptions {
  if (alias === "Portfolio") {
    return FrameworkOptions.Next;
  } else if (alias === "React") {
    return FrameworkOptions.React;
  } else if (alias === "Next.js") {
    return FrameworkOptions.Next;
  }
  throw new Error("Mapping for template not found");
}

export function getTemplateRootPathMapping(alias: string): string {
  if (alias === "Portfolio" || alias === "React" || alias === "Next.js") {
    return "./";
  }
  return "";
}
