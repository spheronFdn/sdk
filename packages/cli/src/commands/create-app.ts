import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export async function createApp(templateUrl: string, folderName: string) {
  try {
    execSync(`git clone --quiet ${templateUrl} ${folderName}`);
    cleanUpFiles(folderName);
    console.log("Dapp created successfully");
  } catch (error) {
    console.log("Error: ", error.message);
  } finally {
    process.exit(0);
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
  } else if (alias === "NFT Drop") {
    return "https://github.com/spheronFdn/react-boilerplate";
  } else if (alias === "React") {
    return "https://github.com/spheronFdn/react-boilerplate";
  } else if (alias === "Next.js") {
    return "https://github.com/spheronFdn/react-boilerplate";
  }
  throw new Error("Mapping for template not found");
}
