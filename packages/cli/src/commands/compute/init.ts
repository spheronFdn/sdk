import path from "path";

import * as fs from "fs";
import * as yaml from "js-yaml";

import Spinner from "../../outputs/spinner";
import {
  SpheronComputeDirectConfiguration,
  SpheronComputeTemplateConfiguration,
} from "./interfaces";

export async function computeInit(
  configuration: SpheronComputeDirectConfiguration
) {
  const spinner = new Spinner();
  try {
    spinner.spin(`Spheron compute file initialization...`);
    if (await fileExists("./spheron.yaml")) {
      throw new Error("Spheron file already exists");
    }
    // Convert the configuration to YAML format
    const yamlData = yaml.dump(configuration);

    // Write to spheron.yaml file
    await fs.promises.writeFile(
      path.join(process.cwd(), "./spheron.yaml"),
      yamlData,
      "utf8"
    );

    spinner.success("Spheron YAML file created successfully");
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

export async function computeTemplateInit(
  configuration: SpheronComputeTemplateConfiguration
) {
  const spinner = new Spinner();
  try {
    spinner.spin(`Spheron compute file initialization...`);
    if (await fileExists("./spheron-tempalte.yaml")) {
      throw new Error("Spheron template file already exists");
    }
    // Convert the configuration to YAML format
    const yamlData = yaml.dump(configuration);

    // Write to spheron.yaml file
    await fs.promises.writeFile(
      path.join(process.cwd(), "./spheron-template.yaml"),
      yamlData,
      "utf8"
    );

    spinner.success("Spheron template YAML file created successfully");
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

// Assuming fileExists is something like:
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
