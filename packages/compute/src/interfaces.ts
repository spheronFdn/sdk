import {
  Organization as CoreOrganization,
  DeploymentEnvironment as CoreDeploymentEnvironment,
  MarketplaceApp as MarketplaceAppCore,
  ComputeMachine as ComputeMachineCore,
  Cluster as ClusterCore,
  ClusterInstance as ClusterInstanceCore,
  ClusterInstanceOrder as ClusterInstanceOrderCore,
  ExtendedClusterInstance,
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
  ClusterInstancesInfo as InstancesInfo,
  MarketplaceInstanceResponse as MarketplaceInstanceResponseCore,
  CreateInstanceRequest,
  CreateInstanceFromMarketplaceRequest,
  EventProcessingFunction,
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse as InstanceResponseCore,
  ClusterProtocolEnum,
  MarketplaceDeploymentVariable,
  Port,
  Env,
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
  activeDeployments: string;
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

const mapClusterInstance = (input: ClusterInstanceCore): Instance => {
  return {
    id: input._id,
    state: input.state,
    name: input.name,
    deployments: input.orders,
    cluster: input.cluster,
    activeDeployments: input.activeOrder,
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
  input: ExtendedClusterInstance
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
  input: ClusterInstanceOrderCore
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
  uniqueTopicId?: string;
  configuration: {
    branch?: string;
    folderName: string;
    protocol: ClusterProtocolEnum;
    image: string;
    tag: string;
    instanceCount: number;
    buildImage: boolean;
    ports: Array<Port>;
    env: Array<EnvironmentVar>;
    command: Array<string>;
    args: Array<string>;
    region: string;
    machineImageName: string;
  };
  instanceName?: string;
  clusterUrl: string;
  clusterProvider: string;
  clusterName: string;
  healthCheckUrl: string;
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
      branch: input.configuration.branch,
      folderName: input.configuration.folderName,
      protocol: input.configuration.protocol,
      image: input.configuration.image,
      tag: input.configuration.tag,
      instanceCount: input.configuration.instanceCount,
      buildImage: input.configuration.buildImage,
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
    instanceName: input.instanceName,
    clusterUrl: input.clusterUrl,
    clusterProvider: input.clusterProvider,
    clusterName: input.clusterName,
    healthCheckUrl: input.healthCheckUrl,
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
  mapOrganization,
  MarketplaceApp,
  MarketplaceAppPort,
  MarketplaceAppVariable,
  mapMarketplaceApp,
  ComputeMachine,
  mapComputeMachine,
  Cluster,
  ClusterStateEnum,
  mapCluster,
  Instance,
  InstanceDetailed,
  mapClusterInstance,
  mapExtendedClusterInstance,
  Domain,
  DomainTypeEnum,
  mapDomain,
  InstanceDeployment,
  mapInstanceDeployment,
  ClusterFundsUsage,
  InstancesInfo,
  MarketplaceInstanceResponse,
  EventProcessingFunction,
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse,
  ClusterProtocolEnum,
  ProviderEnum,
  InstanceStateEnum,
  InstanceCreationConfig,
  EnvironmentVar,
  mapCreateInstanceRequest,
  MarketplaceInstanceCreationConfig,
  mapMarketplaceInstanceCreationConfig,
  mapInstanceResponse,
  mapMarketplaceInstanceResponse,
};
