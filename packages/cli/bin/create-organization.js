const axios = require("axios");
const { configuration } = require("./configuration");

const {
  writeToConfigFile,
  fileExists,
  readFromJsonFile,
} = require("./utils");

async function createOrganization(name, username, type) {
  let executionError = false;
  try {
    if (!(await fileExists(configuration.configFilePath))) {
      console.log("Spheron config file does not exist");
      return;
    }
    const jwtToken = await readFromJsonFile("jwtToken", configuration.configFilePath);
    if (!jwtToken) {
      console.log("JWT token not valid or does not exist. Pleas login first");
      return;
    }
    console.log(`Creating organization name: ${name}, username: ${username}...`);
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
      loginError = true;
      throw new Error("Failed to create an organization");
    }
    console.log("Organization created");
    const organization = organizationResponse.data.organization;
    await writeToConfigFile("organization", organization._id);
  } catch (error) {
    console.log("Error: ", error.message);
    executionError = true;
  } finally {
    if (executionError) {
      console.log("There was a problem while creating organization");
    }
    process.exit(0);
  }
}

module.exports = {
  createOrganization,
};
