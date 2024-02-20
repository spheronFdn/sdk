import path from "path";

import * as fs from "fs";
import * as yaml from "js-yaml";

import Spinner from "../../outputs/spinner";
import {
  BuildConfig,
  CliComputeEnv,
  CliCustomParams,
  CliPersistentStorageTypesEnum,
  DockerCompose,
  SpheronComputeConfiguration,
  SpheronComputeServiceConfiguration,
} from "./interfaces";
import { Port } from "@spheron/core-testing";

export async function computeInit(configuration: SpheronComputeConfiguration) {
  const spinner = new Spinner();
  try {
    spinner.spin(`Spheron compute file initialization...`);
    if (await fileExists("./spheron.yaml")) {
      console.log("Spheron file already exists, overriding it ⚠️");
    }
    // Convert the configuration to YAML format
    const yamlData = yaml.dump(configuration);

    // Write to spheron.yaml file
    await fs.promises.writeFile(
      path.join(process.cwd(), "./spheron.yaml"),
      yamlData,
      "utf8"
    );

    spinner.success(
      "✓ Success! spheron.yaml file created/updated successfully 🚀"
    );

    console.log(
      `\nNote: All the services has been added to your spheron.yaml files.`
    );
    console.log(
      `\nHelpful Commands:\n\nTo build an instance that exists locally, first add the image name to the spheron.yml file, and then use this following command:\nspheron build -u <DOCKERHUB USERNAME> -p <DOCKERHUB PASSWORD>\n\nTo deploy your instance to Spheron, use this following command:\nspheron deploy`
    );
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

export async function readDockerComposeFile(
  filePath: string
): Promise<Array<SpheronComputeServiceConfiguration> | null> {
  const spinner = new Spinner();
  spinner.spin("Starting import from docker compose...");

  try {
    if (!(await fileExists(filePath))) {
      console.error("Docker compose file not found");
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const doc: DockerCompose = yaml.load(fileContents) as DockerCompose;

    const spheronConfig = convertToSpheronConfig(doc);

    spinner.success(`✓ Success! ${filePath} imported successfully!`);
    return spheronConfig;
  } catch (error) {
    console.error("Error reading or parsing Docker Compose file.");
    return null;
  } finally {
    spinner.stop();
  }
}

function convertToSpheronConfig(
  dockerCompose: DockerCompose
): Array<SpheronComputeServiceConfiguration> | null {
  try {
    const services = Object.entries(dockerCompose.services).map(
      ([name, service]) => {
        const [image, tag] = service.image
          ? service.image.split(":")
          : [getDockerfilePath(service.build), "latest"];

        const customParams: CliCustomParams = {
          storage: "20Gi",
        };

        if (service.volumes) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, dest] = service.volumes[0].split(":");

          customParams.persistentStorage = {
            size: "20Gi",
            class: CliPersistentStorageTypesEnum.SSD,
            mountPoint: dest,
          };
        }

        const serviceConfig: SpheronComputeServiceConfiguration = {
          name,
          image: image,
          tag: tag != "" ? tag : "latest",
          count: 1,
          ports: service.ports ? service.ports.map(mapDockerPort) : [],
          env: service.environment
            ? mapEnvironmentVariables(service.environment)
            : [],
          commands:
            typeof service.command === "string"
              ? [service.command]
              : service.command || [],
          args: [],
          plan: "Ventus Nano 1",
          customParams: customParams,
        };

        if (service.build) {
          serviceConfig.dockerhubRepository = `spheron/${name}`;
        }

        return serviceConfig;
      }
    );

    return services;
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    return null;
  }
}

function mapDockerPort(port: string): Port {
  const [exposedPort, containerPort] = port.split(":").map(Number);
  return { exposedPort, containerPort };
}

function mapEnvironmentVariables(
  env: { [key: string]: string } | string[]
): CliComputeEnv[] {
  if (Array.isArray(env)) {
    return env.map((e) => {
      const [key, value] = e.split("=");
      return {
        name: key,
        value: value,
        hidden: false,
      };
    });
  } else if (env) {
    return Object.entries(env).map(([key, value]) => ({
      name: key,
      value: value,
      hidden: false,
    }));
  }
  return [];
}

function getDockerfilePath(build: string | BuildConfig | undefined): string {
  if (!build) {
    return "";
  }

  if (typeof build === "string") {
    return build;
  }

  const defaultDockerfileName = "Dockerfile";
  const dockerfileName = build.dockerfile ?? defaultDockerfileName;

  return `${build.context ?? "."}/${dockerfileName}`;
}

export async function readDockerfile(
  filePath: string
): Promise<SpheronComputeServiceConfiguration | null> {
  const spinner = new Spinner();
  spinner.spin("Starting import from Dockerfile...");

  const dockerFile = path.join(filePath, "/Dockerfile");

  try {
    if (!(await fileExists(dockerFile))) {
      console.error("Dockerfile not found");
      return null;
    }

    const fileContents = fs.readFileSync(dockerFile, "utf8");
    const lines = fileContents.split(/\r?\n/);
    const serviceConfig: SpheronComputeServiceConfiguration = {
      name: generateRandomName(),
      image: filePath,
      tag: "latest",
      count: 1,
      ports: [],
      env: [],
      commands: [],
      args: [],
      plan: "",
      customParams: {
        cpu: 0.5,
        memory: "2GB",
        storage: "20Gi",
      },
    };

    lines.forEach((line) => {
      const [instruction, ...args] = line.split(" ");

      switch (instruction.toUpperCase()) {
        case "EXPOSE":
          serviceConfig.ports = parseDockerExposePorts(args).map((port) => {
            return {
              containerPort: port,
              exposedPort: port,
            };
          });
          break;
        case "ENV":
          serviceConfig.env.push(...parseDockerEnvLine(args.join(" ")));
          break;
        case "VOLUME":
          serviceConfig.customParams.persistentStorage = {
            size: "20Gi",
            class: CliPersistentStorageTypesEnum.SSD,
            mountPoint: extractFirstDockerVolume(line),
          };
          break;
      }
    });

    spinner.success(`✓ Success! ${filePath} imported successfully!`);
    return serviceConfig;
  } catch (error) {
    console.error("Error reading or parsing Dockerfile.");
    return null;
  } finally {
    spinner.stop();
  }
}

const adjectives = [
  "Fast",
  "Dynamic",
  "Brilliant",
  "Silent",
  "Mighty",
  "Dancing",
  "Flying",
  "Roaming",
  "Calm",
  "Bold",
];

const nouns = [
  "Tiger",
  "River",
  "Mountain",
  "Eagle",
  "Ocean",
  "Cloud",
  "Tree",
  "Star",
  "Flower",
  "Wind",
];

function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 100);

  return `${adjective}${noun}${randomNumber}`;
}

