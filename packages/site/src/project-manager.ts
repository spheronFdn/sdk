import {
  ProjectStateEnum,
  SpheronApi,
  ProtocolEnum,
  DomainTypeEnum,
  DeploymentStatusEnum,
} from "@spheron/core";
import {
  Configuration,
  Deployment,
  DeploymentCount,
  DeploymentEnvironment,
  Domain,
  EnvironmentVariable,
  Project,
} from "./interfaces";
import {
  mapCoreProject,
  mapCoreConfiguration,
  mapCoreDeployment,
  mapCoreDeploymentEnvironment,
  mapCoreDomain,
  mapCoreEnvironmentVariable,
} from "./interface-mappers";

class ProjectManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async get(projectId: string): Promise<Project> {
    const project = await this.spheronApi.getProject(projectId);
    return mapCoreProject(project);
  }

  async archive(projectId: string): Promise<void> {
    await this.spheronApi.updateProjectState(
      projectId,
      ProjectStateEnum.ARCHIVED
    );
  }

  async unarchive(projectId: string): Promise<void> {
    await this.spheronApi.updateProjectState(
      projectId,
      ProjectStateEnum.MAINTAINED
    );
  }

  async updateConfiguration(
    projectId: string,
    configuration: Configuration
  ): Promise<Configuration> {
    const { configuration: updated } =
      await this.spheronApi.updateProjectConfiguration(
        projectId,
        configuration
      );
    return mapCoreConfiguration(updated);
  }

  async getEnvironmentVariables(
    projectId: string
  ): Promise<EnvironmentVariable[]> {
    const project = await this.spheronApi.getProject(projectId);
    return project.environmentVariables.map((x) =>
      mapCoreEnvironmentVariable(x)
    );
  }

  async addEnvironmentVariable(
    projectId: string,
    environmentVariables: {
      name: string;
      value: string;
      environments: string[];
    }[]
  ): Promise<EnvironmentVariable[]> {
    const { environmentVariables: added } =
      await this.spheronApi.addProjectEnvironmentVariables(
        projectId,
        environmentVariables
      );
    return added.map((x) => mapCoreEnvironmentVariable(x));
  }

  async updateEnvironmentVariable(
    projectId: string,
    environmentVariableId: string,
    configuration: { name: string; value: string; environments: string[] }
  ): Promise<EnvironmentVariable> {
    const updated = await this.spheronApi.updateProjectEnvironmentVariable(
      projectId,
      environmentVariableId,
      configuration
    );
    return mapCoreEnvironmentVariable(updated);
  }

  async deleteEnvironmentVariable(
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
    const deploymentEnvironments =
      await this.spheronApi.getDeploymentEnvironments(projectId);
    return deploymentEnvironments.map((x) => mapCoreDeploymentEnvironment(x));
  }

  async createDeploymentEnvironment(
    projectId: string,
    payload: {
      name: string;
      branches: string[];
      protocol: ProtocolEnum;
    }
  ): Promise<DeploymentEnvironment> {
    const added = await this.spheronApi.createDeploymentEnvironment(
      projectId,
      payload
    );
    return mapCoreDeploymentEnvironment(added);
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
    const updated = await this.spheronApi.updateDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId,
      payload
    );
    return mapCoreDeploymentEnvironment(updated);
  }

  async deleteDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<void> {
    await this.spheronApi.deleteDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId
    );
  }

  async activateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<DeploymentEnvironment> {
    const updated = await this.spheronApi.activateDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId
    );
    return mapCoreDeploymentEnvironment(updated);
  }

  async deactivateDeploymentEnvironment(
    projectId: string,
    deploymentEnvironmentId: string
  ): Promise<DeploymentEnvironment> {
    const updated = await this.spheronApi.deactivateDeploymentEnvironment(
      projectId,
      deploymentEnvironmentId
    );
    return mapCoreDeploymentEnvironment(updated);
  }

  async getDomains(projectId: string): Promise<Domain[]> {
    const { domains } = await this.spheronApi.getProjectDomains(projectId);
    return domains.map((x) => mapCoreDomain(x));
  }

  async getDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.getProjectDomain(
      projectId,
      domainIdentifier
    );
    return mapCoreDomain(domain);
  }

  async addDomain(
    projectId: string,
    payload: {
      link?: string;
      type: DomainTypeEnum | string;
      deploymentEnvironments?: string[];
      name: string;
    }
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.addProjectDomain(
      projectId,
      payload
    );
    return mapCoreDomain(domain);
  }

  async updateDomain(
    projectId: string,
    domainIdentifier: string,
    payload: {
      link?: string;
      deploymentEnvironments?: string[];
      name: string;
    }
  ): Promise<Domain> {
    const { domain } = await this.spheronApi.patchProjectDomain(
      projectId,
      domainIdentifier,
      payload
    );
    return mapCoreDomain(domain);
  }

  async verifyDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<{ success: boolean; domain: Domain }> {
    const { success, domain } = await this.spheronApi.verifyProjectDomain(
      projectId,
      domainIdentifier
    );
    return { success, domain: mapCoreDomain(domain) };
  }

  async deleteDomain(
    projectId: string,
    domainIdentifier: string
  ): Promise<void> {
    await this.spheronApi.deleteProjectDomain(projectId, domainIdentifier);
  }

  async getDeployments(
    projectId: string,
    options: {
      skip: number;
      limit: number;
      status?: DeploymentStatusEnum;
    }
  ): Promise<Deployment[]> {
    const { deployments } = await this.spheronApi.getProjectDeployments(
      projectId,
      options
    );
    return deployments.map((x) => mapCoreDeployment(x));
  }

  async getDeploymentCount(projectId: string): Promise<DeploymentCount> {
    return await this.spheronApi.getProjectDeploymentCount(projectId);
  }
}

export default ProjectManager;
