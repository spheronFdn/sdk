import {
  Organization as CoreOrganization,
  MarketplaceApp as MarketplaceAppCore,
  ComputeMachine as ComputeMachineCore,
  Cluster as ClusterCore,
  Instance as InstanceCore,
  InstanceOrder as InstanceOrderCore,
  Domain as CoreDomain,
  MarketplaceInstanceResponse as MarketplaceInstanceResponseCore,
  CreateInstanceRequest,
  CreateInstanceFromMarketplaceRequest,
  InstanceResponse as InstanceResponseCore,
  Env,
  UsageWithLimits as UsageWithLimitsCore,
  HealthCheck as HealthCheckCore,
  ExtendedInstance,
  ClusterProtocolEnum,
  ProviderEnum,
  UpdateInstaceRequest,
} from "@spheron/core";
import {
  InstanceDetailed,
  InstanceDeployment,
  DeploymentTypeEnum,
  EnvironmentVar,
  InstanceCreationConfig,
  MarketplaceInstanceCreationConfig,
  InstanceUpdateConfig,
  Organization,
  MarketplaceApp,
  ComputeMachine,
  Cluster,
  Instance,
  Domain,
  DeploymentStatusEnum,
  InstanceResponse,
  MarketplaceInstanceResponse,
  UsageWithLimits,
} from "./interfaces";

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

const mapMarketplaceApp = (input: MarketplaceAppCore): MarketplaceApp => {
  return {
    id: input._id,
    name: input.name,
    metadata: {
      description: input.metadata.description,
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

const mapComputeMachine = (input: ComputeMachineCore): ComputeMachine => {
  return {
    id: input._id,
    name: input.name,
    cpu: input.cpu,
    storage: input.storage,
    memory: input.memory,
  };
};

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

const mapClusterInstance = (input: InstanceCore): Instance => {
  return {
    id: input._id,
    state: input.state,
    name: input.name,
    deployments: input.orders,
    cluster: input.cluster,
    activeDeployment: input.activeOrder,
    latestUrlPreview: input.latestUrlPreview,
    agreedMachine: {
      machineType: input.agreedMachineImageType.machineType,
      agreementDate: input.agreedMachineImageType.agreementDate,
    },
    healthCheck: {
      path: input.healthCheck.url,
      port: input.healthCheck.port,
      status: input.healthCheck.status,
      timestamp: input.healthCheck.timestamp,
    },
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
    image: input.image,
    tag: input.tag,
  };
};

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

const mapInstanceDeployment = (
  input: InstanceOrderCore
): InstanceDeployment => {
  return {
    id: input._id,
    type: input.type as DeploymentTypeEnum,
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
      agreedMachine: {
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
    urlPrewiew: input.urlPrewiew ?? input.protocolData?.providerHost,
    deploymentInitiator: input.deploymentInitiator,
  };
};

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
    healthCheckUrl: input?.healthCheckConfig?.path,
    healthCheckPort: input?.healthCheckConfig?.port,
  };
};

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