function parseDockerEnvLine(envLine: string): CliComputeEnv[] {
  const envs: CliComputeEnv[] = [];
  let currentEnv = "";
  let insideQuotes = false;

  for (const char of envLine) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === " " && !insideQuotes) {
      if (currentEnv) {
        envs.push(createCliComputeEnv(currentEnv));
        currentEnv = "";
      }
    } else {
      currentEnv += char;
    }
  }

  if (currentEnv) {
    envs.push(createCliComputeEnv(currentEnv));
  }

  return envs;
}

function createCliComputeEnv(envString: string): CliComputeEnv {
  const [name, value] = envString.split("=");
  return {
    name: name.trim(),
    value: value.replace(/\\ /g, " ").trim(),
    hidden: false, // You can change this based on your requirement
  };
}

function parseDockerExposePorts(portStrings: string[]): number[] {
  const ports: number[] = [];

  for (const portString of portStrings) {
    // Extract the port number before any '/'
    const port = parseInt(portString.split("/")[0], 10);
    if (!isNaN(port)) {
      ports.push(port);
    }
  }

  return ports;
}

function extractFirstDockerVolume(volumeLine: string): string {
  const volumeContent = volumeLine.substring(7).trim();

  if (volumeContent.startsWith("[") && volumeContent.endsWith("]")) {
    try {
      const jsonVolumes = JSON.parse(volumeContent);

      return jsonVolumes[0];
    } catch (error) {
      return volumeContent;
    }
  }
  return volumeContent;
}
