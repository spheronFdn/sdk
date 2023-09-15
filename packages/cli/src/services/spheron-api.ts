import {
  AppTypeEnum,
  Cluster,
  ComputeMachine,
  Deployment,
  DeploymentEnvironment,
  DeploymentStatusEnum,
  Domain,
  ExtendedInstance,
  Instance,
  Organization,
  Project,
  SpheronApi,
  User,
  VerifiedTokenResponse,
} from "@spheron/core";
import configuration from "../configuration";
import { IGPTResponse } from "../commands/gpt/gpt";
import Spinner from "../outputs/spinner";
import MetadataService from "./metadata-service";

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
    const options: any = {
      skip: 0,
      limit: 50,
    };
    if (name) {
      options.searchString = name;
    }
    const computePlans: ComputeMachine[] = await client.getComputeMachines(
      options
    );
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

  async isWhitelisted(): Promise<any> {
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

export default SpheronApiService;
