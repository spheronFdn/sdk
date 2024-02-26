import {
  AutoscalingPlanEnum,
  AutoscalingTimeWindowEnum,
  AutoscalingCooldownEnum,
} from "./enums";
import {
  AutoscalingRulesThreshold,
  CustomServiceSpecs,
  Env,
  Port,
  PrivateImageConfig,
} from "./interfaces";

interface CreateInstanceRequest {
  organizationId: string;
  uniqueTopicId: string;
  services: Array<ComputeServiceConfigurationDTO>;
  computeProvider: string;
  computeProjectName: string;
  computeProjectDescription: string;
  scalable: boolean;
  region: string;
}

interface ComputeServiceConfigurationDTO {
  name: string;
  image: string;
  tag: string;
  privateImageConfig?: PrivateImageConfig;
  serviceCount: number;
  buildImage: boolean;
  ports: Array<Port>;
  env: Array<Env>;
  command: Array<string>;
  args: Array<string>;
  akashMachineImageName: string;
  customServiceSpecs?: CustomServiceSpecs;
  healthCheck?: {
    path: string;
    port: number;
  };
  autoscalingRules?: AutoscalingRequestPayload;
  environmentVariables?: ClusterTemplateDeploymentVariable[];
  templateId?: string;
}

interface AutoscalingRequestPayload {
  minimumInstances: number;
  maximumInstances: number;
  plan: AutoscalingPlanEnum;
  timeWindow: AutoscalingTimeWindowEnum;
  scaleUp: AutoscalingRulesThreshold;
  scaleDown: AutoscalingRulesThreshold;
  cooldown: AutoscalingCooldownEnum;
  cancelAutoscaling?: boolean;
}

interface ClusterTemplateDeploymentVariable {
  label: string;
  value: string;
  isSecret: boolean;
}

interface CreateInstanceFromMarketplaceRequest {
  templateId: string;
  environmentVariables: MarketplaceDeploymentVariable[];
  organizationId: string;
  akashImageId: string;
  uniqueTopicId?: string;
  region: string;
  customInstanceSpecs?: CustomServiceSpecs;
  scalable: boolean;
  instanceCount?: number;
}

interface MarketplaceDeploymentVariable {
  label: string;
  value: string;
}

interface UpdateInstaceRequest {
  services: Array<ComputeServiceConfigurationDTO>;
  organizationId: string;
  uniqueTopicId: string;
}

export {
  CreateInstanceRequest,
  CreateInstanceFromMarketplaceRequest,
  MarketplaceDeploymentVariable,
  UpdateInstaceRequest,
  AutoscalingRequestPayload,
  ComputeServiceConfigurationDTO,
};
