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
import DeploymentManger from "./deployment-manager";

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
  public readonly deployments: DeploymentManger;

  constructor(configuration: SpheronClientConfiguration) {
    this.configuration = configuration;
    this.spheronApi = new SpheronApi(this.configuration.token);

    this.projects = new ProjectManager(this.spheronApi);
    this.deployments = new DeploymentManger(this.spheronApi);
    this.organizations = new OrganizationManager(this.spheronApi);
  }

  async getTokenScope(): Promise<TokenScope> {
    return await this.spheronApi.getTokenScope();
  }
}

export default SpheronClient;
