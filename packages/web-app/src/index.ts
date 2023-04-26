import {
  FrameworkEnum,
  NodeVersionEnum,
  ProtocolEnum,
  SpheronApi,
  TokenScope,
  ProviderEnum,
  Deployment,
  StartDeploymentConfiguration,
  DeploymentStatusEnum,
  ProjectStateEnum,
  Configuration,
  EnvironmentVariable,
  DeploymentEnvironmentStatusEnum,
  Domain,
  DomainTypeEnum,
  UsageWithLimits,
} from "@spheron/core";
import OrganizationManager from "./organization-manager";
import { Organization } from "./interfaces";
import ProjectManager from "./project-manager";

export {
  ProtocolEnum,
  TokenScope,
  Organization,
  NodeVersionEnum,
  FrameworkEnum,
  ProviderEnum,
  Deployment,
  StartDeploymentConfiguration,
  DeploymentStatusEnum,
  ProjectStateEnum,
  Configuration,
  EnvironmentVariable,
  DeploymentEnvironmentStatusEnum,
  Domain,
  DomainTypeEnum,
  UsageWithLimits,
};

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;

  public readonly organizations: OrganizationManager;
  public readonly projects: ProjectManager;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);
    this.organizations = new OrganizationManager(this.spheronApi);
    this.projects = new ProjectManager(this.spheronApi);
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.spheronApi.getTokenScope();
  }

  async getProjectDeployments(
    projectId: string,
    options: {
      skip: number;
      limit: number;
      status?: DeploymentStatusEnum;
    }
  ): Promise<Deployment[]> {
    return (await this.spheronApi.getProjectDeployments(projectId, options))
      .deployments;
  }

  async getProjectDeploymentCount(projectId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }> {
    return await this.spheronApi.getProjectDeploymentCount(projectId);
  }

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
    return await this.spheronApi.startDeployment({
      ...configuration,
      configuration: {
        ...configuration.configuration,
        framework: FrameworkEnum.SIMPLE_JAVASCRIPT_APP,
      },
    });
  }

  public async cancelDeployment(deploymentId: string): Promise<{
    message: string;
    canceled: true;
    killing: true;
  }> {
    return await this.spheronApi.cancelDeployment(deploymentId);
  }

  public async authorizeDeployment(deploymentId: string): Promise<Deployment> {
    return await this.spheronApi.authorizeDeployment(deploymentId);
  }

  public async getDeployment(deploymentId: string): Promise<Deployment> {
    return await this.spheronApi.getDeployment(deploymentId);
  }

  public async redeployDeployment(deploymentId: string): Promise<{
    success: boolean;
    message: string;
    topic: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    return await this.spheronApi.redeployDeployment(deploymentId);
  }

  async suggestFramework(options: {
    owner: string;
    branch: string;
    provider: ProviderEnum;
    repositoryName: string;
    root?: string;
  }): Promise<{ suggestedFramework: FrameworkEnum }> {
    return this.spheronApi.suggestFramework(options);
  }
}

export default SpheronClient;
