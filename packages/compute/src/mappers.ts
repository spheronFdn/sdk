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
import { v4 as uuidv4 } from "uuid";

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
    description: input.metadata.description,
    category: input.metadata.category,
    variables: input.serviceData.variables,
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
      machineName: input.agreedMachineImageType.machineName,
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
    instanceId: coreDomain.projectId,
  };
};

const mapInstanceDeployment = (
  input: InstanceOrderCore
): InstanceDeployment => {
  return {
    id: input._id,
    type: input.type as DeploymentTypeEnum,
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
      scale: input.clusterInstanceConfiguration.instanceCount,
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
        machineName:
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
  organizationId: string,
  machineImageName: string
): CreateInstanceRequest => {
  return {
    organizationId,
    uniqueTopicId: uuidv4(),
    configuration: {
      folderName: "",
      protocol: ClusterProtocolEnum.AKASH,
      image: input.configuration.image,
      tag: input.configuration.tag,
      instanceCount: input.configuration.scale,
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
      akashMachineImageName: machineImageName,
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
    uniqueTopicId: uuidv4(),
    region: input.region,
  };
};

const mapInstanceResponse = (input: InstanceResponseCore): InstanceResponse => {
  return {
    clusterId: input.clusterId,
    instanceId: input.clusterInstanceId,
    instanceDeploymentId: input.clusterInstanceOrderId,
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
    uniqueTopicId: uuidv4(),
    tag: input.tag,
  };
};

const mapUsageWithLimits = (
  usage: UsageWithLimitsCore,
  tokenPrice: number
): UsageWithLimits => {
  return {
    used: {
      computeCredit: usage.usedClusterAkt
        ? (usage.usedClusterAkt / 1000000) * tokenPrice
        : 0,
      computeBuildExecution: usage.usedClusterBuildExecution,
      numberOfRequests: usage.usedNumberOfRequests,
      bandwidth: usage.usedBandwidth,
      domains: usage.usedDomains,
    },
    limit: {
      computeCredit: usage.clusterAktLimit
        ? (usage.clusterAktLimit / 1000000) * tokenPrice
        : 0,
      computeBuildExecution: usage.clusterBuildExecutionLimit,
      bandwidth: usage.bandwidthLimit,
      domains: usage.domainsLimit,
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
