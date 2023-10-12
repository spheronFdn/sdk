import {
  AppTypeEnum,
  Cluster,
  ClusterProtocolEnum,
  ComputeMachine,
  CreateInstanceRequest,
  CustomInstanceSpecs,
  Deployment,
  DeploymentEnvironment,
  DeploymentStatusEnum,
  Domain,
  Env,
  ExtendedInstance,
  Instance,
  InstanceLogType,
  InstanceOrder,
  InstanceOrderLogs,
  InstanceResponse,
  MarketplaceApp,
  Organization,
  PersistentStorageClassEnum,
  Project,
  ShellExecutionResponse,
  SpheronApi,
  UpdateInstaceRequest,
  User,
  VerifiedTokenResponse,
} from "@spheron/core";
import configuration from "../configuration";
import { IGPTResponse } from "../commands/gpt/gpt";
import Spinner from "../outputs/spinner";
import MetadataService from "./metadata-service";
import {
  CliComputeEnv,
  CliCustomParams,
  InstanceVersionLogsTypeEnum,
  CliPersistentStorageTypesEnum,
  SpheronComputeConfiguration,
  CliComputeInstanceType,
} from "../commands/compute/interfaces";
import { v4 as uuidv4 } from "uuid";

const SpheronApiService = {
  async initialize(): Promise<SpheronApi> {
    const jwtToken = await MetadataService.getJwtToken();
    const client = jwtToken
      ? new SpheronApi(jwtToken, configuration.spheronServerAddress)
      : new SpheronApi("", configuration.spheronServerAddress);
    return client;
  },

  async verfiyGitToken(
    provider: string,
    code: string,
    port: number
  ): Promise<VerifiedTokenResponse> {
    const client: SpheronApi = await this.initialize();
    const result: VerifiedTokenResponse = await client.verfiyGitToken(
      provider,
      String(code),
      port
    );
    return result;
  },

  async createOrganization(
    username: string,
    name: string,
    appType: AppTypeEnum
  ): Promise<Organization> {
    const client: SpheronApi = await this.initialize();
    const organization: Organization = await client.createOrganization(
      username,
      name,
      appType
    );
    return organization;
  },

  async getOrganization(id: string): Promise<Organization> {
    const client: SpheronApi = await this.initialize();
    const organization: Organization = await client.getOrganization(id);
    return organization;
  },

  async getProfile(): Promise<User> {
    const client: SpheronApi = await this.initialize();
    const user: User = await client.getProfile();
    return user;
  },

  async getOrganizationProjects(
    id: string,
    skip?: number,
    limit?: number,
    state?: string
  ): Promise<Project[]> {
    const client: SpheronApi = await this.initialize();
    const options: any = {
      skip: 0,
      limit: 100,
    };
    if (skip) {
      options.skip = skip;
    }
    if (limit) {
      options.limit = limit;
    }
    if (state) {
      options.state = state;
    }
    const projects: Project[] = await client.getOrganizationProjects(
      id,
      options
    );
    return projects;
  },

  async getDeployment(id: string): Promise<Deployment> {
    const client: SpheronApi = await this.initialize();
    const deployment: Deployment = await client.getDeployment(id);
    return deployment;
  },

  async getProjectDeployments(
    projectId: string,
    skip?: number,
    limit?: number,
    status?: DeploymentStatusEnum
  ): Promise<Deployment[]> {
    const client: SpheronApi = await this.initialize();
    const options: any = {
      skip: 0,
      limit: 10,
    };
    if (skip) {
      options.skip = skip;
    }
    if (limit) {
      options.limit = limit;
    }
    if (status) {
      options.status = status;
    }
    const projectDeployments = await client.getProjectDeployments(
      projectId,
      options
    );
    return projectDeployments.deployments;
  },

  async getProject(id: string): Promise<Project> {
    const client: SpheronApi = await this.initialize();
    const project: Project = await client.getProject(id);
    return project;
  },

  async getProjectDomains(projectId: string): Promise<Domain[]> {
    const client: SpheronApi = await this.initialize();
    const result = await client.getProjectDomains(projectId);
    return result.domains;
  },

  async getProjectDeploymentEnvironments(
    projectId: string
  ): Promise<DeploymentEnvironment[]> {
    const client: SpheronApi = await this.initialize();
    const deploymentEnvironments: DeploymentEnvironment[] =
      await client.getDeploymentEnvironments(projectId);
    return deploymentEnvironments;
  },

  async getComputePlans(name?: string): Promise<ComputeMachine[]> {
    const client: SpheronApi = await this.initialize();
    console.log(client, "speron-api file");
    const options: any = {
      skip: 0,
      limit: 50,
    };
    if (name) {
      options.searchString = name;
    }
    console.log("here");
    const computePlans: ComputeMachine[] = await client.getComputeMachines(
      options
    );
    console.log("hello");
    return computePlans;
  },

  async getComputeRegions(): Promise<string[]> {
    const client: SpheronApi = await this.initialize();
    const regions: string[] = await client.getComputeMachineRegions();
    return regions;
  },

  async getClusters(organizationId: string): Promise<Cluster[]> {
    const client: SpheronApi = await this.initialize();
    const options: any = {
      skip: 0,
      limit: 50,
    };
    const clusters: Cluster[] = await client.getOrganizationClusters(
      organizationId,
      options
    );
    return clusters;
  },

  async getCluster(id: string): Promise<Cluster> {
    const client: SpheronApi = await this.initialize();
    const clusters: Cluster = await client.getCluster(id);
    return clusters;
  },

  async getClusterInstances(clusterId: string): Promise<ExtendedInstance[]> {
    const client: SpheronApi = await this.initialize();
    const options: any = {
      skip: 0,
      limit: 50,
      includeReport: true,
    };
    const instances: ExtendedInstance[] = await client.getClusterInstances(
      clusterId,
      options
    );
    return instances;
  },

  async getClusterInstance(id: string): Promise<Instance> {
    const client: SpheronApi = await this.initialize();
    const options: any = {
      includeReport: true,
    };
    const instance: Instance = await client.getClusterInstance(id, options);
    return instance;
  },

  async getClusterInstanceOrder(versionId: string): Promise<InstanceOrder> {
    const client: SpheronApi = await this.initialize();
    const { order } = await client.getClusterInstanceOrder(versionId);
    return order;
  },

  async getClusterInstanceLogs(
    versionId: string,
    logType: InstanceVersionLogsTypeEnum,
    from: number,
    to: number,
    search?: string
  ): Promise<{ logs: Array<string>; logsLength: number }> {
    const client: SpheronApi = await this.initialize();
    const logsOptions = {
      from,
      to,
      logType: mapVersionOrderLogsType(logType),
      search,
    };
    const instanceWihtLogs: InstanceOrderLogs =
      await client.getClusterInstanceOrderLogs(versionId, logsOptions);
    return {
      logs: instanceWihtLogs.logs,
      logsLength: instanceWihtLogs.logsLength,
    };
  },

  async deployInstance(
    organizationId: string,
    configuration: SpheronComputeConfiguration
  ): Promise<InstanceResponse> {
    const client: SpheronApi = await this.initialize();
    const apiPersistentSpecs = toCustomInstanceSpecs(
      configuration.customParams
    );
    const apiEnvs = toApiEnvs(configuration.env);
    const req: CreateInstanceRequest = {
      organizationId,
      configuration: {
        protocol: ClusterProtocolEnum.AKASH,
        image: configuration.image,
        tag: configuration.tag,
        instanceCount: configuration.instanceCount,
        ports: configuration.ports,
        env: apiEnvs,
        command: configuration.commands,
        args: configuration.args,
        region: configuration.region,
        akashMachineImageName: configuration.plan,
        customInstanceSpecs: apiPersistentSpecs,
      },
      clusterUrl: configuration.image,
      clusterProvider: "DOCKERHUB",
      clusterName: configuration.clusterName,
      healthCheckUrl: configuration.healthCheck?.path,
      healthCheckPort: configuration.healthCheck?.port,
      scalable:
        configuration.type == CliComputeInstanceType.ON_DEMAND ? true : false,
    };
    const response: InstanceResponse = await client.createClusterInstance(req);
    return response;
  },

  async updateInstance(
    id: string,
    organizationId: string,
    configuration: SpheronComputeConfiguration
  ): Promise<InstanceResponse> {
    const client: SpheronApi = await this.initialize();
    const apiEnvs = toApiEnvs(configuration.env);
    const customInstanceSpecs = toCustomInstanceSpecs(
      configuration.customParams
    );
    const updateRequest: UpdateInstaceRequest = {
      env: apiEnvs,
      command: configuration.commands,
      args: configuration.args,
      uniqueTopicId: uuidv4(),
      tag: configuration.tag,
      akashMachineImageName: configuration.plan,
      customInstanceSpecs,
      instanceCount: configuration.instanceCount,
    };
    const response: InstanceResponse = await client.updateClusterInstance(
      id,
      organizationId,
      updateRequest
    );
    return response;
  },

  async closeInstance(
    id: string
  ): Promise<{ message: string; success: boolean }> {
    const client: SpheronApi = await this.initialize();

    const response = await client.closeClusterInstance(id);
    return response;
  },

  async getComputeTemplates(): Promise<MarketplaceApp[]> {
    const client: SpheronApi = await this.initialize();
    const templates: MarketplaceApp[] = await client.getClusterTemplates();
    return templates;
  },

  async getComputeTemplate(id: string): Promise<MarketplaceApp> {
    const client: SpheronApi = await this.initialize();
    const template: MarketplaceApp = await client.getClusterTemplate(id);
    return template;
  },

  async isGptWhitelisted(): Promise<any> {
    const client: any = await this.initialize();
    if (!client.token) {
      return {
        error: true,
        message: "Unauthorized. You need to login first using 'spheron login'.",
      };
    }
    try {
      const response = await client.isWhitelisted();
      return response;
    } catch (error) {
      return {
        error: true,
        message: "✖️  Error: User is not whitelisted for this service",
      };
    }
  },

  async executeShellCommand(
    instanceId: string,
    command: string
  ): Promise<ShellExecutionResponse> {
    const client: SpheronApi = await this.initialize();
    const result: ShellExecutionResponse = await client.executeShellCommand(
      instanceId,
      command
    );
    return result;
  },

  async generateCode(
    spinner: Spinner,
    spinnerMessage: string,
    type: string,
    query: string,
    file?: string,
    lang?: string
  ): Promise<IGPTResponse> {
    const client: any = await this.initialize();
    if (!client.token) {
      return { response: "" };
    }
    spinner.spin(spinnerMessage);
    const data: {
      type: string;
      query: string;
      file?: string;
      lang?: string;
    } = {
      type,
      query,
      ...(file && { file }),
      ...(lang && { lang }),
    };
    const gptResponse: IGPTResponse = await client.getGPTResponse(data);

    return gptResponse;
  },
};

