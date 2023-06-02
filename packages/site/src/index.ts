import OrganizationManager from "./organization-manager";
import {
  Organization,
  Configuration,
  Project,
  DeploymentEnvironment,
  EnvironmentVariable,
  Domain,
  Deployment,
  DeploymentLog,
  StartDeploymentConfiguration,
  UsageWithLimits,
  DeploymentCount,
  DeploymentResponse,
  CancelDeploymentResponse,
} from "./interfaces";
import ProjectManager from "./project-manager";
import DeploymentManger from "./deployment-manager";
import {
  ProjectStateEnum,
  SpheronApi,
  TokenScope,
  NodeVersionEnum,
  ProviderEnum,
  FrameworkEnum,
  ProtocolEnum,
  DeploymentStatusEnum,
} from "@spheron/core";

export {
  TokenScope,
  Organization,
  Project,
  UsageWithLimits,
  ProjectStateEnum,
  Configuration,
  NodeVersionEnum,
  ProviderEnum,
  FrameworkEnum,
  EnvironmentVariable,
  DeploymentEnvironment,
  ProtocolEnum,
  DeploymentCount,
  Deployment,
  DeploymentStatusEnum,
  DeploymentResponse,
  CancelDeploymentResponse,
  Domain,
  DeploymentLog,
  StartDeploymentConfiguration,
};

export interface SpheronClientConfiguration {
  token: string;
}

export class SpheronClient {
  private readonly configuration: SpheronClientConfiguration;
  private readonly spheronApi: SpheronApi;

  public readonly organization: OrganizationManager;
  public readonly projects: ProjectManager;
  public readonly deployments: DeploymentManger;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);

    this.projects = new ProjectManager(this.spheronApi);
    this.deployments = new DeploymentManger(this.spheronApi);
    this.organization = new OrganizationManager(this.spheronApi);
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.spheronApi.getTokenScope();
  }
}

export default SpheronClient;
