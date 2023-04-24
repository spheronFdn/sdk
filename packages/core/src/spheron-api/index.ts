import axios from "axios";
import {
  AppTypeEnum,
  DeploymentStatusEnum,
  DomainTypeEnum,
  FrameworkEnum,
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
} from "./interfaces";

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
      state?: string;
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
      state?: string;
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

  async authorizeDeployment(deploymentId: string): Promise<Deployment> {
    const { deployment } = await this.sendApiRequest<{
      deployment: Deployment;
    }>(HttpMethods.POST, `/v1/deployment/${deploymentId}/authorize`);
    return deployment;
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
    }>(
      HttpMethods.GET,
      `/v1/deployment/framework/suggestion?owner=${options.owner}&branch=${options.branch}&provider=${options.provider}&repo=${options.repositoryName}&root=${options.root}`
    );
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

  private async sendApiRequest<T>(
    method: HttpMethods,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any
  ): Promise<T> {
    try {
      const response = await axios<T>({
        method,
        url: `${this.spheronApiUrl}${path}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
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
