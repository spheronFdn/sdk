import { Env, Port } from "@spheron/core";

export enum ComputeCommandEnum {
  GET = "get",
  CREATE_ORGANIZATION = "create-organization",
  SWITCH_ORGANIZATION = "switch-organization",
  SWITHC_CLUSTER = "switch-cluster",
  INIT = "init",
  BUILD = "build",
  PUBLISH = "publish",
  VALIDATE = "validate",
  UPDATE = "update",
  LOGS = "logs",
  SHELL = "shell",
}

export interface SpheronComputeConfiguration {
  instanceName: string;
  clusterName: string;
  image: string;
  tag: string;
  instanceCount: number;
  ports: Array<Port>;
  env: Array<Env>;
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
