import { ClusterProtocolEnum, AutoscalingNumberOfChecksEnum, AutoscalingTimeWindowEnum } from "./enums";
import { Env, PersistentStorage, Port } from "./interfaces";

interface CreateInstanceRequest {
  organizationId: string;
  uniqueTopicId?: string;
  configuration: {
    branch?: string;
    folderName: string; // folder where docker image is located in repo
    protocol: ClusterProtocolEnum; // ex: akash
    image: string; // name of the docker image if it is not located in repo
    tag: string; // name of the docker image if it is not located in repo
    instanceCount: number;
    buildImage: boolean; // if container should build the image, or if user has already defined it
    ports: Array<Port>;
    env: Array<Env>;
    command: Array<string>;
    args: Array<string>;
    region: string;
    akashMachineImageName?: string;
    customInstanceSpecs: CustomInstanceSpecs;
  };
  instanceName?: string;
  clusterUrl: string;
  clusterProvider: string;
  clusterName: string;
  healthCheckUrl?: string;
  healthCheckPort?: number;
  scalable?: boolean;
}

interface IAutoscalingRulesThreshold {
  cpuThreshold: {
    step: number;
    utilizationPercentage: number;
    checksInAlarm: number;
  };
  memoryThreshold: {
    step: number;
    utilizationPercentage: number;
    checksInAlarm: number;
  };
}

interface IAutoscalingRules {
  numberOfChecks: AutoscalingNumberOfChecksEnum;
  timeWindow: AutoscalingTimeWindowEnum;
  minimumInstances: number;
  maxInstances: number;
  scaleUp: IAutoscalingRulesThreshold;
  scaleDown: IAutoscalingRulesThreshold;
  cooldown: number;
  lastScaleAction: Date;
  lastScaleCheck: Date;
  windowCounter: {
    numberOfChecksPreformed: number;
    numberOfRequestsAboveCPULimit: number;
    numberOfRequestsBelowCPULimit: number;
    numberOfRequestsAboveMemoryLimit: number;
    numberOfRequestsBelowMemoryLimit: number;
  };
  averageCpuUtilization: number;
  averageMemoryUtilization: number;
}

interface CreateInstanceFromMarketplaceRequest {
  templateId: string;
  environmentVariables: MarketplaceDeploymentVariable[];
  organizationId: string;
  akashImageId: string;
  uniqueTopicId?: string;
  region: string;
  customInstanceSpecs?: CustomInstanceSpecs;
  scalable: boolean;
  instanceCount?: number;
  autoscalingRules?: IAutoscalingRules;
}

interface MarketplaceDeploymentVariable {
  label: string;
  value: string;
}

interface UpdateInstaceRequest {
  env: Array<Env>;
  command: Array<string>;
  args: Array<string>;
  uniqueTopicId: string;
  tag: string;
  akashMachineImageName?: string;
  customInstanceSpecs?: CustomInstanceSpecs;
}

interface CustomInstanceSpecs {
  cpu?: number;
  memory?: string;
  persistentStorage?: PersistentStorage;
  storage: string;
}

export {
  CreateInstanceRequest,
  CreateInstanceFromMarketplaceRequest,
  MarketplaceDeploymentVariable,
  UpdateInstaceRequest,
  IAutoscalingRules,
};
