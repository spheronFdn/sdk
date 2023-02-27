import configuration from "../configuration";

import {
  fileExists,
  readFromJsonFile,
  getFileType,
  FileTypeEnum,
} from "../utils";

import { uploadDir, uploadFile } from "./upload";

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
    const fileType: FileTypeEnum = await getFileType(
      localConfiguration.rootPath
    );
    if (fileType === FileTypeEnum.DIRECTORY) {
      await uploadDir(
        localConfiguration.rootPath,
        localConfiguration.protocol,
        organizationId,
        localConfiguration.name
      );
    } else if (fileType === FileTypeEnum.FILE) {
      await uploadFile(
        localConfiguration.rootPath,
        localConfiguration.protocol,
        organizationId,
        localConfiguration.name
      );
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}