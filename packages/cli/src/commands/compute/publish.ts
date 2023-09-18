import MetadataService from "../../services/metadata-service";
import SpheronApiService from "../../services/spheron-api";
import { SpheronComputeConfiguration } from "./interfaces";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";

export async function computePublish(organization?: string): Promise<any> {
  try {
    const yamlFilePath = path.join(process.cwd(), "spheron.yaml"); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig = yaml.load(yamlData) as SpheronComputeConfiguration;
    const organizationId: string = organization
      ? organization
      : (await MetadataService.getComputeData())?.organizationId;
    if (!organizationId) {
      throw new Error(
        "Please specify the organization that you would wish to use while deploying your instance"
      );
    }

    SpheronApiService.deployInstance(organizationId, spheronConfig);
    console.log(`Publishing your compute instance 🚀`);
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  }
}
