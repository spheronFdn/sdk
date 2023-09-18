import { Port } from "@spheron/core";

export enum ComputeCommandEnum {
  GET = "get",
  CREATE_ORGANIZATION = "create-organization",
  SWITCH_ORGANIZATION = "switch-organization",
  INIT = "init",
  PUBLISH = "publish",
  VALIDATE = "validate",
  UPDATE = "update",
  LOGS = "logs",
  SHELL = "shell",
}

export enum ComputeConfigFileType {
  DIRECT = "direct",
  TEMPLATE = "template",
}

export interface SpheronComputeConfiguration {
  configType: ComputeConfigFileType;
}

export interface SpheronComputeDirectConfiguration
  extends SpheronComputeConfiguration {
  clusterName: string;
  image: string;
  tag: string;
  instanceCount: number;
  ports: Array<Port>;
  env: Array<{ name: string; value: string; hidden: boolean }>;
  commands: Array<string>;
  args: Array<string>;
  region: string;
  type: ComputeInstanceType;
  plan: string;
  customParams: CustomParams;
  healthCheck?: {
    path: string;
    port: number;
  };
}

export interface SpheronComputeTemplateConfiguration
  extends SpheronComputeConfiguration {
  templateId: string;
  templateName: string;
  clusterName: string;
  env: Array<{ name: string; value: string; hidden: boolean }>;
  instanceCount: number;
  plan: string;
  region: string;
  type: ComputeInstanceType;
  customParams: CustomParams;
}

export interface ComputePlanDetails {
  cpu: string;
  memory: string;
}

export enum ComputeInstanceType {
  SPOT = "spot",
  ON_DEMAND = "on_demand",
}

export enum PersistentStorageTypesEnum {
  HDD = "hdd",
  SSD = "ssd",
  NVMe = "nvme",
}

export enum InstanceVersionLogsTypeEnum {
  DEPLOYMENT = "deployment",
  LIVE = "live",
  EVENTS = "events",
}

export interface CustomPersistentStorage {
  size: string;
  class: PersistentStorageTypesEnum;
  mountPoint: string;
}
interface CustomParams {
  cpu?: number;
  memory?: string;
  persistentStorage?: CustomPersistentStorage;
  storage: string;
}
