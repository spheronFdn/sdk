import axios from "axios";
import {
  AppTypeEnum,
  DeploymentStatusEnum,
  DomainTypeEnum,
  FrameworkEnum,
  InstanceLogType,
  InstanceStateEnum,
  MarketplaceCategoryEnum,
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
  ComputeProject,
  InstancesInfo,
  ComputeProjectFundsUsage,
  ExtendedInstance,
  Instance,
  ComputeDeployment,
  MarketplaceApp,
  ComputeMachine,
  ComputeDeploymentLogs,
  Bucket,
  BucketStateEnum,
  Upload,
  BucketDomain,
  BucketIpnsRecord,
  MasterOrganization,
  ComputeMetrics,
  TopupReport,
} from "./interfaces";
import {
  CreateInstanceFromMarketplaceRequest,
  CreateInstanceRequest,
  UpdateInstaceRequest,
} from "./request-interfaces";
import {
  InstanceResponse,
  MarketplaceInstanceResponse,
  ShellExecutionResponse,
} from "./response-interfaces";

class SpheronApi {
  private readonly spheronApiUrl: string;

  private readonly token: string;

  constructor(token: string, url?: string) {
    this.token = token;
    this.spheronApiUrl = url ?? "http://localhost:8080";
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

  async getCdnRecords(): Promise<{
    recordIpv4V2: string;
    recordCnameV2: string;
  }> {
    // the project id is always 1 because it is required, but it is not used in the api
    const response = await this.sendApiRequest<{
      records: {
        recordIpv4V2: string;
        recordCnameV2: string;
      };
    }>(HttpMethods.GET, `/v1/project/1/domains/cdn-records`);
    return {
      ...response.records,
    };
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

  async getMasterOrganization(id: string): Promise<MasterOrganization> {
    return this.sendApiRequest<MasterOrganization>(
      HttpMethods.GET,
      `/v1/organization/${id}`
    );
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
    specialization: "wa-global" | "c-akash" | "storage"
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

  async getOrganizationComputeProjects(
    id: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<ComputeProject[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const result = await this.sendApiRequest<{
      computeProjects: ComputeProject[];
    }>(
      HttpMethods.GET,
      `/v1/organization/${id}/compute-projects?skip=${options.skip}&limit=${options.limit}`
    );
    return result.computeProjects;
  }

  async getComputeProject(id: string): Promise<ComputeProject> {
    return this.sendApiRequest<ComputeProject>(
      HttpMethods.GET,
      `/v1/compute-project/${id}`
    );
  }

  async deleteComputeProject(id: string): Promise<void> {
    await this.sendApiRequest<ComputeProject>(
      HttpMethods.DELETE,
      `/v1/compute-project/${id}`
    );
  }

  async getComputeProjectDetails(id: string): Promise<InstancesInfo> {
    return this.sendApiRequest<InstancesInfo>(
      HttpMethods.GET,
      `/v1/compute-project/${id}/instances/count`
    );
  }

  async getComputeProjectFundsUsage(
    id: string
  ): Promise<ComputeProjectFundsUsage> {
    return this.sendApiRequest<ComputeProjectFundsUsage>(
      HttpMethods.GET,
      `/v1/compute-project/${id}/funds-usage`
    );
  }

  async getComputeProjectInstances(
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
      }>(HttpMethods.GET, `/v1/compute-project/${id}/instances`, null, {
        skip: options.skip,
        limit: options.limit,
        topupReport: options.includeReport && "y",
      });

    return result.extendedInstances;
  }

  async getComputeInstances(
    organizationId: string,
    options: {
      skip: number;
      limit: number;
    },
    state?: InstanceStateEnum,
    computeProjectId?: string
  ): Promise<ExtendedInstance[]> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }

    const result: { instances: ExtendedInstance[] } =
      await this.sendApiRequest<{
        instances: ExtendedInstance[];
      }>(HttpMethods.GET, `/v1/compute-instance`, null, {
        skip: options.skip,
        limit: options.limit,
        organizationId: organizationId,
        state: state,
        computeProjectId: computeProjectId,
      });

    return result.instances;
  }

  async getComputeMetrics(
    instanceId: string,
    serviceName: string
  ): Promise<ComputeMetrics> {
    const result: { metrics: ComputeMetrics } = await this.sendApiRequest<{
      metrics: ComputeMetrics;
    }>(HttpMethods.GET, `/v1/compute-instance/${instanceId}/metrics`, null, {
      service: serviceName,
    });

    return result.metrics;
  }

  async getMarketplaceApps(
    category?: MarketplaceCategoryEnum
  ): Promise<MarketplaceApp[]> {
    const response = await this.sendApiRequest<{
      templates: MarketplaceApp[];
    }>(HttpMethods.GET, `/v1/marketplace-app`, undefined, { category });

    return response.templates;
  }

  async getMarketplaceApp(id: string): Promise<MarketplaceApp> {
    const response = await this.sendApiRequest<MarketplaceApp>(
      HttpMethods.GET,
      `/v1/marketplace-app/${id}`
    );

    return response;
  }

  async getMarketplaceAppCategories(): Promise<string[]> {
    const result: { categories: string[] } = await this.sendApiRequest<{
      categories: string[];
    }>(HttpMethods.GET, `/v1/marketplace-app/categories`);

    return result.categories;
  }

  async getComputeInstance(
    id: string,
    options?: {
      includeReport?: boolean;
    }
  ): Promise<ExtendedInstance> {
    const response: {
      success: boolean;
      instance: Instance;
      topupReport: TopupReport;
    } = await this.sendApiRequest<{
      success: boolean;
      instance: Instance;
      topupReport: TopupReport;
    }>(HttpMethods.GET, `/v1/compute-instance/${id}`, null, {
      topupReport: options && options.includeReport && "y",
    });

    const extendedInstance: ExtendedInstance = {
      ...response.instance,
      defaultDailyTopup: 0,
      leasePricePerBlock: 0,
      topupReport: response.topupReport,
    };
    return extendedInstance;
  }

  async deleteComputeInstance(id: string): Promise<void> {
    await this.sendApiRequest<Instance>(
      HttpMethods.DELETE,
      `/v1/compute-instance/${id}`
    );
  }

  async updateComputeInstance(
    id: string,
    organizationId: string,
    computeInstance: UpdateInstaceRequest
  ): Promise<InstanceResponse> {
    return this.sendApiRequest<InstanceResponse>(
      HttpMethods.PATCH,
      `/v1/compute-instance/${id}/update`,
      { ...computeInstance, organizationId }
    );
  }

  async updateComputeInstanceHealthCheckInfo(
    id: string,
    healthCheck: { path: string; cointainerPort: number }
  ): Promise<{ message: string; updated: boolean }> {
    return this.sendApiRequest<{
      message: string;
      updated: boolean;
    }>(HttpMethods.PATCH, `/v1/compute-instance/${id}/update/health-check`, {
      healthCheckUrl: healthCheck.path,
      healthCheckPort: healthCheck.cointainerPort,
    });
  }

  async closeComputeInstance(
    id: string
  ): Promise<{ message: string; success: boolean }> {
    return this.sendApiRequest<{
      message: string;
      success: boolean;
    }>(HttpMethods.POST, `/v1/compute-instance/${id}/close`);
  }

  async getComputeDeployment(
    id: string
  ): Promise<{ deployment: ComputeDeployment; liveLogs: string[] }> {
    return this.sendApiRequest<{
      deployment: ComputeDeployment;
      liveLogs: string[];
    }>(HttpMethods.GET, `/v1/compute-instance/deployment/${id}`);
  }

  async getComputeDeploymentLogs(
    id: string,
    logsOptions: {
      from: number;
      to: number;
      logType: InstanceLogType;
      search?: string;
    }
  ): Promise<ComputeDeploymentLogs> {
    if (logsOptions.from < 0 || logsOptions.to < 0) {
      throw new Error(`From and To cannot be negative numbers.`);
    }

    const response = await this.sendApiRequest<{
      success: boolean;
      deployment: ComputeDeploymentLogs;
    }>(
      HttpMethods.GET,
      `/v1/compute-instance/deployment/${id}/logs`,
      null,
      logsOptions
    );

    return response.deployment;
  }

  async createComputeInstance(
    computeInstance: CreateInstanceRequest
  ): Promise<InstanceResponse> {
    return this.sendApiRequest<InstanceResponse>(
      HttpMethods.POST,
      `/v1/compute-instance/create`,
      computeInstance
    );
  }

  async createComputeInstanceFromMarketplace(
    computeInstance: CreateInstanceFromMarketplaceRequest
  ): Promise<MarketplaceInstanceResponse> {
    return this.sendApiRequest<MarketplaceInstanceResponse>(
      HttpMethods.POST,
      `/v1/compute-instance/template`,
      computeInstance
    );
  }

  async getComputeInstanceDomains(id: string): Promise<Domain[]> {
    const result: { domains: Domain[] } = await this.sendApiRequest<{
      domains: Domain[];
    }>(HttpMethods.GET, `/v1/compute-instance/${id}/domains`);

    return result.domains;
  }

  async addComputeInstanceDomain(
    instanceId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    const response = await this.sendApiRequest<{ domain: Domain }>(
      HttpMethods.POST,
      `/v1/compute-instance/${instanceId}/domains`,
      doamin
    );

    return response.domain;
  }

  async updateComputeInstanceDomain(
    instanceId: string,
    domainId: string,
    doamin: {
      link: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<Domain> {
    const response = await this.sendApiRequest<{ domain: Domain }>(
      HttpMethods.PATCH,
      `/v1/compute-instance/${instanceId}/domains/${domainId}`,
      doamin
    );

    return response.domain;
  }

  async deleteComputeInstanceDomain(
    instanceId: string,
    domainId: string
  ): Promise<void> {
    await this.sendApiRequest<Domain>(
      HttpMethods.DELETE,
      `/v1/compute-instance/${instanceId}/domains/${domainId}`
    );
  }

  async verifyComputeInstanceDomain(
    instanceId: string,
    domainId: string
  ): Promise<void> {
    await this.sendApiRequest<Domain>(
      HttpMethods.PATCH,
      `/v1/compute-instance/${instanceId}/domains/${domainId}/verify`
    );
  }

  async getComputeMachines(options: {
    skip: number;
    limit: number;
    searchString?: string;
    region?: string;
    provider?: string;
    scalingMode?: string;
    machineImageType?: string;
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

  async triggerComputeInstanceHealthCheck(
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
      `/v1/compute-instance/${instanceId}/trigger/container-health-check?topicId=${topicId}`
    );
  }

  async triggerComputeInstanceStatusCheck(
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
      `/v1/compute-instance/${instanceId}/trigger/container-health-check?topicId=${topicId}`
    );
  }

  async triggerComputeInstanceLogFetch(
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
      `/v1/compute-instance/${instanceId}/trigger/fetch-logs?topicId=${topicId}`
    );
  }

  async getPriceForToken(tokenId: number): Promise<number> {
    const response = await this.sendApiRequest<{
      message: string;
      price: number;
    }>(HttpMethods.GET, `/v1/price/liveTokenPrice/${tokenId}`);

    return response.price;
  }

  async executeShellCommand(
    instanceId: string,
    command: string
  ): Promise<ShellExecutionResponse> {
    const response = await this.sendApiRequest<ShellExecutionResponse>(
      HttpMethods.POST,
      `/v1/compute-instance/${instanceId}/exec-command`,
      { command }
    );
    return response;
  }

  async getOrganizationComputeProjectCount(id: string): Promise<number> {
    const result = await this.sendApiRequest<{ count: number }>(
      HttpMethods.GET,
      `/v1/organization/${id}/compute-projects/count`
    );
    return result.count;
  }

  //#gpt api
  async getGPTResponse(body: { query: string }): Promise<{ response: string }> {
    const response: any = await this.sendApiRequest(
      HttpMethods.POST,
      "/v1/gpt/query",
      body
    );

    return response;
  }

  async isWhitelisted(): Promise<any> {
    const response: any = await this.sendApiRequest(
      HttpMethods.GET,
      "/v1/gpt/whitelisted"
    );

    return response;
  }

  //#region Bucket API

  async getOrganizationBuckets({
    organizationId,
    name,
    state,
    skip,
    limit,
  }: {
    organizationId: string;
    name?: string;
    state?: BucketStateEnum;
    skip: number;
    limit: number;
  }): Promise<{ buckets: Bucket[] }> {
    if (!organizationId) {
      throw new Error("Organization Id is not provided.");
    }
    if (skip < 0 || limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    return await this.sendApiRequest<{ buckets: Bucket[] }>(
      HttpMethods.GET,
      `/v1/organization/${organizationId}/buckets`,
      null,
      {
        name: name ?? "",
        state: state ?? "",
        skip,
        limit,
      }
    );
  }

  async getOrganizationBucketCount({
    organizationId,
    name,
    state,
  }: {
    organizationId: string;
    name?: string;
    state?: BucketStateEnum;
  }): Promise<{ count: number }> {
    if (!organizationId) {
      throw new Error("Organization Id is not provided.");
    }

    return await this.sendApiRequest<{ count: number }>(
      HttpMethods.GET,
      `/v1/organization/${organizationId}/buckets/count`,
      null,
      {
        name: name ?? "",
        state: state ?? "",
      }
    );
  }

  async getBucket(bucketId: string): Promise<Bucket> {
    return await this.sendApiRequest<Bucket>(
      HttpMethods.GET,
      `/v1/bucket/${bucketId}`
    );
  }

  async updateBucketState(
    bucketId: string,
    state: BucketStateEnum
  ): Promise<Bucket> {
    return await this.sendApiRequest<Bucket>(
      HttpMethods.PATCH,
      `/v1/bucket/${bucketId}/state`,
      { state }
    );
  }

  async getBucketDomains(
    bucketId: string
  ): Promise<{ domains: BucketDomain[] }> {
    return await this.sendApiRequest<{ domains: BucketDomain[] }>(
      HttpMethods.GET,
      `/v1/bucket/${bucketId}/domains`
    );
  }

  async getBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ domain: BucketDomain }> {
    return await this.sendApiRequest<{ domain: BucketDomain }>(
      HttpMethods.GET,
      `/v1/bucket/${bucketId}/domains/${domainIdentifier}`
    );
  }

  async addBucketDomain(
    bucketId: string,
    options: {
      link?: string;
      type: DomainTypeEnum | string;
      name: string;
    }
  ): Promise<{ domain: BucketDomain }> {
    return await this.sendApiRequest<{ domain: BucketDomain }>(
      HttpMethods.POST,
      `/v1/bucket/${bucketId}/domains`,
      options
    );
  }

  async patchBucketDomain(
    bucketId: string,
    domainIdentifier: string,
    options: {
      link?: string;
      name: string;
    }
  ): Promise<{ domain: BucketDomain }> {
    return await this.sendApiRequest<{ domain: BucketDomain }>(
      HttpMethods.PATCH,
      `/v1/bucket/${bucketId}/domains/${domainIdentifier}`,
      options
    );
  }

  async verifyBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean; domain: BucketDomain }> {
    return await this.sendApiRequest<{
      success: boolean;
      domain: BucketDomain;
    }>(
      HttpMethods.PATCH,
      `/v1/bucket/${bucketId}/domains/${domainIdentifier}/verify`,
      {}
    );
  }

  async deleteBucketDomain(
    bucketId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.sendApiRequest(
      HttpMethods.DELETE,
      `/v1/bucket/${bucketId}/domains/${domainIdentifier}`
    );
  }

  async getBucketIpnsRecords(
    bucketId: string
  ): Promise<{ ipnsRecords: BucketIpnsRecord[] }> {
    return await this.sendApiRequest<{ ipnsRecords: BucketIpnsRecord[] }>(
      HttpMethods.GET,
      `/v1/bucket/${bucketId}/ipns-records`
    );
  }

  async getBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string
  ): Promise<{ ipnsRecord: BucketIpnsRecord }> {
    return await this.sendApiRequest<{ ipnsRecord: BucketIpnsRecord }>(
      HttpMethods.GET,
      `/v1/bucket/${bucketId}/ipns-records/${ipnsRecordId}`
    );
  }

