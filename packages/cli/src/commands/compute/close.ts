import SpheronApiService from "../../services/spheron-api";

import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import * as path from "path";
import { SpheronComputeConfiguration } from "./interfaces";
import Spinner from "../../outputs/spinner";

export async function close(
  instanceId?: string,
  configPath?: string
): Promise<any> {
  const spinner = new Spinner();
  try {
    if (!configPath) {
      configPath = "spheron.yaml";
    }

    spinner.spin(`Initiating the process to close your instance in Spheron...`);

    const yamlFilePath = path.join(process.cwd(), configPath); // Read spheron.yaml from the current working directory
    const yamlData = await fs.readFile(yamlFilePath, "utf8");
    const spheronConfig: any = yaml.load(
      yamlData
    ) as SpheronComputeConfiguration;

    const id = instanceId ? instanceId : spheronConfig.instanceId;
    if (!id) {
      throw new Error("Instance ID not provided");
    }
    const result = await SpheronApiService.closeInstance(id);
    spinner.success(`✓ Success! Instance ${id} is successful closed! 🚀`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  } finally {
    spinner.stop();
  }
}