function mapVersionOrderLogsType(
  param: InstanceVersionLogsTypeEnum
): InstanceLogType {
  if (param == InstanceVersionLogsTypeEnum.DEPLOYMENT) {
    return InstanceLogType.DEPLOYMENT_LOGS;
  } else if (param == InstanceVersionLogsTypeEnum.LIVE) {
    return InstanceLogType.INSTANCE_LOGS;
  } else if (param == InstanceVersionLogsTypeEnum.EVENTS) {
    return InstanceLogType.INSTANCE_LOGS;
  }
  throw Error("Log type cannot be converted to api supported version.");
}

export function toCustomInstanceSpecs(
  spec: CliCustomParams
): CustomInstanceSpecs {
  let persistentStorageApi = undefined;
  const config: CustomInstanceSpecs = {
    storage: spec.storage,
    cpu: spec.cpu,
    memory: spec.memory,
  };
  if (spec.persistentStorage) {
    persistentStorageApi = {
      size: spec.persistentStorage.size,
      class: toApiPersistentStorage(spec.persistentStorage.class),
      mountPoint: spec.persistentStorage.mountPoint,
    };
    config.persistentStorage = persistentStorageApi;
  }
  return config;
}

function toApiPersistentStorage(
  param: CliPersistentStorageTypesEnum
): PersistentStorageClassEnum {
  if (param == CliPersistentStorageTypesEnum.HDD) {
    return PersistentStorageClassEnum.HDD;
  } else if (param == CliPersistentStorageTypesEnum.SSD) {
    return PersistentStorageClassEnum.SSD;
  } else if (param == CliPersistentStorageTypesEnum.NVMe) {
    return PersistentStorageClassEnum.NVMe;
  }
  throw Error(
    "Persistent storage class cannot be mapped to api supported version."
  );
}

export function toCliPersistentStorage(
  param: PersistentStorageClassEnum
): CliPersistentStorageTypesEnum {
  if (param == PersistentStorageClassEnum.HDD) {
    return CliPersistentStorageTypesEnum.HDD;
  } else if (param == PersistentStorageClassEnum.SSD) {
    return CliPersistentStorageTypesEnum.SSD;
  } else if (param == PersistentStorageClassEnum.NVMe) {
    return CliPersistentStorageTypesEnum.NVMe;
  }
  throw Error(
    "Persistent storage class cannot be mapped to api supported version."
  );
}

function toApiEnvs(envs: Array<CliComputeEnv>): Array<Env> {
  const apiEnvs = envs.map((x) => {
    return {
      value: `${x.name}=${x.value}`,
      isSecret: x.hidden,
    };
  });
  return apiEnvs;
}

export default SpheronApiService;
