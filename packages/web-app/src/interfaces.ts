import {
  Organization as CoreOrganization,
  Project as CoreProject,
  FrameworkEnum,
  NodeVersionEnum,
  ProjectStateEnum,
  ProviderEnum,
  Configuration as CoreConfiguration,
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

export {
  Organization,
  mapCoreOrganization,
  Configuration,
  mapCoreConfiguration,
  Project,
  mapCoreProject,
};
