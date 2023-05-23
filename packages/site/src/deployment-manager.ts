import { SpheronApi } from "@spheron/core";
import {
  CancelDeploymentResponse,
  Deployment,
  DeploymentLog,
  DeploymentResponse,
  StartDeploymentConfiguration,
} from "./interfaces";
import OrganizationIdExtractor from "./organizationId-extractor";
import { mapCoreDeployment, mapCoreDeploymentLogs } from "./interface-mappers";

class DeploymentManger extends OrganizationIdExtractor {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    super(spheronApi);
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

  public async deploy(
    configuration: StartDeploymentConfiguration
  ): Promise<DeploymentResponse> {
    const response = await this.spheronApi.startDeployment({
      organizationId: await this.getOrganizationIdFromToken(),
      ...configuration,
      env: configuration.environmentVariables,
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

  public async cancel(deploymentId: string): Promise<CancelDeploymentResponse> {
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
