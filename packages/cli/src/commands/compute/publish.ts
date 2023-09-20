import MetadataService from "../../services/metadata-service";
import SpheronApiService from "../../services/spheron-api";
import {
  ComputeConfigFileType,
  SpheronComputeDirectConfiguration,
  SpheronComputeTemplateConfiguration,
} from "./interfaces";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";

export async function computePublish(organization?: string): Promise<any> {
  try {
    if (!organization) {
      const computeData = await MetadataService.getComputeData();
      organization = computeData?.organizationId;
      if (!organization) {
        throw new Error("OrganizationId not provided");
      }
    }
    const yamlFilePath = path.join(process.cwd(), "spheron.yaml"); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig: any = yaml.load(yamlData);
    const organizationId: string = organization
      ? organization
      : (await MetadataService.getComputeData())?.organizationId;
    if (!organizationId) {
      throw new Error(
        "Please specify the organization that you would wish to use while deploying your instance"
      );
    }
    if (spheronConfig.configType === ComputeConfigFileType.DIRECT) {
      const config = spheronConfig as SpheronComputeDirectConfiguration;
      SpheronApiService.deployInstance(organizationId, config);
    } else if (spheronConfig.configType === ComputeConfigFileType.TEMPLATE) {
      const config = spheronConfig as SpheronComputeTemplateConfiguration;
      SpheronApiService.deployTemplateInstance(organizationId, config);
    }
    console.log(`Publishing your compute instance 🚀`);
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  }
}