  async addBucketIpnsRecord(
    bucketId: string,
    uploadId: string
  ): Promise<{ ipnsRecord: BucketIpnsRecord }> {
    return await this.sendApiRequest<{ ipnsRecord: BucketIpnsRecord }>(
      HttpMethods.POST,
      `/v1/bucket/${bucketId}/ipns-records`,
      {
        uploadId,
      }
    );
  }

  async patchBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string,
    uploadId: string
  ): Promise<{ ipnsRecord: BucketIpnsRecord }> {
    return await this.sendApiRequest<{ ipnsRecord: BucketIpnsRecord }>(
      HttpMethods.PATCH,
      `/v1/bucket/${bucketId}/ipns-records/${ipnsRecordId}`,
      {
        uploadId,
      }
    );
  }

  async deleteBucketIpnsRecord(
    bucketId: string,
    ipnsRecordId: string
  ): Promise<void> {
    await this.sendApiRequest(
      HttpMethods.DELETE,
      `/v1/bucket/${bucketId}/ipns-records/${ipnsRecordId}`
    );
  }

  async getBucketUploads(
    bucketId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<{ uploads: Upload[] }> {
    if (options.skip < 0 || options.limit < 0) {
      throw new Error(`Skip and Limit cannot be negative numbers.`);
    }
    const uploads = await this.sendApiRequest<Upload[]>(
      HttpMethods.GET,
      `/v1/bucket/${bucketId}/uploads?skip=${options.skip}&limit=${options.limit}`
    );
    return { uploads };
  }

  async getBucketUploadCount(bucketId: string): Promise<{
    count: number;
  }> {
    return await this.sendApiRequest<{
      count: number;
    }>(HttpMethods.GET, `/v1/bucket/${bucketId}/uploads/count`);
  }

  async migrateStaticSiteOrgToStorage(
    webappOrganizationId: string,
    storageOrganizationId: string
  ): Promise<{
    numberOfBuckets: number;
    numberOfUploads: number;
  }> {
    return await this.sendApiRequest<{
      numberOfBuckets: number;
      numberOfUploads: number;
    }>(
      HttpMethods.POST,
      `/v1/organization/${storageOrganizationId}/migrate-projects`,
      {
        webappOrganizationId,
      }
    );
  }

  //#endregion Bucket API

  //#region Upload API

  async getUpload(uploadId: string): Promise<Upload> {
    const { upload } = await this.sendApiRequest<{
      upload: Upload;
    }>(HttpMethods.GET, `/v1/upload/${uploadId}`);
    return upload;
  }

  async pinUpload(uploadId: string): Promise<Upload> {
    const { upload } = await this.sendApiRequest<{
      upload: Upload;
    }>(HttpMethods.PATCH, `/v1/upload/${uploadId}/pin`);
    return upload;
  }

  async unpinUpload(uploadId: string): Promise<Upload> {
    const { upload } = await this.sendApiRequest<{
      upload: Upload;
    }>(HttpMethods.PATCH, `/v1/upload/${uploadId}/unpin`);
    return upload;
  }

  //#region Upload API

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
