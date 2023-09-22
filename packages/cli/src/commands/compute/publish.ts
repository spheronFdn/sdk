import MetadataService from "../../services/metadata-service";
import SpheronApiService from "../../services/spheron-api";
import { SpheronComputeConfiguration } from "./interfaces";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";
import { InstanceResponse } from "@spheron/core";
import Spinner from "../../outputs/spinner";

export async function computePublish(
  organization?: string,
  configPath?: string
): Promise<any> {
  const spinner = new Spinner();
  try {
    if (!organization) {
      const computeData = await MetadataService.getComputeData();
      organization = computeData?.organizationId;
      if (!organization) {
        throw new Error("OrganizationId not provided");
      }
    }
    if (!configPath) {
      configPath = "spheron.yaml";
    }
    spinner.spin(`Publishing new compute instance 🚀`);
    console.log(`Reading from ${configPath}`);
    const yamlFilePath = path.join(process.cwd(), configPath); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig: any = yaml.load(
      yamlData
    ) as SpheronComputeConfiguration;
    const organizationId: string = organization
      ? organization
      : (await MetadataService.getComputeData())?.organizationId;
    if (!organizationId) {
      throw new Error(
        "Please specify the organization that you would wish to use while deploying your instance"
      );
    }
    const result: InstanceResponse = await SpheronApiService.deployInstance(
      organizationId,
      spheronConfig
    );
    if (result && result.clusterInstanceId) {
      // Read the existing YAML file.
      const existingYamlConfig = yaml.load(
        yamlData
      ) as SpheronComputeConfiguration;

      existingYamlConfig.instanceId = result.clusterInstanceId;
      existingYamlConfig.clusterId = result.clusterId;
      existingYamlConfig.organizationId = organization;

      const updatedYamlData = yaml.dump(existingYamlConfig);

      const instanceYamlFilePath = path.join(
        process.cwd(),
        `instance-${result.clusterId}.yaml`
      );
      await fs.writeFile(instanceYamlFilePath, updatedYamlData, "utf8");
      console.log(`Instance data saved to ${instanceYamlFilePath}`);
      spinner.success("Deployment finished 🚀");
    } else {
      console.log(
        "Instance ID not found in the response. Unable to save the YAML file."
      );
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  } finally {
    spinner.stop();
  }
}