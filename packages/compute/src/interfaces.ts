import {
  MarketplaceAppPort,
  ProviderEnum,
  MarketplaceCategoryEnum,
  ClusterStateEnum,
  InstanceStateEnum,
  ClusterFundsUsage,
  InstanceLogType,
  UpdateInstaceRequest,
  ClusterProtocolEnum,
  Port,
  HealthStatusEnum,
  PersistentStorage,
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
  description: string;
  category: MarketplaceCategoryEnum;
  variables: MarketplaceAppVariable[];
}

interface MarketplaceAppVariable {
  defaultValue: string;
  key: string;
  required?: string;
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
  agreedMachine: MachineImageType;
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
  instanceId: string;
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
  status: DeploymentStatusEnum;
  buildTime: number;
  instance: string;
  connectionUrls: Array<string>;
  deploymentInitiator: string;
  instanceConfiguration: {
    image: string;
    tag: string;
    ports: Array<Port>;
    environmentVariables: Array<EnvironmentVariable>;
    secretEnvironmentVariables: Array<EnvironmentVariable>;
    commands: Array<string>;
    args: Array<string>;
    region: string;
    agreedMachine: MachineImageType;
  };
}

interface MachineImageType {
  machineName: string;
  agreementDate: number;
  cpu?: number;
  memory?: string;
  storage?: string;
  persistentStorage?: PersistentStorage;
}

interface InstanceCreationConfig {
  configuration: {
    image: string;
    tag: string;
    ports: Array<Port>;
    environmentVariables: Array<EnvironmentVariable>;
    secretEnvironmentVariables: Array<EnvironmentVariable>;
    commands: Array<string>;
    args: Array<string>;
    region: string;
    machineImageId: string;
  };
  clusterName: string;
  healthCheckConfig?: {
    path: string;
    port: number;
  };
}

interface EnvironmentVariable {
  key: string;
  value: string;
}

interface MarketplaceInstanceCreationConfig {
  marketplaceAppId: string;
  environmentVariables: EnvironmentVariable[];
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
  environmentVariables: Array<EnvironmentVariable>;
  secretEnvironmentVariables: Array<EnvironmentVariable>;
  commands: Array<string>;
  args: Array<string>;
  tag: string;
}

interface UsageWithLimits {
  used: {
    computeCredit: number; // price in usd
    computeBuildExecution: number; // Seconds
    numberOfRequests: number;
    bandwidth: number;
    domains: number;
  };
  limit: {
    computeCredit: number; // Bytes
    computeBuildExecution: number; // Seconds
    bandwidth: number;
    domains: number;
  };
}

interface InstancesInfo {
  provisioned: number;
  provisioning: number;
  failedToProvision: number;
  closed: number;
  total: number;
}

enum DomainTypeEnum {
  DOMAIN,
  SUBDOMAIN,
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
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse,
  ClusterProtocolEnum,
  ProviderEnum,
  InstanceStateEnum,
  InstanceCreationConfig,
  InstanceUpdateConfig,
  EnvironmentVariable as EnvironmentVar,
  MarketplaceInstanceCreationConfig,
  DeploymentStatusEnum,
  DeploymentTypeEnum,
};
