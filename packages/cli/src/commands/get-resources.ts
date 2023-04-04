import {
  AppTypeEnum,
  Deployment,
  DeploymentEnvironment,
  DeploymentStatusEnum,
  Domain,
  Organization,
  Project,
  User,
} from "@spheron/core";
import Spinner from "../outputs/spinner";
import SpheronApiService from "../services/spheron-api";
import { readFromJsonFile } from "../utils";
import configuration from "../configuration";

export const ResourceFetcher = {
  async getOrganization(id: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      if (!id) {
        id = await readFromJsonFile(
          "organization",
          configuration.configFilePath
        );
        if (!id) {
          throw new Error("OrganizationId not provided");
        }
      }
      const organization: Organization =
        await SpheronApiService.getOrganization(id);
      console.log("Organization details:");
      const orgDTO = toOrganizationDTO(organization);
      console.log(JSON.stringify(orgDTO, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching organization details`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getUserOrganizations() {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const user: User = await SpheronApiService.getProfile();
      console.log(`User ${user.platformProfile?.username} organizations:`);
      const organizations = user.organizations.map((x) => {
        return toOrganizationDTO(x);
      });
      console.log(JSON.stringify(organizations, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching user organizations`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getOrganizationProjects(
    organizationId?: string,
    skip?: number,
    limit?: number,
    state?: string
  ) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      if (!organizationId) {
        organizationId = await readFromJsonFile(
          "organization",
          configuration.configFilePath
        );
        if (!organizationId) {
          throw new Error("OrganizationId not provided");
        }
      }
      const projects: Project[] =
        await SpheronApiService.getOrganizationProjects(
          organizationId,
          skip,
          limit,
          state
        );
      const projectDtos = projects.map((x) => {
        return toProjectDTO(x);
      });
      console.log("Projects:");
      console.log(JSON.stringify(projectDtos, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching organization projects`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getProject(projectId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const project: Project = await SpheronApiService.getProject(projectId);
      const projectDto = toProjectDTO(project);
      console.log("Project:");
      console.log(JSON.stringify(projectDto, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching project details`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getProjectDeployments(
    projectId: string,
    skip?: number,
    limit?: number,
    status?: DeploymentStatusEnum
  ) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const deployments: Deployment[] =
        await SpheronApiService.getProjectDeployments(
          projectId,
          skip,
          limit,
          status
        );
      console.log("Deployments:");
      const deploymentsDtos = deployments.map((x) => {
        return toDeploymentDTO(x);
      });
      console.log(JSON.stringify(deploymentsDtos, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching organization deployments`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getDeployment(id: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const deployment: Deployment = await SpheronApiService.getDeployment(id);
      console.log("Deployment:");
      const deploymentDto = toDeploymentDTO(deployment);
      console.log(JSON.stringify(deploymentDto, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching deployment details`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getProjectDomains(projectId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const domains: Domain[] = await SpheronApiService.getProjectDomains(
        projectId
      );
      const domainsDtos = domains.map((x) => {
        return toDomainDTO(x);
      });
      console.log("Domains:");
      console.log(JSON.stringify(domainsDtos, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching project domains`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getProjectDeploymentEnvironments(projectId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const deploymentEnvironments: DeploymentEnvironment[] =
        await SpheronApiService.getProjectDeploymentEnvironments(projectId);
      console.log("Deployment environments:");
      const deploymentEnvironemntsDtos = deploymentEnvironments.map((x) => {
        return toDeploymentEnvironmentDTO(x);
      });
      console.log(JSON.stringify(deploymentEnvironemntsDtos, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching deployment environments`);
      throw error;
    } finally {
      spinner.stop();
    }
  },
};

export enum ResourceEnum {
  PROJECT = "project",
  PROJECTS = "projects",
  DEPLOYMENT = "deployment",
  DEPLOYMENTS = "deployments",
  ORGANIZATION = "organization",
  ORGANIZATIONS = "organizations",
  DOMAINS = "domains",
  DEPLOYMENT_ENVIRONMENTS = "deployment-environments",
}

interface OrganizationDTO {
  _id: string;
  appType: AppTypeEnum;
  profile: {
    name: string;
    image: string;
    username: string;
  };
  usersCount: number;
  overdue: boolean;
}

interface ProjectDTO {
  _id: string;
  name: string;
  url: string;
  type: string;
  state: string;
  organization: string;
  deploymentEnvironments: DeploymentEnvironmntDTO[];
  domains: DomainDTO[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeploymentEnvironmntDTO {
  _id: string;
  name: string;
  protocol: string;
  branches: string[];
}

interface DomainDTO {
  _id: string;
  name: string;
  link: string;
  projectId: string;
  type: string;
}

interface DeploymentDTO {
  _id: string;
  configuration: any;
  buildDirectory: any;
  project: string;
  status: string;
  deploymentEnvironmentName: string;
  commitId: string;
  branch: string;
  protocol: string;
  contentHash: string;
  sitePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

const toOrganizationDTO = function (
  organization: Organization
): OrganizationDTO {
  const org: OrganizationDTO = {
    _id: organization._id,
    appType: organization.appType,
    overdue: organization.overdue,
    profile: organization.profile,
    usersCount: organization.users?.length,
  };
  return org;
};

const toDeploymentEnvironmentDTO = function (
  deploymentEnvironemnt: DeploymentEnvironment
): DeploymentEnvironmntDTO {
  return {
    _id: deploymentEnvironemnt._id,
    name: deploymentEnvironemnt.name,
    protocol: deploymentEnvironemnt.protocol,
    branches: deploymentEnvironemnt.branches,
  };
};

const toDomainDTO = function (domain: Domain): DomainDTO {
  return {
    _id: domain._id,
    name: domain.name,
    link: domain.link,
    projectId: domain.projectId,
    type: domain.type,
  };
};

const toProjectDTO = function (project: Project): ProjectDTO {
  const deploymentEnvironments = project.deploymentEnvironments.map((x) => {
    return toDeploymentEnvironmentDTO(x);
  });
  const domains = project.domains.map((x) => {
    return toDomainDTO(x);
  });
  return {
    _id: project._id,
    name: project.name,
    url: project.url,
    type: project.type,
    state: project.state,
    organization: project.organization,
    deploymentEnvironments,
    domains,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

const toDeploymentDTO = function (deployment: Deployment): DeploymentDTO {
  return {
    _id: deployment._id,
    configuration: deployment.configuration,
    buildDirectory: deployment.buildDirectory,
    project: deployment.project._id,
    status: deployment.status,
    deploymentEnvironmentName: deployment.deploymentEnvironmentName,
    commitId: deployment.commitId,
    branch: deployment.branch,
    protocol: deployment.protocol,
    contentHash: deployment.contentHash,
    sitePreview: deployment.sitePreview,
    createdAt: deployment.createdAt,
    updatedAt: deployment.updatedAt,
  };
};
