import {
  Organization as CoreOrganization,
  Project as CoreProject,
  Configuration as CoreConfiguration,
  EnvironmentVariable as CoreEnvironmentVariable,
  DeploymentEnvironment as CoreDeploymentEnvironment,
  Deployment as CoreDeployment,
  UsageWithLimits as CoreUsageWithLimits,
  Domain as CoreDomain,
} from "@spheron/core";
import {
  Configuration,
  Deployment,
  DeploymentEnvironment,
  DeploymentLog,
  Domain,
  EnvironmentVariable,
  Organization,
  Project,
  UsageWithLimits,
} from "./interfaces";

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

const mapCoreUsageWithLimits = (
  usage: CoreUsageWithLimits
): UsageWithLimits => {
  return {
    used: {
      bandwidth: usage.usedBandwidth ?? 0,
      buildExecution: usage.usedBuildExecution ?? 0,
      concurrentBuild: usage.usedConcurrentBuild ?? 0,
      storageArweave: usage.usedStorageArweave ?? 0,
      storageIPFS: usage.usedStorageIPFS ?? 0,
      deploymentsPerDay: usage.usedDeploymentsPerDay ?? 0,
      domains: usage.usedDomains ?? 0,
      hnsDomains: usage.usedHnsDomains ?? 0,
      ensDomains: usage.usedEnsDomains ?? 0,
      environments: usage.usedEnvironments ?? 0,
      numberOfRequests: usage.usedNumberOfRequests ?? 0,
      passwordProtection: usage.usedPasswordProtections ?? 0,
    },
    limit: {
      bandwidth: usage.bandwidthLimit ?? 0,
      buildExecution: usage.buildExecutionLimit ?? 0,
      concurrentBuild: usage.concurrentBuildLimit ?? 0,
      storageArweave: usage.storageArweaveLimit ?? 0,
      storageIPFS: usage.storageIPFSLimit ?? 0,
      deploymentsPerDay: usage.deploymentsPerDayLimit ?? 0,
      domains: usage.domainsLimit ?? 0,
      hnsDomains: usage.hnsDomainsLimit ?? 0,
      ensDomains: usage.ensDomainsLimit ?? 0,
      environments: usage.environmentsLimit ?? 0,
      membersLimit: usage.membersLimit ?? 0,
    },
  };
};

const mapCoreDeployment = (coreDeployment: CoreDeployment): Deployment => {
  return {
    id: coreDeployment._id,
    status: coreDeployment.status,
    configuration: mapCoreConfiguration(coreDeployment.configuration),
    buildTime: coreDeployment.buildTime,
    fileSize: coreDeployment.memoryUsed,
    deploymentEnvironmentName: coreDeployment.deploymentEnvironmentName,
    commitId: coreDeployment.commitId,
    branch: coreDeployment.branch,
    protocol: coreDeployment.protocol,
    sitePreview: coreDeployment.sitePreview,
  };
};

const mapCoreDeploymentLogs = (
  coreDeployment: CoreDeployment
): DeploymentLog[] => {
  return coreDeployment.logs.map((x) => ({
    log: x.log,
    time: x.time,
  }));
};

export {
  mapCoreOrganization,
  mapCoreConfiguration,
  mapCoreProject,
  mapCoreDeploymentEnvironment,
  mapCoreEnvironmentVariable,
  mapCoreDomain,
  mapCoreDeployment,
  mapCoreDeploymentLogs,
  mapCoreUsageWithLimits,
};
