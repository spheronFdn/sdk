/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SpheronApiService from "../../services/spheron-api";
import {
  CliPersistentStorageTypesEnum,
  SpheronComputeConfiguration,
} from "./interfaces";
import * as yaml from "js-yaml";
import * as fs from "fs/promises"; // Node.js fs module with promises
import { fileExists } from "../../utils";

export async function validate(rootPath: string): Promise<any> {
  try {
    let validationErrors = 0;
    let validationWarnings = 0;
    if (!(await fileExists(rootPath))) {
      throw new Error(`File ${rootPath} does not exist`);
    }
    const yamlData = await fs.readFile(rootPath, "utf8");
    const spheronConfig: any = yaml.load(
      yamlData
    ) as SpheronComputeConfiguration;
    if (!spheronConfig.image) {
      console.log("image not specifed  ✖️");
      validationErrors += 1;
    }
    if (!spheronConfig.tag) {
      console.log("tag not specifed -> deafult is latest ⚠️");
      validationWarnings += 1;
    }

    if (!spheronConfig.clusterName) {
      console.log("cluster name not specified  ✖️");
      validationErrors += 1;
    }
    if (!spheronConfig.instanceCount) {
      console.log("Instance count not specified  ✖️");
      validationErrors += 1;
    }
    if (spheronConfig.ports) {
      for (const port of spheronConfig.ports) {
        if (!port.containerPort || !port.exposedPort) {
          console.log(
            "Port specification not valid. Need to have [containerPort, exposedPort] combination✖️"
          );
          validationErrors += 1;
        }
      }
    }
    if (spheronConfig.env) {
      for (const e of spheronConfig.env) {
        if (e.value == undefined || e.hidden == undefined) {
          console.log(
            "Env specification not valid. Need to have [value, hidden] combination✖️"
          );
          validationErrors += 1;
        }
      }
    }
    if (!spheronConfig.region) {
      console.log("region not specified ✖️");
      validationErrors += 1;
    } else {
      const regions: string[] = await SpheronApiService.getComputeRegions();
      if (!regions.find((x) => x == spheronConfig.region)) {
        console.log("specified region is not supported ✖️");
        validationErrors += 1;
      }
    }
    if (!spheronConfig.type) {
      console.log("type of instance must be specified ✖️");
      validationErrors += 1;
    }
    if (spheronConfig.plan) {
      const plans = await SpheronApiService.getComputePlans();
      if (!plans.find((x) => x.name == spheronConfig.plan)) {
        console.log("specified plan does not exist ✖️");
        validationErrors += 1;
      }
    } else {
      console.log("Plan not specified, checking if custom plan is provided");
      if (
        spheronConfig.customParams &&
        spheronConfig.customParams.cpu &&
        spheronConfig.customParams.memory &&
        spheronConfig.customParams.storage
      ) {
        if (!(typeof spheronConfig.customParams.cpu === "number")) {
          console.log("cpu parameter must be an integer ✖️");
          validationErrors += 1;
        }
        if (
          !(
            typeof spheronConfig.customParams.memory === "string" &&
            spheronConfig.customParams.memory.endsWith("Gi")
          )
        ) {
          console.log(
            "memory parameter not set properly (proper example: 1Gi) ✖️"
          );
          validationErrors += 1;
        }
        if (
          !(
            typeof spheronConfig.customParams.storage === "string" &&
            spheronConfig.customParams.storage.endsWith("Gi")
          )
        ) {
          console.log(
            "storage parameter not set properly (proper example: 4Gi) ✖️"
          );
          validationErrors += 1;
        }
      } else {
        console.log(
          "Custom plan needs to specify cpu, memory and storage to be valid ✖️"
        );
        validationErrors += 1;
      }
    }
    if (
      spheronConfig.customParams &&
      spheronConfig.customParams.persistentStorage
    ) {
      const persistentStorage = spheronConfig.customParams.persistentStorage!;
      if (
        persistentStorage.class &&
        persistentStorage.size &&
        persistentStorage.mountPoint
      ) {
        if (
          !Object.values(CliPersistentStorageTypesEnum).find(
            (x) => x == persistentStorage.class
          )
        ) {
          console.log(
            `persistent storage class not set up properly. Valid values are ${Object.values(
              CliPersistentStorageTypesEnum
            ).toString()} ✖️`
          );
          validationErrors += 1;
        }
        if (
          !(
            typeof persistentStorage.size === "string" &&
            persistentStorage.size.endsWith("Gi")
          )
        ) {
          console.log(
            "Persistent storage size parameter not set properly (proper example: 4Gi) ✖️"
          );
          validationErrors += 1;
        }
        if (!(typeof persistentStorage.mountPoint === "string")) {
          console.log(
            "Persistent storage mount point parameter needs to be valid path ✖️"
          );
          validationErrors += 1;
        }
      } else {
        console.log(
          "Persistent storage needs to specify class, size, and mountPoint to be valid ✖️"
        );
        validationErrors += 1;
      }
    }

    console.log(`Warnings count: ${validationWarnings}`);
    console.log(`Errors count: ${validationErrors}`);
    if (validationErrors == 0) {
      console.log("Configuration is ready to go 🚀");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    throw error;
  }
}
