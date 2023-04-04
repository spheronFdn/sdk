import configuration from "../configuration";
import { writeToJsonFile } from "../utils";

export async function changeDefaultOrganization(organizationId: string) {
  try {
    await writeToJsonFile(
      "organization",
      organizationId,
      configuration.configFilePath
    );
    console.log(
      `Succesfully switched default organizaiton to ${organizationId}`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  }
}
