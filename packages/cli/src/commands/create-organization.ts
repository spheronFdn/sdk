import axios from "axios";
import configuration from "../configuration";
import { fileExists, readFromJsonFile, writeToJsonFile } from "../utils";
import { createConfiguration } from "./create-configuration";

export async function createOrganization(
  name: string,
  username: string,
  type: string
) {
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
    console.log(`Organization ${name} is now created`);
    await writeToJsonFile(
      "organization",
      configuration.configFilePath,
      organization._id
    );
  } catch (error) {
    console.log("Error: ", error.message);
    throw error;
  }
}
