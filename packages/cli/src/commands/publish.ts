import path from "path";
import configuration from "../configuration";

import {
  fileExists,
  mapProtocolToUserReadable,
  readFromJsonFile,
} from "../utils";
import { upload } from "./upload";

export async function publish(organization?: string): Promise<any> {
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
    const organizationId: string = organization
      ? organization
      : await readFromJsonFile("organization", configuration.configFilePath);
    if (!organizationId) {
      throw new Error(
        "Please specify organization that you would wish to use while uploading"
      );
    }
    const publishDirectory =
      localConfiguration?.framework?.configuration?.publishDirectory;
    if (publishDirectory == undefined || publishDirectory == null) {
      throw new Error(
        "Publish directory not provided, please execute spheron init command"
      );
    }
    const pathToDir = path.join(localConfiguration.rootPath, publishDirectory);
    console.log(
      `Publishing your dapp to ${mapProtocolToUserReadable(
        localConfiguration.protocol
      )} 🚀`
    );
    await upload(
      pathToDir,
      localConfiguration.protocol,
      organizationId,
      localConfiguration.name
    );
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
