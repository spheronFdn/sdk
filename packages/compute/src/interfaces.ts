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
  ClusterInstanceStateEnum,
  HealthCheck,
  MachineImageType,
  DeploymentEnvironment,
  ClusterFundsUsage,
  ClusterInstancesInfo,
  MarketplaceInstanceResponse,
  CreateInstanceRequest,
  CreateInstanceFromMarketplaceRequest,
  EventProcessingFunction,
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse,
  ClusterProtocolEnum,
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

interface ClusterInstance {
  id: string;
  state: ClusterInstanceStateEnum;
  name: string;
  orders: Array<string>;
  cluster: string;
  activeOrder: string;
  latestUrlPreview: string;
  agreedMachineImageType: MachineImageType;
  retrievableAkt: number;
  withdrawnAkt: number;
  healthCheck: HealthCheck;
  createdAt: Date;
  updatedAt: Date;
}

interface ClusterInstanceExtendedInfo extends ClusterInstance {
  cpu: number;
  memory: string;
  storage: string;
  ami: string;
  image: string;
  tag: string;
}

const mapClusterInstance = (input: ClusterInstanceCore): ClusterInstance => {
  return {
    id: input._id,
    state: input.state,
    name: input.name,
    orders: input.orders,
    cluster: input.cluster,
    activeOrder: input.activeOrder,
    latestUrlPreview: input.latestUrlPreview,
    agreedMachineImageType: input.agreedMachineImageType,
    retrievableAkt: input.retrievableAkt,
    withdrawnAkt: input.withdrawnAkt,
    healthCheck: input.healthCheck,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
};

const mapClusterInstanceExtendedInfo = (
  input: ExtendedClusterInstance
): ClusterInstanceExtendedInfo => {
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

interface ClusterInstanceOrder {
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
  clusterInstance: string;
  clusterInstanceConfiguration: string;
  urlPrewiew: string;
  deploymentInitiator: string;
}

const mapClusterInstanceOrder = (
  input: ClusterInstanceOrderCore
): ClusterInstanceOrder => {
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
    clusterInstance: input.clusterInstance,
    clusterInstanceConfiguration: input.clusterInstanceConfiguration,
    urlPrewiew: input.urlPrewiew,
    deploymentInitiator: input.deploymentInitiator,
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
  ClusterInstance,
  ClusterInstanceExtendedInfo,
  mapClusterInstance,
  mapClusterInstanceExtendedInfo,
  Domain,
  DomainTypeEnum,
  mapDomain,
  ClusterInstanceOrder,
  mapClusterInstanceOrder,
  ClusterFundsUsage,
  ClusterInstancesInfo,
  MarketplaceInstanceResponse,
  CreateInstanceRequest,
  EventProcessingFunction,
  InstanceLogType,
  UpdateInstaceRequest,
  InstanceResponse,
  CreateInstanceFromMarketplaceRequest,
  ClusterProtocolEnum,
  ProviderEnum,
  ClusterInstanceStateEnum,
};
