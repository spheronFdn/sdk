import {
  MarketplaceAppPort,
  MarketplaceAppVariable,
  ProviderEnum,
  DomainTypeEnum,
  MarketplaceCategoryEnum,
  ClusterStateEnum,
  InstanceStateEnum,
  MachineImageType,
  DeploymentEnvironment,
  ClusterFundsUsage,
  InstancesInfo,
  EventHandler,
  InstanceLogType,
  UpdateInstaceRequest,
  ClusterProtocolEnum,
  MarketplaceDeploymentVariable,
  Port,
  EventTypeEnum,
  Event,
  HealthStatusEnum,
} from "@spheron/core";

interface Organization {
  id: string;
  profile: {
    name: string;
    username: string;
    image: string;
  };
}

interface MarketplaceApp {
  id: string;
  name: string;
  metadata: {
    description: string;
    category: MarketplaceCategoryEnum;
  };
  serviceData: {
    dockerImage: string;
    dockerImageTag: string;
    provider: string;
    variables: MarketplaceAppVariable[];
    ports: MarketplaceAppPort[];
    commands: string[];
    args: string[];
  };
}

interface ComputeMachine {
  id: string;
  name: string;
  cpu: number;
  storage: string;
  memory: string;
}

interface Cluster {
  id: string;
  name: string;
  url: string;
  proivder: ProviderEnum;
  createdBy: string;
  state: ClusterStateEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface Instance {
  id: string;
  state: InstanceStateEnum;
  name: string;
  deployments: Array<string>;
  cluster: string;
  activeDeployment: string;
  latestUrlPreview: string;
  agreedMachine: {
    machineType: string;
    agreementDate: number;
  };
  healthCheck: HealthCheck;
  createdAt: Date;
  updatedAt: Date;
}

interface InstanceDetailed extends Instance {
  cpu: number;
  memory: string;
  storage: string;
  image: string;
  tag: string;
}

interface HealthCheck {
  path: string;
  port?: Port;
  status?: HealthStatusEnum;
  timestamp?: Date;
}

interface Domain {
  id: string;
  name: string;
  verified: boolean;
  link: string;
  type: DomainTypeEnum;
  projectId: string;
  deploymentEnvironmentIds: DeploymentEnvironment[];
}

enum DeploymentStatusEnum {
  QUEUED = "Queued",
  PENDING = "Pending",
  DEPLOYED = "Deployed",
  FAILED = "Failed",
  DEPRECATED = "Deprecated",
  DEPRECATED_PROVIDER = "Deprecated-Provider",
}

enum DeploymentTypeEnum {
  DEPLOY = "DEPLOY",
  UPDATE = "UPDATE",
}

interface InstanceDeployment {
  id: string;
  type: DeploymentTypeEnum;
  commitId: string;
  status: DeploymentStatusEnum;
  buildTime: number;
  logs: [{ time: string; log: Array<string> }];
  closingLogs: [{ time: string; log: string }];
  clusterLogs: Array<string>;
  clusterEvents: Array<string>;
  instance: string;
  urlPrewiew: string;
  deploymentInitiator: string;
  instanceConfiguration: {
    image: string;
    tag: string;
    instanceCount: number;
    ports: Array<Port>;
    env: Array<EnvironmentVar>;
    commands: Array<string>;
    args: Array<string>;
    region: string;
    agreedMachine: MachineImageType;
  };
}

interface InstanceCreationConfig {
  configuration: {
    image: string;
    tag: string;
    instanceCount: number;
    ports: Array<Port>;
    env: Array<EnvironmentVar>;
    commands: Array<string>;
    args: Array<string>;
    region: string;
    machineImageName: string;
  };
  clusterName: string;
  healthCheckConfig?: {
    path: string;
    port: number;
  };
}

interface EnvironmentVar {
  key: string;
  value: string;
  isSecret: boolean;
}

interface MarketplaceInstanceCreationConfig {
  marketplaceAppId: string;
  environmentVariables: MarketplaceDeploymentVariable[];
  machineImageId: string;
  region: string;
}

interface InstanceResponse {
  clusterId: string;
  instanceId: string;
  instanceDeploymentId: string;
}

interface MarketplaceInstanceResponse extends InstanceResponse {
  marketplaceApp: MarketplaceApp;
  marketplaceAppId: string;
}

interface InstanceUpdateConfig {
  env: Array<EnvironmentVar>;
  commands: Array<string>;
  args: Array<string>;
  tag: string;
}

interface UsageWithLimits {
  used: {
    bandwidth?: number; // Bytes
    buildExecution?: number; // Seconds
    concurrentBuild?: number;
    storageArweave?: number; // Bytes
    storageIPFS?: number; // Bytes
    deploymentsPerDay?: number;
    domains?: number;
    hnsDomains?: number;
    ensDomains?: number;
    environments?: number;
    numberOfRequests?: number;
    passwordProtection?: number;
  };
  limit: {
    bandwidth?: number; // Bytes
    buildExecution?: number; // Seconds
    concurrentBuild?: number;
    storageArweave?: number; // Bytes
    storageIPFS?: number; // Bytes
    deploymentsPerDay?: number;
    domains?: number;
    hnsDomains?: number;
    ensDomains?: number;
    environments?: number;
    membersLimit?: number;
  };
}

export {
  Organization,
  MarketplaceApp,
  MarketplaceAppPort,
  UsageWithLimits,
  MarketplaceAppVariable,
  ComputeMachine,
  Cluster,
  ClusterStateEnum,
  Instance,
  InstanceDetailed,
  Domain,
  DomainTypeEnum,
  InstanceDeployment,
  ClusterFundsUsage,
  InstancesInfo,
  MarketplaceInstanceResponse,
  EventHandler,
  Event,
  EventTypeEnum,
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse,
  ClusterProtocolEnum,
  ProviderEnum,
  InstanceStateEnum,
  InstanceCreationConfig,
  InstanceUpdateConfig,
  EnvironmentVar,
  MarketplaceInstanceCreationConfig,
  DeploymentStatusEnum,
  DeploymentTypeEnum,
};
