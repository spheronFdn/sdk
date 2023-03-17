import configuration from "../configuration";
import { fileExists, readFromJsonFile, deleteKeyFromJson } from "../utils";

export async function logout() {
  try {
    if (await fileExists(configuration.configFilePath)) {
      const jwtToken = await readFromJsonFile(
        "jwtToken",
        configuration.configFilePath
      );
      if (jwtToken) {
        await deleteKeyFromJson("jwtToken", configuration.configFilePath);
      }
    }
    console.log("Logged out!");
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  }
}
