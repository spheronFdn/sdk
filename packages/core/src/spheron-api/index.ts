import axios from "axios";
import {
  AppTypeEnum,
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
  Organization,
  Project,
  TokenScope,
  VerifiedTokenResponse,
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
}

enum HttpMethods {
  GET = "Get",
  POST = "Post",
  PATCH = "Patch",
  DELETE = "Delete",
  PUT = "Put",
}

export default SpheronApi;
