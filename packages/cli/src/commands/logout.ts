import configuration from "../configuration";
import MetadataService from "../services/metadata-service";
import { fileExists, deleteKeyFromJson } from "../utils";

export async function logout() {
  try {
    if (await fileExists(configuration.configFilePath)) {
      const jwtToken = await MetadataService.getJwtToken();
      if (jwtToken) {
        await deleteKeyFromJson("jwtToken", configuration.configFilePath);
      }
    }
    console.log("Logged out!");
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  }
}
