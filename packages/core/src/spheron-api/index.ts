import axios from "axios";
import {
  AppTypeEnum,
  DeploymentStatusEnum,
  DomainTypeEnum,
  FrameworkEnum,
  InstanceLogType,
  NodeVersionEnum,
  ProjectStateEnum,
  ProtocolEnum,
  ProviderEnum,
} from "./enums";

import {
  Configuration,
  Deployment,
  Domain,
  Organization,
  Project,
  TokenScope,
  User,
  DeploymentEnvironment,
  VerifiedTokenResponse,
  UsageWithLimitsWithSkynet,
  IPNSPublishResponse,
  IPNSName,
  StartDeploymentConfiguration,
  EnvironmentVariable,
  Cluster,
  InstancesInfo,
  ClusterFundsUsage,
  ExtendedInstance,
  Instance,
  InstanceOrder,
  MarketplaceApp,
  ComputeMachine,
  InstanceOrderLogs,
} from "./interfaces";
import {
  CreateInstanceFromMarketplaceRequest,
  CreateInstanceRequest,
  UpdateInstaceRequest,
} from "./request-interfaces";
import {
  InstanceResponse,
  MarketplaceInstanceResponse,
} from "./response-interfaces";

class SpheronApi {
  private readonly spheronApiUrl: string = "https://api-v2.spheron.network";
  private readonly token: string;

  constructor(token: string, url?: string) {
    this.token = token;
    if (url) {
      this.spheronApiUrl = url;
    }
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.sendApiRequest<TokenScope>(
      HttpMethods.GET,
      "/v1/api-keys/scope"
    );
  }

  async getProject(projectId: string): Promise<Project> {
    return this.sendApiRequest<Project>(
      HttpMethods.GET,
      `/v1/project/${projectId}`
    );
  }

