import axios, { AxiosRequestConfig } from "axios";
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
  Project,
  TokenScope,
} from "./interfaces";

class SpheronApi {
  private readonly spheronApiUrl = "https://api-v2.spheron.network";
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getTokenScope(): Promise<TokenScope> {
    const { data } = await axios.get<TokenScope>(
      `${this.spheronApiUrl}/v1/api-keys/scope`,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async getProject(projectId: string): Promise<Project> {
    const { data } = await axios.get<Project>(
      `${this.spheronApiUrl}/v1/project/${projectId}`,
      this.getAxiosRequestConfig()
    );
    return data;
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
    const { data } = await axios.get<Deployment[]>(
      `${this.spheronApiUrl}/v1/project/${projectId}/deployments?skip=${
        options.skip
      }&limit=${options.limit}${
        options.status ? `&status=${options.status}` : ""
      }`,
      this.getAxiosRequestConfig()
    );
    return { deployments: data };
  }

  async getProjectDomains(projectId: string): Promise<{ domains: Domain[] }> {
    const { data } = await axios.get<{ domains: Domain[] }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/domains`,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async getProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    const { data } = await axios.get<{ domain: Domain }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/domains/${domainIdentifier}`,
      this.getAxiosRequestConfig()
    );
    return data;
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
    const { data } = await axios.post<{ domain: Domain }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/domains`,
      options,
      this.getAxiosRequestConfig()
    );
    return data;
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
    const { data } = await axios.patch<{ domain: Domain }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/domains/${domainIdentifier}`,
      options,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async verifyProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean; domain: Domain }> {
    const { data } = await axios.patch<{ success: boolean; domain: Domain }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/domains/${domainIdentifier}/verify`,
      {},
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async deleteProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean }> {
    const { data } = await axios.delete<{ success: boolean }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/domains/${domainIdentifier}`,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async getProjectDeploymentCount(projectId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }> {
    const { data } = await axios.get<{
      total: number;
      successful: number;
      failed: number;
      pending: number;
    }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/deployments/count`,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async updateProjectState(
    projectId: string,
    state: ProjectStateEnum | string
  ): Promise<{ message: string }> {
    const { data } = await axios.patch<{ message: string }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/state`,
      { state },
      this.getAxiosRequestConfig()
    );
    return data;
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
    const { data } = await axios.put<{ configuration: Configuration }>(
      `${this.spheronApiUrl}/v1/project/${projectId}/configuration`,
      options,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  private getAxiosRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }
}

export default SpheronApi;
