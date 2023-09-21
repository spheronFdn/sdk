import { Port } from "@spheron/core";

export enum ComputeCommandEnum {
  GET = "get",
  CREATE_ORGANIZATION = "create-organization",
  SWITCH_ORGANIZATION = "switch-organization",
  INIT = "init",
  PUBLISH = "publish",
  VALIDATE = "validate",
  UPDATE = "update",
  SHELL = "shell",
}

export interface SpheronComputeConfiguration {
  clusterName: string;
  region: string;
  image: string;
  tag: string;
  instanceCount: number;
  ports: Array<Port>;
  env: Array<CliComputeEnv>;
  commands: Array<string>;
  args: Array<string>;
  type: CliComputeInstanceType;
  plan: string;
  customParams: CliCustomParams;
  templateId?: string;
  templateName?: string;
  healthCheck?: {
    path: string;
    port: number;
  };
  instanceId?: string;
  clusterId?: string;
  organizationId?: string;
  versionId?: string;
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