  async getProjectDeployments(
    projectId: string,
    options: {
      skip: number;
      limit: number;
      status?: DeploymentStatusEnum;
    }
  ): Promise<{ deployments: Deployment[] }> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const deployments = await this.sendApiRequest<Deployment[]>(
      HttpMethods.GET,
      `/v1/project/${projectId}/deployments?skip=${options.skip}&limit=${
        options.limit
      }${options.status ? `&status=${options.status}` : ""}`
    );
    return { deployments };
  }

  //#region Project Domains

  async getProjectDomains(projectId: string): Promise<{ domains: Domain[] }> {
    return this.sendApiRequest<{ domains: Domain[] }>(
      HttpMethods.GET,
      `/v1/project/${projectId}/domains`
    );
  }

  async getProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    return this.sendApiRequest<{ domain: Domain }>(
      HttpMethods.GET,
      `/v1/project/${projectId}/domains/${domainIdentifier}`
    );
  }

  async addProjectDomain(
    projectId: string,
    options: {
      link?: string;
      type: DomainTypeEnum | string;
      deploymentEnvironments?: string[];
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    return await this.sendApiRequest<{ domain: Domain }>(
      HttpMethods.POST,
      `/v1/project/${projectId}/domains`,
      options
    );
  }

  async patchProjectDomain(
    projectId: string,
    domainIdentifier: string,
    options: {
      link?: string;
      deploymentEnvironments?: string[];
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    return await this.sendApiRequest<{ domain: Domain }>(
      HttpMethods.PATCH,
      `/v1/project/${projectId}/domains/${domainIdentifier}`,
      options
    );
  }

  async verifyProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean; domain: Domain }> {
    return await this.sendApiRequest<{ success: boolean; domain: Domain }>(
      HttpMethods.PATCH,
      `/v1/project/${projectId}/domains/${domainIdentifier}/verify`,
      {}
    );
  }

  async deleteProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.sendApiRequest(
      HttpMethods.DELETE,
      `/v1/project/${projectId}/domains/${domainIdentifier}`
    );
  }

  //#endregion Project Domains

  async getProjectDeploymentCount(projectId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }> {
    return await this.sendApiRequest<{
      total: number;
      successful: number;
      failed: number;
      pending: number;
    }>(HttpMethods.GET, `/v1/project/${projectId}/deployments/count`);
  }

  async updateProjectState(
    projectId: string,
    state: ProjectStateEnum | string
  ): Promise<{ message: string }> {
    return await this.sendApiRequest<{ message: string }>(
      HttpMethods.PATCH,
      `/v1/project/${projectId}/state`,
      { state }
    );
  }

  async updateProjectConfiguration(
    projectId: string,
    options: {
      buildCommand: string;
      installCommand: string;
      workspace: string;
      publishDir: string;
      framework: FrameworkEnum | string;
      nodeVersion: NodeVersionEnum | string;
    }
  ): Promise<{ configuration: Configuration }> {
    return await this.sendApiRequest<{ configuration: Configuration }>(
      HttpMethods.PUT,
      `/v1/project/${projectId}/configuration`,
      options
    );
  }

  //#region Organization Endpoints

  async createOrganization(
    username: string,
    name: string,
    appType: AppTypeEnum
  ): Promise<Organization> {
    const body = {
      username,
      name,
      appType,
    };
    const { organization } = await this.sendApiRequest<{
      organization: Organization;
    }>(HttpMethods.POST, `/v1/organization`, body);
    return organization;
  }

  async getOrganization(id: string): Promise<Organization> {
    const organization = await this.sendApiRequest<Organization>(
      HttpMethods.GET,
      `/v1/organization/${id}`
    );
    return organization;
  }

  async updateOrganization(
    organizationId: string,
    options: {
      name: string;
      username: string;
      image: string;
    }
  ): Promise<Organization> {
    const organization = await this.sendApiRequest<Organization>(
      HttpMethods.PUT,
      `/v1/organization/${organizationId}`,
      options
    );
    return organization;
  }

  async getOrganizationProjects(
    id: string,
    options: {
      skip: number;
      limit: number;
      state?: ProjectStateEnum;
    }
  ): Promise<Project[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const result = await this.sendApiRequest<{ projects: Project[] }>(
      HttpMethods.GET,
      `/v1/organization/${id}/projects?skip=${options.skip}&limit=${
        options.limit
      }${options.state ? `&state=${options.state}` : ""}`
    );
    return result.projects;
  }

  async getOrganizationProjectCount(
    id: string,
    options: {
      state?: ProjectStateEnum;
    }
  ): Promise<number> {
    const result = await this.sendApiRequest<{ count: number }>(
      HttpMethods.GET,
      `/v1/organization/${id}/projects/count${
        options.state ? `?state=${options.state}` : ""
      }`
    );
    return result.count;
  }

  //#endregion Organization Endpoints

  async getProfile(): Promise<User> {
    const result = await this.sendApiRequest<{ user: User }>(
      HttpMethods.GET,
      `/v1/profile/`
    );
    return result.user;
  }

  async verfiyGitToken(
    provider: string,
    code: string,
    port: number
  ): Promise<VerifiedTokenResponse> {
    const verifiedToken = await this.sendApiRequest<VerifiedTokenResponse>(
      HttpMethods.GET,
      `/auth/${provider}/cli/verify-token/${code}?port=${port}`
    );
    return verifiedToken;
  }

  async getOrganizationUsage(
    organizationId: string,
    specialization: "wa-global" | "c-akash"
  ): Promise<UsageWithLimitsWithSkynet> {
    const { usage } = await this.sendApiRequest<{
      usage: UsageWithLimitsWithSkynet;
    }>(
      HttpMethods.GET,
      `/v1/organization/${organizationId}/subscription-usage/specialization/${specialization}`
    );
    return usage;
  }

  public async publishIPNS(deploymentId: string): Promise<IPNSName> {
    const resp = await this.sendApiRequest<{ ipnsName: IPNSPublishResponse }>(
      HttpMethods.POST,
      `/v1/ipns/deployments/${deploymentId}/names`
    );
    return this.mapIPNSResponseToIPNSName(resp.ipnsName);
  }

  public async updateIPNSName(
    ipnsNameId: string,
    deploymentId: string
  ): Promise<IPNSName> {
    const resp = await this.sendApiRequest<{ ipnsName: IPNSPublishResponse }>(
      HttpMethods.PUT,
      `/v1/ipns/deployments/${deploymentId}/names/${ipnsNameId}`
    );
    return this.mapIPNSResponseToIPNSName(resp.ipnsName);
  }

  public async getIPNSName(ipnsNameId: string): Promise<IPNSName> {
    const resp = await this.sendApiRequest<IPNSPublishResponse>(
      HttpMethods.GET,
      `/v1/ipns/names/${ipnsNameId}`
    );
    return this.mapIPNSResponseToIPNSName(resp);
  }

  public async getIPNSNamesForUpload(uploadId: string): Promise<IPNSName[]> {
    const resp = await this.sendApiRequest<IPNSPublishResponse[]>(
      HttpMethods.GET,
      `/v1/ipns/deployments/${uploadId}/names`
    );
    return resp.map((ipnsName) => this.mapIPNSResponseToIPNSName(ipnsName));
  }

  public async getIPNSNamesForOrganization(
    organizationId: string
  ): Promise<IPNSName[]> {
    const resp = await this.sendApiRequest<IPNSPublishResponse[]>(
      HttpMethods.GET,
      `/v1/ipns/names`,
      {
        organizationId,
      }
    );
    return resp.map((ipnsName) => this.mapIPNSResponseToIPNSName(ipnsName));
  }

  //#region Deployments

  public async startDeployment(
    configuration: StartDeploymentConfiguration
  ): Promise<{
    success: boolean;
    message: string;
    topic: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    const response = await this.sendApiRequest<{
      success: boolean;
      message: string;
      topic: string;
      deploymentId: string;
      projectId: string;
      deployment: Deployment;
    }>(HttpMethods.POST, `/v1/deployment`, configuration);
    return response;
  }

  async authorizeDeployment(deploymentId: string): Promise<{
    success: boolean;
    message: string;
    topic: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    const response = await this.sendApiRequest<{
      success: boolean;
      message: string;
      topic: string;
      deploymentId: string;
      projectId: string;
      deployment: Deployment;
    }>(HttpMethods.POST, `/v1/deployment/${deploymentId}/authorize`);
    return response;
  }

  async cancelDeployment(
    deploymentId: string
  ): Promise<{ message: string; canceled: true; killing: true }> {
    const response = await this.sendApiRequest<{
      message: string;
      canceled: true;
      killing: true;
    }>(HttpMethods.POST, `/v1/deployment/${deploymentId}/cancel`);
    return response;
  }

  async redeployDeployment(deploymentId: string): Promise<{
    success: boolean;
    message: string;
    topic: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    const response = await this.sendApiRequest<{
      success: boolean;
      message: string;
      topic: string;
      deploymentId: string;
      projectId: string;
      deployment: Deployment;
    }>(HttpMethods.POST, `/v1/deployment/${deploymentId}/redeploy`);
    return response;
  }

  async getDeployment(deploymentId: string): Promise<Deployment> {
    const { deployment } = await this.sendApiRequest<{
      deployment: Deployment;
    }>(HttpMethods.GET, `/v1/deployment/${deploymentId}`);
    return deployment;
  }

  async suggestFramework(options: {
    owner: string;
    branch: string;
    provider: ProviderEnum;
    repositoryName: string;
    root?: string;
  }): Promise<{ suggestedFramework: FrameworkEnum }> {
    const response = await this.sendApiRequest<{
      suggestedFramework: FrameworkEnum;
    }>(HttpMethods.GET, `/v1/deployment/framework/suggestion`, null, {
      owner: options.owner,
      branch: options.branch,
      provider: options.provider,
      repo: options.repositoryName,
      root: options.root,
    });

    return response;
  }

  //#endregion Deployments

  //#region Environment Variables

  async addProjectEnvironmentVariables(
    projectId: string,
    environmentVariables: {
      name: string;
      value: string;
      environments: string[];
    }[]
  ): Promise<{ environmentVariables: EnvironmentVariable[] }> {
    const response = await this.sendApiRequest<{
      environmentVariables: EnvironmentVariable[];
    }>(HttpMethods.POST, `/v1/project/${projectId}/environment-variables`, {
      environmentVariables,
    });
    return response;
  }

  async updateProjectEnvironmentVariable(
    projectId: string,
    environmentVariableId: string,
    payload: { name: string; value: string; environments: string[] }
  ): Promise<EnvironmentVariable> {
    const response = await this.sendApiRequest<{
      updated: EnvironmentVariable;
    }>(
      HttpMethods.PUT,
      `/v1/project/${projectId}/environment-variables/${environmentVariableId}`,
      payload
    );
    return response.updated;
  }

  async deleteProjectEnvironmentVariable(
    projectId: string,
    environmentVariableId: string
  ): Promise<void> {
    await this.sendApiRequest<{ success: boolean }>(
      HttpMethods.DELETE,
      `/v1/project/${projectId}/environment-variables/${environmentVariableId}`
    );
  }

  //#endregion Environment Variables

  //#region Deployment Environment

  async getDeploymentEnvironments(
    projectId: string
  ): Promise<DeploymentEnvironment[]> {
    const response = await this.sendApiRequest<{
      result: DeploymentEnvironment[];
    }>(HttpMethods.GET, `/v1/project/${projectId}/deployment-environments`);
    return response.result;
  }

  async createDeploymentEnvironment(
    projectId: string,
    payload: {
      name: string;
      branches: string[];
      protocol: ProtocolEnum;
    }
  ): Promise<DeploymentEnvironment> {
    const response = await this.sendApiRequest<{
      newEnvironment: DeploymentEnvironment;
    }>(
      HttpMethods.POST,
      `/v1/project/${projectId}/deployment-environments`,
      payload
    );
    return response.newEnvironment;
  }

  async updateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string,
    payload: {
      name: string;
      branches: string[];
      protocol: ProtocolEnum;
    }
  ): Promise<DeploymentEnvironment> {
    const response = await this.sendApiRequest<{
      deploymentEnvironment: DeploymentEnvironment;
    }>(
      HttpMethods.PUT,
      `/v1/project/${projectId}/deployment-environments/${deploymentEnvironmentId}`,
      payload
    );
    return response.deploymentEnvironment;
  }

  async deleteDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<{ message: string }> {
    const response = await this.sendApiRequest<{
      message: string;
    }>(
      HttpMethods.DELETE,
      `/v1/project/${projectId}/deployment-environments/${deploymentEnvironmentId}`
    );
    return response;
  }

  async activateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<DeploymentEnvironment> {
    const response = await this.sendApiRequest<{
      deploymentEnvironment: DeploymentEnvironment;
    }>(
      HttpMethods.PATCH,
      `/v1/project/${projectId}/deployment-environments/${deploymentEnvironmentId}/activate`
    );
    return response.deploymentEnvironment;
  }

  async deactivateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<DeploymentEnvironment> {
    const response = await this.sendApiRequest<{
      deploymentEnvironment: DeploymentEnvironment;
    }>(
      HttpMethods.PATCH,
      `/v1/project/${projectId}/deployment-environments/${deploymentEnvironmentId}/deactivate`
    );
    return response.deploymentEnvironment;
  }

  //#endregion Deployment Environment

  async getOrganizationClusters(
    id: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<Cluster[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const result = await this.sendApiRequest<{ clusters: Cluster[] }>(
      HttpMethods.GET,
      `/v1/organization/${id}/clusters?skip=${options.skip}&limit=${options.limit}`
    );
    return result.clusters;
  }

  async getCluster(id: string): Promise<Cluster> {
    return this.sendApiRequest<Cluster>(HttpMethods.GET, `/v1/cluster/${id}`);
  }

  async deleteCluster(id: string): Promise<void> {
    await this.sendApiRequest<Cluster>(HttpMethods.DELETE, `/v1/cluster/${id}`);
  }

  async getClusterInstancesDetails(id: string): Promise<InstancesInfo> {
    return this.sendApiRequest<InstancesInfo>(
      HttpMethods.GET,
      `/v1/cluster/${id}/instances/count`
    );
  }

  async getClusterFundsUsage(id: string): Promise<ClusterFundsUsage> {
    return this.sendApiRequest<ClusterFundsUsage>(
      HttpMethods.GET,
      `/v1/cluster/${id}/funds-usage`
    );
  }

  async getClusterInstances(
    id: string,
    options: {
      skip: number;
      limit: number;
      includeReport?: boolean;
    }
  ): Promise<ExtendedInstance[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }

    const result: { extendedInstances: ExtendedInstance[] } =
      await this.sendApiRequest<{
        extendedInstances: ExtendedInstance[];
      }>(HttpMethods.GET, `/v1/cluster/${id}/instances`, null, {
        skip: options.skip,
        limit: options.limit,
        topupReport: options.includeReport && "y",
      });

    return result.extendedInstances;
  }

  async getClusterTemplates(): Promise<MarketplaceApp[]> {
    const response = await this.sendApiRequest<{
      clusterTemplates: MarketplaceApp[];
    }>(HttpMethods.GET, `/v1/cluster-templates`);

    return response.clusterTemplates;
  }

  async getClusterTemplate(id: string): Promise<MarketplaceApp> {
    const response = await this.sendApiRequest<{
      clusterTemplate: MarketplaceApp;
    }>(HttpMethods.GET, `/v1/cluster-templates/${id}`);

    return response.clusterTemplate;
  }

  async getClusterCategories(): Promise<string[]> {
    const result: { categories: string[] } = await this.sendApiRequest<{
      categories: string[];
    }>(HttpMethods.GET, `/v1/cluster-templates/categories`);

    return result.categories;
  }

  async getClusterInstance(
    id: string,
    options?: {
      includeReport?: boolean;
    }
  ): Promise<Instance> {
    const response: { success: boolean; instance: Instance } =
      await this.sendApiRequest<{
        success: boolean;
        instance: Instance;
      }>(HttpMethods.GET, `/v1/cluster-instance/${id}`, null, {
        topupReport: options && options.includeReport && "y",
      });

    return response.instance;
  }

  async deleteClusterInstance(id: string): Promise<void> {
    await this.sendApiRequest<Instance>(
      HttpMethods.DELETE,
      `/v1/cluster-instance/${id}`
    );
  }

  async updateClusterInstance(
    id: string,
    organizationId: string,
    clusterInstance: UpdateInstaceRequest
  ): Promise<InstanceResponse> {
    return this.sendApiRequest<InstanceResponse>(
      HttpMethods.PATCH,
      `/v1/cluster-instance/${id}/update`,
      { ...clusterInstance, organizationId }
    );
  }

  async updateClusterInstanceHealthCheckInfo(
    id: string,
    healthCheck: { path: string; cointainerPort: number }
  ): Promise<{ message: string; updated: boolean }> {
    return this.sendApiRequest<{
      message: string;
      updated: boolean;
    }>(HttpMethods.PATCH, `/v1/cluster-instance/${id}/update/health-check`, {
      healthCheckUrl: healthCheck.path,
      healthCheckPort: healthCheck.cointainerPort,
    });
  }

  async closeClusterInstance(
    id: string
  ): Promise<{ message: string; success: boolean }> {
    return this.sendApiRequest<{
      message: string;
      success: boolean;
    }>(HttpMethods.POST, `/v1/cluster-instance/${id}/close`);
  }

  async getClusterInstanceOrder(
    id: string
  ): Promise<{ order: InstanceOrder; liveLogs: string[] }> {
    return this.sendApiRequest<{
      order: InstanceOrder;
      liveLogs: string[];
    }>(HttpMethods.GET, `/v1/cluster-instance/order/${id}`);
  }

  async getClusterInstanceOrderLogs(
    id: string,
    logsOptions: {
      from: number;
      to: number;
      logType: InstanceLogType;
      search?: string;
    }
  ): Promise<InstanceOrderLogs> {
    if (logsOptions.from < 0 || logsOptions.to < 0) {
      throw new Error(`From and To cannot be negative numbers.`);
    }

    const response = await this.sendApiRequest<{
      success: boolean;
      order: InstanceOrderLogs;
    }>(
      HttpMethods.GET,
      `/v1/cluster-instance/order/${id}/logs`,
      null,
      logsOptions
    );

    return response.order;
  }

  async createClusterInstance(
    clusterInstance: CreateInstanceRequest
  ): Promise<InstanceResponse> {
    return this.sendApiRequest<InstanceResponse>(
      HttpMethods.POST,
      `/v1/cluster-instance/create`,
      clusterInstance
    );
  }

  async createClusterInstanceFromTemplate(
    clusterInstance: CreateInstanceFromMarketplaceRequest
  ): Promise<MarketplaceInstanceResponse> {
    return this.sendApiRequest<MarketplaceInstanceResponse>(
      HttpMethods.POST,
      `/v1/cluster-instance/template`,
      clusterInstance
    );
  }

  async getClusterInstanceDomains(id: string): Promise<Domain[]> {
    const result: { domains: Domain[] } = await this.sendApiRequest<{
      domains: Domain[];
    }>(HttpMethods.GET, `/v1/cluster-instance/${id}/domains`);

    return result.domains;
  }

  async addClusterInstanceDomain(
    instanceId: string,
    doamin: {
      link?: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    return this.sendApiRequest<Domain>(
      HttpMethods.POST,
      `/v1/cluster-instance/${instanceId}/domains`,
      doamin
    );
  }

  async updateClusterInstanceDomain(
    instanceId: string,
    domainId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    return this.sendApiRequest<Domain>(
      HttpMethods.PATCH,
      `/v1/cluster-instance/${instanceId}/domains/${domainId}`,
      doamin
    );
  }

  async deleteClusterInstanceDomain(
    instanceId: string,
    domainId: string
  ): Promise<void> {
    await this.sendApiRequest<Domain>(
      HttpMethods.DELETE,
      `/v1/cluster-instance/${instanceId}/domains/${domainId}`
    );
  }

  async verifyClusterInstanceDomain(
    instanceId: string,
    domainId: string
  ): Promise<void> {
    await this.sendApiRequest<Domain>(
      HttpMethods.PATCH,
      `/v1/cluster-instance/${instanceId}/domains/${domainId}/verify`
    );
  }

  async getComputeMachines(options: {
    skip: number;
    limit: number;
    searchString?: string;
  }): Promise<ComputeMachine[]> {
    if (options.limit < 0 || options.skip < 0) {
      throw new Error(`Limit and Skip cannot be negative numbers.`);
    }

    const result: { akashMachineImages: ComputeMachine[]; totalCount: number } =
      await this.sendApiRequest<{
        akashMachineImages: ComputeMachine[];
        totalCount: number;
      }>(HttpMethods.GET, `/v1/compute-machine-image`, null, options);

    return result.akashMachineImages;
  }

  async getComputeMachineRegions(): Promise<string[]> {
    const result: {
      regions: string[];
      totalCount: number;
    } = await this.sendApiRequest<{
      regions: string[];
      totalCount: number;
    }>(HttpMethods.GET, `/v1/compute-machine-image/regions`);

    return result.regions;
  }

  async triggerClusterInstanceHealthCheck(
    instanceId: string,
    topicId: string
  ): Promise<{
    topicId: string;
    message: string;
  }> {
    return this.sendApiRequest<{
      topicId: string;
      message: string;
    }>(
      HttpMethods.POST,
      `/v1/cluster-instance/${instanceId}/trigger/container-health-check?topicId=${topicId}`
    );
  }

  async triggerClusterInstanceStatusCheck(
    instanceId: string,
    topicId: string
  ): Promise<{
    topicId: string;
    message: string;
  }> {
    return this.sendApiRequest<{
      topicId: string;
      message: string;
    }>(
      HttpMethods.POST,
      `/v1/cluster-instance/${instanceId}/trigger/container-health-check?topicId=${topicId}`
    );
  }

  async triggerClusterInstanceLogFetch(
    instanceId: string,
    topicId: string
  ): Promise<{
    topicId: string;
    message: string;
  }> {
    return this.sendApiRequest<{
      topicId: string;
      message: string;
    }>(
      HttpMethods.POST,
      `/v1/cluster-instance/${instanceId}/trigger/fetch-logs?topicId=${topicId}`
    );
  }

  async getPriceForToken(tokenId: number): Promise<number> {
    const response = await this.sendApiRequest<{
      message: string;
      price: number;
    }>(HttpMethods.GET, `/v1/price/liveTokenPrice/${tokenId}`);

    return response.price;
  }

  private async sendApiRequest<T>(
    method: HttpMethods,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
  ): Promise<T> {
    try {
      const response = await axios<T>({
        method,
        url: `${this.spheronApiUrl}${path}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: params,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error?.message);
    }
  }

  private mapIPNSResponseToIPNSName(
    ipnsResponse: IPNSPublishResponse
  ): IPNSName {
    return {
      id: ipnsResponse._id,
      publishedUploadId: ipnsResponse.publishedDeploymentId,
      organizationId: ipnsResponse.organizationId,
      createdAt: ipnsResponse.createdAt,
      updatedAt: ipnsResponse.updatedAt,
      ipnsHash: ipnsResponse.keyId,
      ipnsLink: ipnsResponse.ipnsLink,
    };
  }
}

enum HttpMethods {
  GET = "Get",
  POST = "Post",
  PATCH = "Patch",
  DELETE = "Delete",
  PUT = "Put",
}

export default SpheronApi;
