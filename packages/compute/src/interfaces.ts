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
  UsageWithLimits,
  EventTypeEnum,
  Event,
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
  maxPricePerBlock: number;
}

const mapComputeMachine = (input: ComputeMachineCore): ComputeMachine => {
  return {
    id: input._id,
    name: input.name,
    cpu: input.cpu,
    storage: input.storage,
    memory: input.memory,
    maxPricePerBlock: input.maxPricePerBlock,
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

interface InstanceDeployment {
  id: string;
  type: string;
  commitId: string;
  status: string;
  buildTime: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: any;
  logs: [{ time: string; log: Array<string> }];
  closingLogs: [{ time: string; log: string }];
  clusterLogs: Array<string>;
  clusterEvents: Array<string>;
  instance: string;
  instanceConfiguration: string;
  urlPrewiew: string;
  deploymentInitiator: string;
}

const mapInstanceDeployment = (
  input: InstanceOrderCore
): InstanceDeployment => {
  return {
    id: input._id,
    type: input.type,
    commitId: input.commitId,
    status: input.status,
    buildTime: input.buildTime,
    env: input.env,
    logs: input.logs,
    closingLogs: input.closingLogs,
    clusterLogs: input.clusterLogs,
    clusterEvents: input.clusterEvents,
    instance: input.clusterInstance,
    instanceConfiguration: input.clusterInstanceConfiguration,
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
    command: Array<string>;
    args: Array<string>;
    region: string;
    machineImageName: string;
  };
  uniqueTopicId?: string;
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
    uniqueTopicId: input.uniqueTopicId,
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
      command: input.configuration.command,
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
  templateId: string;
  environmentVariables: MarketplaceDeploymentVariable[];
  machineImageId: string;
  uniqueTopicId?: string;
  region: string;
}

const mapMarketplaceInstanceCreationConfig = (
  input: MarketplaceInstanceCreationConfig,
  organizationId: string
): CreateInstanceFromMarketplaceRequest => {
  return {
    templateId: input.templateId,
    environmentVariables: input.environmentVariables,
    organizationId: organizationId,
    akashImageId: input.machineImageId,
    uniqueTopicId: input.uniqueTopicId,
    region: input.region,
  };
};

interface InstanceResponse {
  clusterId: string;
  instanceId: string;
  instanceDeploymentId: string;
  topic: string;
}
interface MarketplaceInstanceResponse extends InstanceResponse {
  template: MarketplaceApp;
  templateId: string;
}

const mapInstanceResponse = (input: InstanceResponseCore): InstanceResponse => {
  return {
    clusterId: input.clusterId,
    instanceId: input.clusterInstanceId,
    instanceDeploymentId: input.clusterInstanceOrderId,
    topic: input.topic,
  };
};

const mapMarketplaceInstanceResponse = (
  input: MarketplaceInstanceResponseCore
): MarketplaceInstanceResponse => {
  const baseInstanceResponse = mapInstanceResponse(input);

  return {
    ...baseInstanceResponse,
    template: mapMarketplaceApp(input.template),
    templateId: input.templateId,
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
  EnvironmentVar,
  MarketplaceInstanceCreationConfig,
  mapDomain,
  mapCluster,
  mapOrganization,
  mapMarketplaceApp,
  mapComputeMachine,
  mapInstanceDeployment,
  mapClusterInstance,
  mapExtendedClusterInstance,
  mapCreateInstanceRequest,
  mapMarketplaceInstanceCreationConfig,
  mapInstanceResponse,
  mapMarketplaceInstanceResponse,
};
