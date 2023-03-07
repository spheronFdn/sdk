import axios from "axios";
import configuration from "../configuration";
import { fileExists, readFromJsonFile, writeToJsonFile } from "../utils";
import { createConfiguration } from "./create-configuration";
import Spinner from "../outputs/spinner";

export async function createOrganization(
  name: string,
  username: string,
  type: string
) {
  const spinner = new Spinner();
  try {
    spinner.spin("Creating organization");
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
    const organizationResponse = await axios.post(
      `${configuration.spheronServerAddress}/v1/organization`,
      {
        name,
        username,
        appType: type,
      },
      {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (
      organizationResponse.status != 201 ||
      organizationResponse.data?.success == false
    ) {
      throw new Error("Failed to create an organization");
    }
    const organization = organizationResponse.data.organization;
    await writeToJsonFile(
      "organization",
      organization._id,
      configuration.configFilePath
    );
    spinner.success(`Organization ${name} is created`);
  } catch (error) {
    console.log("Error: ", error.message);
    throw error;
  } finally {
    spinner.stop();
  }
}
