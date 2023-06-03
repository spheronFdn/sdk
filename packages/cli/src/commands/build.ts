import configuration from "../configuration";

import { fileExists, readFromJsonFile } from "../utils";
import { execSync } from "child_process";

export async function build(): Promise<any> {
  try {
    const localJsonPath = "./spheron.json";
    const projectConfig = await fileExists(localJsonPath);
    if (!projectConfig) {
      throw new Error(
        "spheron.json file does not exist. Please create it with spheron init command"
      );
    }
    const spheronConfig = await fileExists(configuration.configFilePath);
    if (!spheronConfig) {
      throw new Error(
        `Global configuration does not exist. Please execute spheron init command.`
      );
    }
    const localConfiguration: any = await readFromJsonFile(
      "configuration",
      localJsonPath
    );
    const frameworkConfig = localConfiguration?.framework?.configuration;
    const installCommand = frameworkConfig?.installCommand;
    const buildCommand = frameworkConfig?.buildCommand;

    execSync(installCommand);
    execSync(buildCommand);
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  }
}
