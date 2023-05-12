import {
  Organization as CoreOrganization,
  Project as CoreProject,
  Configuration as CoreConfiguration,
  EnvironmentVariable as CoreEnvironmentVariable,
  DeploymentEnvironment as CoreDeploymentEnvironment,
  Deployment as CoreDeployment,
  UsageWithLimits as CoreUsageWithLimits,
  FrameworkEnum,
  NodeVersionEnum,
  ProjectStateEnum,
  ProviderEnum,
  ProtocolEnum,
  DomainTypeEnum,
  Domain as CoreDomain,
  DeploymentStatusEnum,
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

interface Deployment {
  id: string;
  status: DeploymentStatusEnum;
  configuration: Configuration;
  buildTime: number;
  memoryUsed: number;
  deploymentEnvironmentName: string;
  commitId: string;
  branch: string;
  protocol: ProtocolEnum;
  sitePreview: string;
}

const mapCoreDeployment = (coreDeployment: CoreDeployment): Deployment => {
  return {
    id: coreDeployment._id,
    status: coreDeployment.status,
    configuration: mapCoreConfiguration(coreDeployment.configuration),
    buildTime: coreDeployment.buildTime,
    memoryUsed: coreDeployment.memoryUsed,
    deploymentEnvironmentName: coreDeployment.deploymentEnvironmentName,
    commitId: coreDeployment.commitId,
    branch: coreDeployment.branch,
    protocol: coreDeployment.protocol,
    sitePreview: coreDeployment.sitePreview,
  };
};

interface DeploymentLog {
  log: string;
  time: string;
}

const mapCoreDeploymentLogs = (
  coreDeployment: CoreDeployment
): DeploymentLog[] => {
  return coreDeployment.logs.map((x) => ({
    log: x.log,
    time: x.time,
  }));
};

interface StartDeploymentConfiguration {
  organizationId: string;
  gitUrl: string;
  projectName: string;
  branch: string;
  protocol: ProtocolEnum;
  provider: ProviderEnum;
  configuration: {
    buildCommand: string;
    installCommand: string;
    workspace: string;
    publishDir: string;
    framework: FrameworkEnum | string;
    nodeVersion: NodeVersionEnum;
  };
  env?: Record<string, string>;
}

interface UsageWithLimits {
  usedBandwidth?: number; // Bytes
  bandwidthLimit?: number; // Bytes
  usedBuildExecution?: number; // Seconds
  buildExecutionLimit?: number; // Seconds
  usedConcurrentBuild?: number;
  concurrentBuildLimit?: number;
  usedStorageArweave?: number; // Bytes
  storageArweaveLimit?: number; // Bytes
  usedStorageIPFS?: number; // Bytes
  storageIPFSLimit?: number;
  usedDeploymentsPerDay?: number;
  deploymentsPerDayLimit?: number;
  usedDomains?: number;
  domainsLimit?: number;
  usedHnsDomains?: number;
  hnsDomainsLimit?: number;
  usedEnsDomains?: number;
  ensDomainsLimit?: number;
  usedEnvironments?: number;
  environmentsLimit?: number;
  usedNumberOfRequests?: number;
  usedPasswordProtections?: number;
  membersLimit?: number;
}

const mapCoreUsageWithLimits = (
  usage: CoreUsageWithLimits
): UsageWithLimits => {
  return {
    usedBandwidth: usage.usedBandwidth,
    bandwidthLimit: usage.bandwidthLimit,
    usedBuildExecution: usage.usedBuildExecution,
    buildExecutionLimit: usage.buildExecutionLimit,
    usedConcurrentBuild: usage.usedConcurrentBuild,
    concurrentBuildLimit: usage.concurrentBuildLimit,
    usedStorageArweave: usage.usedStorageArweave,
    storageArweaveLimit: usage.storageArweaveLimit,
    usedStorageIPFS: usage.usedStorageIPFS,
    storageIPFSLimit: usage.storageIPFSLimit,
    usedDeploymentsPerDay: usage.usedDeploymentsPerDay,
    deploymentsPerDayLimit: usage.deploymentsPerDayLimit,
    usedDomains: usage.usedDomains,
    domainsLimit: usage.domainsLimit,
    usedHnsDomains: usage.usedHnsDomains,
    hnsDomainsLimit: usage.hnsDomainsLimit,
    usedEnsDomains: usage.usedEnsDomains,
    ensDomainsLimit: usage.ensDomainsLimit,
    environmentsLimit: usage.environmentsLimit,
    usedEnvironments: usage.usedEnvironments,
    usedNumberOfRequests: usage.usedNumberOfRequests,
    usedPasswordProtections: usage.usedPasswordProtections,
    membersLimit: usage.membersLimit,
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
  Deployment,
  mapCoreDeployment,
  DeploymentLog,
  mapCoreDeploymentLogs,
  StartDeploymentConfiguration,
  UsageWithLimits,
  mapCoreUsageWithLimits,
};
