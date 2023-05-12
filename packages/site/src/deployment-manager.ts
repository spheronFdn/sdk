import { SpheronApi } from "@spheron/core";
import {
  Deployment,
  DeploymentLog,
  StartDeploymentConfiguration,
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

  public async deploy(configuration: StartDeploymentConfiguration): Promise<{
    success: boolean;
    message: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    const response = await this.spheronApi.startDeployment({
      ...configuration,
      repoName: configuration.projectName,
      createDefaultWebhook: true,
    });
    return {
      success: response.success,
      message: response.message,
      deploymentId: response.deploymentId,
      projectId: response.projectId,
      deployment: mapCoreDeployment(response.deployment),
    };
  }

  public async cancel(deploymentId: string): Promise<{
    message: string;
    canceled: true;
    killing: true;
  }> {
    return await this.spheronApi.cancelDeployment(deploymentId);
  }

  public async authorize(deploymentId: string): Promise<{
    success: boolean;
    message: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    const response = await this.spheronApi.authorizeDeployment(deploymentId);
    return {
      success: response.success,
      message: response.message,
      deploymentId: response.deploymentId,
      projectId: response.projectId,
      deployment: mapCoreDeployment(response.deployment),
    };
  }

  public async redeploy(deploymentId: string): Promise<{
    success: boolean;
    message: string;
    deploymentId: string;
    projectId: string;
    deployment: Deployment;
  }> {
    const response = await this.spheronApi.redeployDeployment(deploymentId);
    return {
      success: response.success,
      message: response.message,
      deploymentId: response.deploymentId,
      projectId: response.projectId,
      deployment: mapCoreDeployment(response.deployment),
    };
  }
}

export default DeploymentManger;
