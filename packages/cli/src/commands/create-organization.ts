import configuration from "../configuration";
import { fileExists, readFromJsonFile, writeToJsonFile } from "../utils";
import { createConfiguration } from "./create-configuration";
import Spinner from "../outputs/spinner";
import { AppTypeEnum, Organization, SpheronApi } from "core";

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
    const client = new SpheronApi(jwtToken, configuration.spheronServerAddress);
    const appType =
      type == AppTypeEnum.WEB_APP ? AppTypeEnum.WEB_APP : AppTypeEnum.COMPUTE;
    const organization: Organization = await client.createOrganization(
      username,
      name,
      appType
    );
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
