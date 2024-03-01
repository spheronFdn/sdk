import { Port } from "@spheron/core";

export enum ComputeCommandEnum {
  GET = "get",
  CREATE_ORGANIZATION = "create-organization",
  SWITCH_ORGANIZATION = "switch-organization",
  INIT = "init",
  BUILD = "build",
  DEPLOY = "deploy",
  VALIDATE = "validate",
  UPDATE = "update",
  SHELL = "shell",
  CLOSE = "close",

  ORGANIZATION = "organization",
  INSTANCES = "instances",
  PROJECTS = "projects",
  INSTANCE = "instance",
  SERVICE = "service",
  LOGS = "logs",
  USAGE = "usage",
  PLANS = "plans",
  REGIONS = "regions",
  MARKETPLACE_APPS = "marketplace-apps",
  METRICS = "metrics",
}

export interface SpheronComputeConfiguration {
  region: string;
  projectName: string;
  instanceId?: string;
  projectId?: string;
  organizationId?: string;
  versionId?: string;
  services: Array<SpheronComputeServiceConfiguration>;
  type: CliComputeInstanceType;
}

export interface SpheronComputeServiceConfiguration {
  name: string;
  image: string;
  tag: string;
  count: number;
  ports: Array<Port>;
  env: Array<CliComputeEnv>;
  commands: Array<string>;
  args: Array<string>;
  plan: string;
  customParams: CliCustomParams;
  templateId?: string;
  templateName?: string;
  healthCheck?: {
    path: string;
    port: number;
  };
  dockerhubRepository?: string;
}

export interface CliComputeEnv {
  name: string;
  value: string;
  hidden: boolean;
}

export enum CliComputeInstanceType {
  SPOT = "spot",
  ON_DEMAND = "on_demand",
}

export enum CliPersistentStorageTypesEnum {
  HDD = "hdd",
  SSD = "ssd",
  NVMe = "nvme",
}

export enum InstanceVersionLogsTypeEnum {
  DEPLOYMENT = "deployment",
  LIVE = "live",
  EVENTS = "events",
}

export interface CliCustomPersistentStorage {
  size: string;
  class: CliPersistentStorageTypesEnum;
  mountPoint: string;
}

export interface CliCustomParams {
  cpu?: number;
  memory?: string;
  persistentStorage?: CliCustomPersistentStorage;
  storage: string;
}

export interface DockerCompose {
  version: string;
  services: { [serviceName: string]: Service };
  networks?: { [networkName: string]: Network };
  volumes?: { [volumeName: string]: Volume };
}

export interface Service {
  image?: string;
  build?: string | BuildConfig;
  command?: string | string[];
  environment?: { [key: string]: string } | string[];
  volumes?: string[];
  ports?: string[];
  depends_on?: string[];
  networks?: string[];
  env_file?: string | string[];
  entrypoint?: string | string[];
  deploy?: { replicas?: number };
  // Add more service-specific properties as needed
}

export interface BuildConfig {
  context: string;
  dockerfile?: string;
  args?: { [argName: string]: string };
}

export interface Network {
  driver?: string;
  driver_opts?: { [optName: string]: string };
  // Add more network-specific properties as needed
}

interface Volume {
  driver?: string;
  driver_opts?: { [optName: string]: string };
  // Add more volume-specific properties as needed
}

// The readDockerComposeFile function remains the same
