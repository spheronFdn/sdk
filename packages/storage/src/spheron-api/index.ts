import axios from "axios";
import config from "../config/env";
import {
  DeploymentStatusEnum,
  DomainTypeEnum,
  FrameworkEnum,
  NodeVersionEnum,
  ProjectStateEnum,
} from "./enums";
import {
  Configuration,
  Deployment,
  Domain,
  UsageWithLimitsWithSkynet,
  Project,
  TokenScope,
  IPNSPublishResponse,
} from "./interfaces";

class SpheronApi {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
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
      link: string;
      type: DomainTypeEnum | string;
      deploymentEnvironments: string[];
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
      link: string;
      deploymentEnvironments: string[];
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

  async getDeployment(deploymentId: string): Promise<Deployment> {
    const { deployment } = await this.sendApiRequest<{
      deployment: Deployment;
    }>(HttpMethods.GET, `/v1/deployment/${deploymentId}`);
    return deployment;
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

  public async publishIPNS(deploymentId: string): Promise<IPNSPublishResponse> {
    try {
      return await this.sendApiRequest<IPNSPublishResponse>(
        HttpMethods.POST,
        `/v1/ipns/deployments/${deploymentId}/names`
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  public async updateIPNSName(
    ipnsNameId: string,
    deploymentId: string
  ): Promise<IPNSPublishResponse> {
    try {
      return await this.sendApiRequest<IPNSPublishResponse>(
        HttpMethods.PUT,
        `/v1/ipns/deployments/${deploymentId}/names/${ipnsNameId}`
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  public async getIPNSName(ipnsNameId: string): Promise<IPNSPublishResponse> {
    try {
      return await this.sendApiRequest<IPNSPublishResponse>(
        HttpMethods.GET,
        `/v1/ipns/names/${ipnsNameId}`
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  public async getIPNSNamesForDeployment(
    deploymentId: string
  ): Promise<IPNSPublishResponse[]> {
    try {
      return await this.sendApiRequest<IPNSPublishResponse[]>(
        HttpMethods.GET,
        `/v1/ipns/deployments/${deploymentId}/names`
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  public async getIPNSNamesForOrganization(
    organizationId: string
  ): Promise<IPNSPublishResponse[]> {
    try {
      return await this.sendApiRequest<IPNSPublishResponse[]>(
        HttpMethods.GET,
        `/v1/ipns/names`,
        {
          organizationId,
        }
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  private async sendApiRequest<T>(
    method: HttpMethods,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any
  ): Promise<T> {
    try {
      const response = await axios<T>({
        method,
        url: `${config.spheronApiUrl}${path}`,
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
}

enum HttpMethods {
  GET = "Get",
  POST = "Post",
  PATCH = "Patch",
  DELETE = "Delete",
  PUT = "Put",
}

export default SpheronApi;
