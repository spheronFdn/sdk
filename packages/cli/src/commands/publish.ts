import configuration from "../configuration";

import { fileExists, readFromJsonFile } from "../utils";

import { upload } from "./upload";

export async function publish(): Promise<any> {
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
        `global spheron configuration does not exist at ${configuration.configFilePath}. Please execute spheron create-configuration command`
      );
    }
    const localConfiguration: any = await readFromJsonFile(
      "configuration",
      localJsonPath
    );
    const organizationId: string = await readFromJsonFile(
      "organization",
      configuration.configFilePath
    );
    if (!organizationId) {
      throw new Error(
        "Please specify organization that you would wish to use while uploading"
      );
    }

    await upload(
      localConfiguration.rootPath,
      localConfiguration.protocol,
      organizationId,
      localConfiguration.name
    );
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
