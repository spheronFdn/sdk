import axios from "axios";
import configuration from "../configuration";
import { writeToConfigFile, fileExists, readFromJsonFile } from "../utils";
import { createConfiguration } from "./create-configuration";

export async function createOrganization(
  name: string,
  username: string,
  type: string
) {
  let executionError = false;
  try {
    if (!(await fileExists(configuration.configFilePath))) {
      await createConfiguration();
    }
    const jwtToken = await readFromJsonFile(
      "jwtToken",
      configuration.configFilePath
    );
    if (!jwtToken) {
      console.log(
        "For creating a new organisation, you need to login to Spheron first"
      );
      return;
    }
    console.log(`Creating your organization...`);
    const organizationResponse = await axios.post(
      `${configuration.spheron_server_address}/v1/organization`,
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
    console.log(`${name} is now created`);
    await writeToConfigFile("organization", organization._id);
  } catch (error) {
    console.log("Error: ", error.message);
    throw error;
  }
}
