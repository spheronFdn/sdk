import {
  Deployment as CoreDeployment,
  FrameworkEnum,
  ProviderEnum,
  SpheronApi,
  StartDeploymentConfiguration,
} from "@spheron/core";
import {
  Deployment,
  DeploymentLog,
  mapCoreDeployment,
  mapCoreDeploymentLogs,
} from "./interfaces";

class DeploymentManger {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  public async get(deploymentId: string): Promise<Deployment> {
    const deployment = await this.spheronApi.getDeployment(deploymentId);
    return mapCoreDeployment(deployment);
  }

  public async getLogs(deploymentId: string): Promise<DeploymentLog[]> {
    const deployment = await this.spheronApi.getDeployment(deploymentId);
    return mapCoreDeploymentLogs(deployment);
  }

  public async getBuildDirectory(deploymentId: string): Promise<string[]> {
    const deployment = await this.spheronApi.getDeployment(deploymentId);
    return deployment.buildDirectory;
  }

  public async start(configuration: StartDeploymentConfiguration): Promise<{
    success: boolean;
    message: string;
    topic: string;
    deploymentId: string;
    projectId: string;
    deployment: CoreDeployment;
  }> {
    return await this.spheronApi.startDeployment({
      ...configuration,
      configuration: {
        ...configuration.configuration,
        framework: FrameworkEnum.SIMPLE_JAVASCRIPT_APP,
      },
    });
  }

  public async cancel(deploymentId: string): Promise<{
    message: string;
    canceled: true;
    killing: true;
  }> {
    return await this.spheronApi.cancelDeployment(deploymentId);
  }

  public async authorize(deploymentId: string): Promise<CoreDeployment> {
    return await this.spheronApi.authorizeDeployment(deploymentId);
  }

  public async redeploy(deploymentId: string): Promise<{
    success: boolean;
    message: string;
    topic: string;
    deploymentId: string;
    projectId: string;
    deployment: CoreDeployment;
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

export default DeploymentManger;
