import configuration from "../configuration";
import { fileExists, readFromJsonFile, writeToJsonFile } from "../utils";
import { createConfiguration } from "./create-configuration";
import Spinner from "../outputs/spinner";
import { AppTypeEnum, Organization } from "@spheron/core";
import SpheronApiService from "../services/spheron-api";

export async function createOrganization(
  name: string,
  username: string,
  type: string
) {
  const spinner = new Spinner();
  try {
    spinner.spin("Creating organization ");
    if (!(await fileExists(configuration.configFilePath))) {
      await createConfiguration();
    }
    const jwtToken = await readFromJsonFile(
      "jwtToken",
      configuration.configFilePath
    );
    if (!jwtToken) {
      console.log(
        "For creating new organisation, you need to login to Spheron first"
      );
      return;
    }
    const appType =
      type == AppTypeEnum.WEB_APP ? AppTypeEnum.WEB_APP : AppTypeEnum.COMPUTE;
    const organization: Organization =
      await SpheronApiService.createOrganization(username, name, appType);
    await writeToJsonFile(
      "organization",
      organization._id,
      configuration.configFilePath
    );
    spinner.success(`Organization ${name} is created`);
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  } finally {
    spinner.stop();
  }
}
