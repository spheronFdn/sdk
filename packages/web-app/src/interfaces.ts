import {
  Organization as CoreOrganization,
  Project as CoreProject,
  FrameworkEnum,
  NodeVersionEnum,
  ProjectStateEnum,
  ProviderEnum,
  Configuration as CoreConfiguration,
  EnvironmentVariable as CoreEnvironmentVariable,
  DeploymentEnvironment as CoreDeploymentEnvironment,
  ProtocolEnum,
  DomainTypeEnum,
  Domain as CoreDomain,
} from "@spheron/core";

interface Organization {
  id: string;
  profile: {
    name: string;
    username: string;
    image: string;
  };
}

const mapCoreOrganization = (
  coreOrganization: CoreOrganization
): Organization => {
  return {
    id: coreOrganization._id,
    profile: {
      name: coreOrganization.profile.name,
      username: coreOrganization.profile.username,
      image: coreOrganization.profile.image,
    },
  };
};

interface Configuration {
  buildCommand: string;
  installCommand: string;
  workspace: string;
  publishDir: string;
  framework: FrameworkEnum;
  nodeVersion: NodeVersionEnum;
}

const mapCoreConfiguration = (
  configuration: CoreConfiguration
): Configuration => {
  return {
    buildCommand: configuration.buildCommand,
    installCommand: configuration.installCommand,
    workspace: configuration.workspace,
    publishDir: configuration.publishDir,
    framework: configuration.framework,
    nodeVersion: configuration.nodeVersion,
  };
};

interface Project {
  id: string;
  name: string;
  state: ProjectStateEnum;
  url: string;
  organizationId: string;
  provider: ProviderEnum;
  configuration: Configuration;
}

const mapCoreProject = (coreProject: CoreProject): Project => {
  return {
    id: coreProject._id,
    name: coreProject.name,
    state: coreProject.state,
    url: coreProject.url,
    organizationId: coreProject.organization,
    provider: coreProject.provider,
    configuration: mapCoreConfiguration(coreProject.configuration),
  };
};

interface DeploymentEnvironment {
  id: string;
  name: string;
  protocol: ProtocolEnum;
  branches: string[];
}

const mapCoreDeploymentEnvironment = (
  deploymentEnvironment: CoreDeploymentEnvironment
): DeploymentEnvironment => {
  return {
    id: deploymentEnvironment._id,
    name: deploymentEnvironment.name,
    protocol: deploymentEnvironment.protocol,
    branches: deploymentEnvironment.branches,
  };
};

interface EnvironmentVariable {
  id: string;
  name: string;
  value: string;
  environments: string[];
}

const mapCoreEnvironmentVariable = (
  coreVariable: CoreEnvironmentVariable
): EnvironmentVariable => {
  return {
    id: coreVariable._id,
    name: coreVariable.name,
    value: coreVariable.value,
    environments: coreVariable.deploymentEnvironments.map((x) => x.name),
  };
};

interface Domain {
  id: string;
  name: string;
  verified: boolean;
  link: string;
  type: DomainTypeEnum;
  projectId: string;
  deploymentEnvironmentIds: string[];
}

const mapCoreDomain = (coreDomain: CoreDomain): Domain => {
  return {
    id: coreDomain._id,
    name: coreDomain.name,
    verified: coreDomain.verified,
    link: coreDomain.link,
    type: coreDomain.type,
    projectId: coreDomain.projectId,
    deploymentEnvironmentIds: coreDomain.deploymentEnvironmentIds,
  };
};

export {
  Organization,
  mapCoreOrganization,
  Configuration,
  mapCoreConfiguration,
  Project,
  mapCoreProject,
  DeploymentEnvironment,
  mapCoreDeploymentEnvironment,
  EnvironmentVariable,
  mapCoreEnvironmentVariable,
  Domain,
  mapCoreDomain,
};
