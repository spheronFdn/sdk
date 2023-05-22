/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  MarketplaceDeploymentVariable,
  InstancesInfo as InstancesInfoCore,
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
  MarketplaceAppVariable,
  InstancesInfo,
  DomainTypeEnum,
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
    variables: input.serviceData.variables.map(
      (env): MarketplaceAppVariable => {
        return {
          defaultValue: env.defaultValue,
          key: env.label,
          required: env.required,
        };
      }
    ),
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
    agreedMachine: {
      machineName: input.agreedMachineImageType.machineType,
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
    type: coreDomain.type as DomainTypeEnum,
    instanceId: coreDomain.projectId,
  };
};

const mapInstanceDeployment = (
  input: InstanceOrderCore
): InstanceDeployment => {
  const urlList: Array<string> = [];
  if (input.urlPrewiew && input.urlPrewiew !== "") {
    urlList.push(input.urlPrewiew);
  }
  if (
    input.protocolData?.providerHost &&
    input.protocolData?.providerHost != ""
  ) {
    input.clusterInstanceConfiguration.ports.forEach((port) => {
      urlList.push(`${input.protocolData.providerHost}:${port.exposedPort}`);
    });
  }

  const env: EnvironmentVar[] = [];
  const secretEnv: EnvironmentVar[] = [];

  input.clusterInstanceConfiguration.env.forEach((ev: Env) => {
    if (ev.isSecret) {
      secretEnv.push({
        key: ev.value.split("=")[0],
        value: ev.value.split("=")[1],
      });
    } else {
      env.push({
        key: ev.value.split("=")[0],
        value: ev.value.split("=")[1],
      });
    }
  });

  return {
    id: input._id,
    type: input.type as DeploymentTypeEnum,
    status: input.status as DeploymentStatusEnum,
    buildTime: input.buildTime,
    instance: input.clusterInstance,
    instanceConfiguration: {
      image: input.clusterInstanceConfiguration.image,
      tag: input.clusterInstanceConfiguration.tag,
      ports: input.clusterInstanceConfiguration.ports,
      environmentVariables: env,
      secretEnvironmentVariables: secretEnv,
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
    connectionUrls: urlList,
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
      instanceCount: 1,
      buildImage: false,
      ports: input.configuration.ports,
      env: [
        ...mapVariables(input.configuration.environmentVariables, false),
        ...mapVariables(input.configuration.secretEnvironmentVariables, true),
      ],
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
    environmentVariables: input.environmentVariables.map(
      (env): MarketplaceDeploymentVariable => {
        return {
          label: env.key,
          value: env.value,
        };
      }
    ),
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
    env: [
      ...mapVariables(input.environmentVariables, false),
      ...mapVariables(input.secretEnvironmentVariables, true),
    ],
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
      computeCredit: (usage.usedClusterAkt! / 1000000) * tokenPrice,
      computeBuildExecution: usage.usedClusterBuildExecution!,
      numberOfRequests: usage.usedNumberOfRequests!,
      bandwidth: usage.usedBandwidth!,
      domains: usage.usedDomains!,
    },
    limit: {
      computeCredit: (usage.clusterAktLimit! / 1000000) * tokenPrice,
      computeBuildExecution: usage.clusterBuildExecutionLimit!,
      bandwidth: usage.bandwidthLimit!,
      domains: usage.domainsLimit!,
    },
  };
};

const mapInstancesInfo = (input: InstancesInfoCore): InstancesInfo => {
  return {
    provisioned: input.active,
    provisioning: input.starting,
    failedToProvision: input.failedToStart,
    closed: input.closed,
    total: input.total,
  };
};

const mapVariables = (
  variables: EnvironmentVar[],
  isSecret: boolean
): Env[] => {
  return variables.map((ev: EnvironmentVar) => ({
    value: `${ev.key}=${ev.value}`,
    isSecret,
  }));
};

const mapMarketplaceVariables = (
  variables: EnvironmentVar[],
  isSecret: boolean
): MarketplaceDeploymentVariable[] => {
  return variables.map((ev: EnvironmentVar) => ({
    label: ev.key,
    value: ev.value,
    isSecret,
  }));
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
  mapInstancesInfo,
};
