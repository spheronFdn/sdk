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
  DeploymentStatusEnum,
  ProjectStateEnum,
  Configuration,
  EnvironmentVariable,
  DeploymentEnvironmentStatusEnum,
  DeploymentEnvironment,
  Domain,
  DomainTypeEnum,
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
  DeploymentStatusEnum,
  ProjectStateEnum,
  Configuration,
  EnvironmentVariable,
  DeploymentEnvironmentStatusEnum,
  Domain,
  DomainTypeEnum,
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

  async getProject(projectId: string): Promise<Project> {
    return this.spheronApi.getProject(projectId);
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

  async updateProjectState(
    projectId: string,
    state: ProjectStateEnum
  ): Promise<{ message: string }> {
    return await this.spheronApi.updateProjectState(projectId, state);
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
    return await this.spheronApi.updateProjectConfiguration(projectId, options);
  }

  async addProjectEnvironmentVariables(
    projectId: string,
    environmentVariables: {
      name: string;
      value: string;
      environments: string[];
    }[]
  ): Promise<{ environmentVariables: EnvironmentVariable[] }> {
    return await this.spheronApi.addProjectEnvironmentVariables(
      projectId,
      environmentVariables
    );
  }

  async updateProjectEnvironmentVariable(
    projectId: string,
    environmentVariableId: string,
    configuration: { name: string; value: string; environments: string[] }
  ): Promise<EnvironmentVariable> {
    return await this.spheronApi.updateProjectEnvironmentVariable(
      projectId,
      environmentVariableId,
      configuration
    );
  }

  async deleteProjectEnvironmentVariable(
    projectId: string,
    environmentVariableId: string
  ): Promise<void> {
    await this.spheronApi.deleteProjectEnvironmentVariable(
      projectId,
      environmentVariableId
    );
  }

  async getDeploymentEnvironments(
    projectId: string
  ): Promise<DeploymentEnvironment[]> {
    return await this.spheronApi.getDeploymentEnvironments(projectId);
  }

  async createDeploymentEnvironment(
    projectId: string,
    payload: {
      name: string;
      branches: string[];
      protocol: ProtocolEnum;
    }
  ): Promise<DeploymentEnvironment> {
    return await this.spheronApi.createDeploymentEnvironment(
      projectId,
      payload
    );
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
    return await this.spheronApi.updateDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId,
      payload
    );
  }

  async deleteDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<{ message: string }> {
    return await this.spheronApi.deleteDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId
    );
  }

  async activateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<DeploymentEnvironment> {
    return await this.spheronApi.activateDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId
    );
  }

  async deactivateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<DeploymentEnvironment> {
    return await this.spheronApi.deactivateDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId
    );
  }

  async getProjectDomains(projectId: string): Promise<{ domains: Domain[] }> {
    return await this.spheronApi.getProjectDomains(projectId);
  }

  async getProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ domain: Domain }> {
    return await this.spheronApi.getProjectDomain(projectId, domainIdentifier);
  }

  async addProjectDomain(
    projectId: string,
    payload: {
      link?: string;
      type: DomainTypeEnum | string;
      deploymentEnvironments?: string[];
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    return await this.spheronApi.addProjectDomain(projectId, payload);
  }

  async updateProjectDomain(
    projectId: string,
    domainIdentifier: string,
    payload: {
      link?: string;
      deploymentEnvironments?: string[];
      name: string;
    }
  ): Promise<{ domain: Domain }> {
    return await this.spheronApi.patchProjectDomain(
      projectId,
      domainIdentifier,
      payload
    );
  }

  async verifyProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean; domain: Domain }> {
    return await this.spheronApi.verifyProjectDomain(
      projectId,
      domainIdentifier
    );
  }

  async deleteProjectDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.spheronApi.deleteProjectDomain(projectId, domainIdentifier);
  }
}

export default SpheronClient;
