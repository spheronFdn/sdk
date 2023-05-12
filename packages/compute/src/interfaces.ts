import {
  Organization as CoreOrganization,
  MarketplaceApp as MarketplaceAppCore,
  ComputeMachine as ComputeMachineCore,
  Cluster as ClusterCore,
  Instance as InstanceCore,
  InstanceOrder as InstanceOrderCore,
  ExtendedInstance,
  MarketplaceAppPort,
  MarketplaceAppVariable,
  ProviderEnum,
  DomainTypeEnum,
  Domain as CoreDomain,
  MarketplaceCategoryEnum,
  ClusterStateEnum,
  InstanceStateEnum,
  HealthCheck,
  MachineImageType,
  DeploymentEnvironment,
  ClusterFundsUsage,
  InstancesInfo,
  MarketplaceInstanceResponse as MarketplaceInstanceResponseCore,
  CreateInstanceRequest,
  CreateInstanceFromMarketplaceRequest,
  EventHandler,
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse as InstanceResponseCore,
  ClusterProtocolEnum,
  MarketplaceDeploymentVariable,
  Port,
  Env,
  UsageWithLimits as UsageWithLimitsCore,
  EventTypeEnum,
  Event,
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

const mapOrganization = (input: CoreOrganization): Organization => {
  return {
    id: input._id,
    profile: {
      name: input.profile.name,
      username: input.profile.username,
      image: input.profile.image,
    },
  };
};

interface MarketplaceApp {
  id: string;
  name: string;
  metadata: {
    description: string;
    icon: string;
    image: string;
    docsLink: string;
    websiteLink: string;
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

const mapMarketplaceApp = (input: MarketplaceAppCore): MarketplaceApp => {
  return {
    id: input._id,
    name: input.name,
    metadata: {
      description: input.metadata.description,
      icon: input.metadata.icon,
      image: input.metadata.image,
      docsLink: input.metadata.docsLink,
      websiteLink: input.metadata.websiteLink,
      category: input.metadata.category,
    },
    serviceData: {
      dockerImage: input.serviceData.dockerImage,
      dockerImageTag: input.serviceData.dockerImageTag,
      provider: input.serviceData.provider,
      variables: input.serviceData.variables,
      ports: input.serviceData.ports,
      commands: input.serviceData.commands,
      args: input.serviceData.args,
    },
  };
};

interface ComputeMachine {
  id: string;
  name: string;
  cpu: number;
  storage: string;
  memory: string;
}

const mapComputeMachine = (input: ComputeMachineCore): ComputeMachine => {
  return {
    id: input._id,
    name: input.name,
    cpu: input.cpu,
    storage: input.storage,
    memory: input.memory,
  };
};

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

const mapCluster = (input: ClusterCore): Cluster => {
  return {
    id: input._id,
    name: input.name,
    url: input.url,
    proivder: input.proivder,
    createdBy: input.createdBy,
    state: input.state,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
};

interface Instance {
  id: string;
  state: InstanceStateEnum;
  name: string;
  deployments: Array<string>;
  cluster: string;
  activeDeployment: string;
  latestUrlPreview: string;
  agreedMachineImageType: MachineImageType;
  retrievableAkt: number;
  withdrawnAkt: number;
  healthCheck: HealthCheck;
  createdAt: Date;
  updatedAt: Date;
}

interface InstanceDetailed extends Instance {
  cpu: number;
  memory: string;
  storage: string;
  ami: string;
  image: string;
  tag: string;
}

const mapClusterInstance = (input: InstanceCore): Instance => {
  return {
    id: input._id,
    state: input.state,
    name: input.name,
    deployments: input.orders,
    cluster: input.cluster,
    activeDeployment: input.activeOrder,
    latestUrlPreview: input.latestUrlPreview,
    agreedMachineImageType: input.agreedMachineImageType,
    retrievableAkt: input.retrievableAkt,
    withdrawnAkt: input.withdrawnAkt,
    healthCheck: input.healthCheck,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
};

const mapExtendedClusterInstance = (
  input: ExtendedInstance
): InstanceDetailed => {
  const baseClusterInstance = mapClusterInstance(input);

  return {
    ...baseClusterInstance,
    cpu: input.cpu,
    memory: input.memory,
    storage: input.storage,
    ami: input.ami,
    image: input.image,
    tag: input.tag,
  };
};

interface Domain {
  id: string;
  name: string;
  verified: boolean;
  link: string;
  type: DomainTypeEnum;
  projectId: string;
  deploymentEnvironmentIds: DeploymentEnvironment[];
}

const mapDomain = (coreDomain: CoreDomain): Domain => {
  return {
    id: coreDomain._id,
    name: coreDomain.name,
    verified: coreDomain.verified,
    link: coreDomain.link,
    type: coreDomain.type,
    projectId: coreDomain.projectId,
    deploymentEnvironmentIds: coreDomain.deploymentEnvironmentIds,
  };
};

enum DeploymentStatusEnum {
  QUEUED = "Queued",
  PENDING = "Pending",
  DEPLOYED = "Deployed",
  FAILED = "Failed",
  DEPRECATED = "Deprecated",
  DEPRECATED_PROVIDER = "Deprecated-Provider",
}

interface InstanceDeployment {
  id: string;
  type: string;
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
    agreedMachineImage: {
      machineType: string;
      agreementDate: number;
      cpu: number;
      memory: string;
      storage: string;
      persistentStorage?: PersistentStorage;
    };
  };
}

const mapInstanceDeployment = (
  input: InstanceOrderCore
): InstanceDeployment => {
  return {
    id: input._id,
    type: input.type,
    commitId: input.commitId,
    status: input.status as DeploymentStatusEnum,
    buildTime: input.buildTime,
    logs: input.logs,
    closingLogs: input.closingLogs,
    clusterLogs: input.clusterLogs,
    clusterEvents: input.clusterEvents,
    instance: input.clusterInstance,
    instanceConfiguration: {
      image: input.clusterInstanceConfiguration.image,
      tag: input.clusterInstanceConfiguration.tag,
      instanceCount: input.clusterInstanceConfiguration.instanceCount,
      ports: input.clusterInstanceConfiguration.ports,
      env: input.clusterInstanceConfiguration.env.map(
        (ev: Env): EnvironmentVar => {
          return {
            key: ev.value.split("=")[0],
            value: ev.value.split("=")[1],
            isSecret: ev.isSecret,
          };
        }
      ),
      commands: input.clusterInstanceConfiguration.command,
      args: input.clusterInstanceConfiguration.args,
      region: input.clusterInstanceConfiguration.region,
      agreedMachineImage: {
        machineType:
          input.clusterInstanceConfiguration.agreedMachineImage.machineType,
        agreementDate:
          input.clusterInstanceConfiguration.agreedMachineImage.agreementDate,
        cpu: input.clusterInstanceConfiguration.agreedMachineImage.cpu,
        memory: input.clusterInstanceConfiguration.agreedMachineImage.memory,
        storage: input.clusterInstanceConfiguration.agreedMachineImage.storage,
        persistentStorage:
          input.clusterInstanceConfiguration.agreedMachineImage
            .persistentStorage,
      },
    },
    urlPrewiew: input.urlPrewiew,
    deploymentInitiator: input.deploymentInitiator,
  };
};

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
  topicId?: string;
  clusterName: string;
  healthCheckPath: string;
  healthCheckPort: number;
}

interface EnvironmentVar {
  key: string;
  value: string;
  isSecret: boolean;
}

const mapCreateInstanceRequest = (
  input: InstanceCreationConfig,
  organizationId: string
): CreateInstanceRequest => {
  return {
    organizationId,
    uniqueTopicId: input.topicId,
    configuration: {
      folderName: "",
      protocol: ClusterProtocolEnum.AKASH,
      image: input.configuration.image,
      tag: input.configuration.tag,
      instanceCount: input.configuration.instanceCount,
      buildImage: false,
      ports: input.configuration.ports,
      env: input.configuration.env.map((ev: EnvironmentVar): Env => {
        return {
          value: `${ev.key}=${ev.value}`,
          isSecret: ev.isSecret,
        };
      }),
      command: input.configuration.commands,
      args: input.configuration.args,
      region: input.configuration.region,
      akashMachineImageName: input.configuration.machineImageName,
    },
    clusterUrl: input.configuration.image,
    clusterProvider: ProviderEnum.DOCKERHUB,
    clusterName: input.clusterName,
    healthCheckUrl: input.healthCheckPath,
    healthCheckPort: input.healthCheckPort,
  };
};

interface MarketplaceInstanceCreationConfig {
  marketplaceAppId: string;
  environmentVariables: MarketplaceDeploymentVariable[];
  machineImageId: string;
  topicId?: string;
  region: string;
}

const mapMarketplaceInstanceCreationConfig = (
  input: MarketplaceInstanceCreationConfig,
  organizationId: string
): CreateInstanceFromMarketplaceRequest => {
  return {
    templateId: input.marketplaceAppId,
    environmentVariables: input.environmentVariables,
    organizationId: organizationId,
    akashImageId: input.machineImageId,
    uniqueTopicId: input.topicId,
    region: input.region,
  };
};

interface InstanceResponse {
  clusterId: string;
  instanceId: string;
  instanceDeploymentId: string;
  topicId: string;
}
interface MarketplaceInstanceResponse extends InstanceResponse {
  marketplaceApp: MarketplaceApp;
  marketplaceAppId: string;
}

const mapInstanceResponse = (input: InstanceResponseCore): InstanceResponse => {
  return {
    clusterId: input.clusterId,
    instanceId: input.clusterInstanceId,
    instanceDeploymentId: input.clusterInstanceOrderId,
    topicId: input.topic,
  };
};

const mapMarketplaceInstanceResponse = (
  input: MarketplaceInstanceResponseCore
): MarketplaceInstanceResponse => {
  const baseInstanceResponse = mapInstanceResponse(input);

  return {
    ...baseInstanceResponse,
    marketplaceApp: mapMarketplaceApp(input.template),
    marketplaceAppId: input.templateId,
  };
};

interface InstanceUpdateConfig {
  env: Array<EnvironmentVar>;
  commands: Array<string>;
  args: Array<string>;
  topicId: string;
  tag: string;
}

const mapInstanceUpdateRequest = (
  input: InstanceUpdateConfig
): UpdateInstaceRequest => {
  return {
    env: input.env.map((ev: EnvironmentVar): Env => {
      return {
        value: `${ev.key}=${ev.value}`,
        isSecret: ev.isSecret,
      };
    }),
    command: input.commands,
    args: input.args,
    uniqueTopicId: input.topicId,
    tag: input.tag,
  };
};

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

const mapUsageWithLimits = (usage: UsageWithLimitsCore): UsageWithLimits => {
  return {
    used: {
      bandwidth: usage.usedBandwidth,
      buildExecution: usage.usedBuildExecution,
      concurrentBuild: usage.usedConcurrentBuild,
      storageArweave: usage.usedStorageArweave,
      storageIPFS: usage.usedStorageIPFS,
      deploymentsPerDay: usage.usedDeploymentsPerDay,
      domains: usage.usedDomains,
      hnsDomains: usage.usedHnsDomains,
      ensDomains: usage.usedEnsDomains,
      environments: usage.usedEnvironments,
      numberOfRequests: usage.usedNumberOfRequests,
      passwordProtection: usage.usedPasswordProtections,
    },
    limit: {
      bandwidth: usage.bandwidthLimit,
      buildExecution: usage.buildExecutionLimit,
      concurrentBuild: usage.concurrentBuildLimit,
      storageArweave: usage.storageArweaveLimit,
      storageIPFS: usage.storageIPFSLimit,
      deploymentsPerDay: usage.deploymentsPerDayLimit,
      domains: usage.domainsLimit,
      hnsDomains: usage.hnsDomainsLimit,
      ensDomains: usage.ensDomainsLimit,
      environments: usage.environmentsLimit,
      membersLimit: usage.membersLimit,
    },
  };
};

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
  mapDomain,
  mapCluster,
  mapOrganization,
  mapMarketplaceApp,
  mapComputeMachine,
  mapInstanceDeployment,
  mapClusterInstance,
  mapExtendedClusterInstance,
  mapCreateInstanceRequest,
  mapInstanceUpdateRequest,
  mapMarketplaceInstanceCreationConfig,
  mapInstanceResponse,
  mapMarketplaceInstanceResponse,
  mapUsageWithLimits,
};
