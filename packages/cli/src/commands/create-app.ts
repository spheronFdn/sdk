import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import Spinner from "../outputs/spinner";

export async function createApp(templateUrl: string, folderName: string) {
  const spinner = new Spinner();
  try {
    spinner.spin("Creating dapp ");
    execSync(`git clone --quiet ${templateUrl} ${folderName}`);
    cleanUpFiles(folderName);
    spinner.success("Dapp created !");
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
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
