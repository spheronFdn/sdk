import MetadataService from "../../services/metadata-service";
import SpheronApiService from "../../services/spheron-api";

import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";
import { SpheronComputeConfiguration } from "./interfaces";
import { InstanceResponse } from "@spheron/core";
import Spinner from "../../outputs/spinner";

export async function computeUpdate(
  instanceId?: string,
  configPath?: string,
  organizationId?: string
): Promise<any> {
  const spinner = new Spinner();
  try {
    if (!organizationId) {
      const computeData = await MetadataService.getComputeData();
      organizationId = computeData?.organizationId;
      if (!organizationId) {
        throw new Error("OrganizationId not provided");
      }
    }
    if (!configPath) {
      configPath = "spheron.yaml";
    }
    const yamlFilePath = path.join(process.cwd(), configPath); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig: any = yaml.load(
      yamlData
    ) as SpheronComputeConfiguration;

    const id = instanceId ? instanceId : spheronConfig.instanceId;
    if (!id) {
      throw new Error("Instance ID not provided");
    }
    console.log(`Reading from ${configPath}`);

    spinner.spin(
      `Initiating the process to update the configuration of your instance in Spheron...`
    );
    const result: InstanceResponse = await SpheronApiService.updateInstance(
      id,
      organizationId,
      spheronConfig
    );
    if (result && result.computeInstanceId) {
      spinner.success(
        `✓ Success! Update of instance ${result.computeInstanceId} is successful! 🚀 `
      );
      const existingYamlConfig = yaml.load(
        yamlData
      ) as SpheronComputeConfiguration;

      existingYamlConfig.instanceId = result.computeInstanceId;
      existingYamlConfig.projectId = result.computeProjectId;
      existingYamlConfig.organizationId = organizationId;

      const updatedYamlData = yaml.dump(existingYamlConfig);

      const instanceYamlFilePath = path.join(
        process.cwd(),
        `instance-${result.computeInstanceId}.yaml`
      );

      await fs.writeFile(instanceYamlFilePath, updatedYamlData, "utf8");
      console.log(`Instance data saved to ${instanceYamlFilePath}`);
    } else {
      console.log(
        "Instance ID not found in the response. Unable to save the YAML file."
      );
    }
    console.log(
      `\n\nHelpful Commands:\n\nTo retrieve more detailed information about the instance, use this following command:\nspheron instance --id <INSTANCE ID>`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  } finally {
    spinner.stop();
  }
}
