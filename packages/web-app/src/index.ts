import {
  FrameworkEnum,
  IPNSName,
  NodeVersionEnum,
  Organization,
  Project,
  ProtocolEnum,
  SpheronApi,
  TokenScope,
  ProviderEnum,
  UsageWithLimits,
  Deployment,
  StartDeploymentConfiguration,
} from "@spheron/core";

export {
  ProtocolEnum,
  UsageWithLimits,
  TokenScope,
  IPNSName,
  Organization,
  NodeVersionEnum,
  FrameworkEnum,
  ProviderEnum,
  Deployment,
  StartDeploymentConfiguration,
};

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.spheronApi.getTokenScope();
  }

  async getOrganization(organizationId: string): Promise<Organization> {
    return await this.spheronApi.getOrganization(organizationId);
  }

  async getOrganizationProjects(
    organizationId: string,
    options: {
      skip: number;
      limit: number;
      state?: string;
    }
  ): Promise<Project[]> {
    return this.spheronApi.getOrganizationProjects(organizationId, options);
  }

  async getOrganizationProjectCount(
    organizationId: string,
    options: {
      state?: string;
    }
  ): Promise<number> {
    return this.spheronApi.getOrganizationProjectCount(organizationId, options);
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
