import { CustomInstanceSpecs, Env, Port } from "@spheron/core";

export enum ComputeCommandEnum {
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
  plan?: string;
  customPlan?: CustomInstanceSpecs;
}

export interface ComputePlanDetails {
  cpu: string;
  memory: string;
}

export enum ComputeInstanceType {
  SPOT = "spot",
  ON_DEMAND = "on_demand",
}
