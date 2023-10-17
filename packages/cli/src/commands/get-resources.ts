import {
  AppTypeEnum,
  Cluster,
  ComputeMachine,
  Deployment,
  DeploymentEnvironment,
  DeploymentStatusEnum,
  Domain,
  Env,
  ExtendedInstance,
  HealthCheck,
  Instance,
  InstanceOrder,
  MarketplaceApp,
  MarketplaceAppPort,
  MarketplaceAppVariable,
  MarketplaceCategoryEnum,
  Organization,
  PersistentStorage,
  Port,
  Project,
  User,
} from "@spheron/core";
import Spinner from "../outputs/spinner";
import Table from 'cli-table3';
import SpheronApiService, {
  toCliPersistentStorage,
} from "../services/spheron-api";
import MetadataService from "../services/metadata-service";
import {
  CliComputeInstanceType,
  CliCustomParams,
  InstanceVersionLogsTypeEnum,
  SpheronComputeConfiguration,
} from "./compute/interfaces";
import path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";
import chalk from "chalk";

export const ResourceFetcher = {
  async getOrganization(id: string, type: AppTypeEnum) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      if (!id) {
        let siteData;
        if (type == AppTypeEnum.COMPUTE) {
          siteData = await MetadataService.getComputeData();
        } else {
          siteData = await MetadataService.getSiteData();
        }
        id = siteData?.organizationId;
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
        const siteData = await MetadataService.getSiteData();
        organizationId = siteData?.organizationId;
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

  async getComputePlans(name?: string, info?: boolean) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      console.log('\n');
      
      if (name && info) {
        // Fetch detailed info for the specified plan
        const planDetail = await SpheronApiService.getComputePlans(name);
        spinner.stop();  // Assume getComputePlans is the method to fetch detailed plan info

        // Prepare the data for the table
        const data = Object.entries(planDetail[0]).map(([key, value]) => [key, value]);

        // Stop the spinner and log the table
        spinner.stop();
        console.log(createTable(['Property', 'Value'], data));
      } else {
        // Fetch all compute plans if name and info are not provided
        const computesPlans: ComputeMachine[] = await SpheronApiService.getComputePlans(name);
        spinner.stop();

        console.log("Compute plans:");

        // Set the headings and column widths
        const headings = ['Name', 'CPU', 'Storage', 'Memory', 'Max Price/Block', 'Daily Top Up', 'Top Up Threshold'];
        const colWidths = [20, 10, 10, 10, 20, 20, 20];

        // Prepare the data for the table
        const data = computesPlans.map(x => [
          x.name,
          x.cpu,
          x.storage,
          x.memory,
          x.maxPricePerBlock,
          x.defaultDailyTopUp.toFixed(3),
          x.topupThreashold
        ]);

        // Stop the spinner and log the table
        spinner.stop();
        console.log('\n');
        console.log(createTable(headings, data, colWidths));
      }

      spinner.success(``);

      // Output additional helpful commands
      console.log('\nHelpful Commands:');
      console.log('------------------');
      if (name) {
        console.log('To get a list of all available plans, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get plans'));
      } else {
        console.log('To get more detailed information about a specific plan, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get plans --name <name-of-plan>'));
      }
      console.log('\n');

    } catch (error) {
      console.log(`✖️  Error while fetching compute plans`);
      throw error;
    } finally {
      spinner.stop();
    }
  }
  ,
  async getComputeRegions() {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const regions: string[] = await SpheronApiService.getComputeRegions();

      // Prepare the data for the table
      const data = regions.map((region, index) => {
        return [region || `Unnamed region ${index + 1}`];  // Handle empty region names
      });

      spinner.stop();  // Stop spinner before logging the table

      console.log("Compute regions:");
      console.log(createTable(['Region Name'], data, [20]));

      spinner.success(``);
    } catch (error) {
      spinner.stop();  // Ensure spinner stops in case of error
      console.log(`✖️ Error while fetching compute regions`);
      throw error;
    }
  },

  async getClusters(organizationId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      if (!organizationId) {
        const computeData = await MetadataService.getComputeData();
        organizationId = computeData?.organizationId;
        if (!organizationId) {
          throw new Error("OrganizationId not provided");
        }
      }
      const clusters: Cluster[] = await SpheronApiService.getClusters(
        organizationId
      );
      const computeClusterDtos: ComputeClusterDTO[] = clusters.map((x) => {
        return toComputeClusterDTO(x);
      });
      console.log(JSON.stringify(computeClusterDtos, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute clusters`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getClusterInstances(clusterId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const instances: ExtendedInstance[] =
        await SpheronApiService.getClusterInstances(clusterId);
      const instancesDtos: BasicComputeInstanceDTO[] = instances.map((x) => {
        return toBasicComputeInstanceDTO(x);
      });
      console.log(JSON.stringify(instancesDtos, null, 2));
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute clusters`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getClusterInstance(
    id: string,
    downloadConfig: boolean,
    versionId?: string
  ) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      const instance: Instance = await SpheronApiService.getClusterInstance(id);
      let dto;
      if (instance && instance.activeOrder) {
        const order: InstanceOrder =
          await SpheronApiService.getClusterInstanceOrder(
            versionId ? versionId : instance.activeOrder
          );
        dto = toSuperComputeInstanceDTO(instance as ExtendedInstance, order);
        console.log(JSON.stringify(dto, null, 2));
        if (downloadConfig) {
          const config = await toSpheronComputeConfiguration(
            instance as ExtendedInstance,
            order
          );
          const updatedYamlData = yaml.dump(config);
          const instanceYamlFilePath = path.join(
            process.cwd(),
            `instance-${instance._id}.yaml`
          );
          fs.writeFile(instanceYamlFilePath, updatedYamlData, "utf8", (err) => {
            if (err) {
              console.error("Error writing file:", err);
            } else {
              console.log(`Instance data saved to ${instanceYamlFilePath}`);
            }
          });
        }
      } else {
        dto = toSuperComputeInstanceDTO(instance as ExtendedInstance);
        if (downloadConfig) {
          console.log(
            "✖️ There is no active version for this instance, configuration file could not be downloaded."
          );
        }
        console.log(JSON.stringify(dto, null, 2));
      }
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute instance`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getClusterInstanceOrderLogs(
    instanceId: string,
    logType: InstanceVersionLogsTypeEnum,
    from: number,
    to: number,
    versionId?: string,
    search?: string,
    download?: boolean,
    outputFileName?: string // Optional output file name parameter
  ) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      const instance: Instance = await SpheronApiService.getClusterInstance(
        instanceId
      );
      let result;
      if (instance && instance.activeOrder && !versionId) {
        result = await SpheronApiService.getClusterInstanceLogs(
          instance.activeOrder,
          logType,
          from,
          to,
          search
        );
      } else {
        const latestVersion = versionId
          ? versionId
          : instance.orders[instance.orders.length - 1];
        console.log(`Fetching logs for version: ${versionId}...`);
        result = await SpheronApiService.getClusterInstanceLogs(
          latestVersion,
          logType,
          from,
          to,
          search
        );
      }
      spinner.success(``);
      if (download) {
        const fileName = outputFileName || `instance-${instanceId}-logs.txt`;
        console.log(`Downloading logs to ${fileName}...`);
        const logText = result.logs.join("\n"); // Combine logs into a string
        // Write the logText to the specified file
        fs.writeFileSync(fileName, logText);
        console.log(`Logs have been downloaded to ${fileName}`);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log(`✖️  Error while fetching compute instance`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeTemplates(category?: MarketplaceCategoryEnum, name?: string, info?: boolean) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      console.log('\n');
      let templates: MarketplaceApp[] = await SpheronApiService.getComputeTemplates();

      spinner.stop();

      if (category) {
        if (!Object.values(MarketplaceCategoryEnum).find((x) => x == category)) {
          throw new Error("Specified category does not exist");
        }
        templates = templates.filter((x) => x.metadata.category == category);
      }

      if (name) {
        templates = templates.filter(x => x.name == name);
      }

      const templateDtos: ComputeTemplateDto[] = templates.map(x => toComputeTemplateDTO(x));

      if (info && name && templateDtos.length > 0) {
        console.log(JSON.stringify(templateDtos[0], null, 2));
        spinner.success(`Fetched info for template: ${name}`);
        return;
      }

      // Modify tableData to be an array of arrays
      const tableData = templateDtos.map(templateDto => [
        templateDto.metadata.category,
        templateDto.name,
        templateDto.metadata.docsLink
      ]);

      // Set the headings for the table
      const headings = ['Category', 'Name', 'DocsLink'];

      // Call createTable with the appropriate arguments
      const tableString = createTable(headings, tableData);

      // Output the table to the console
      console.log(tableString);

      spinner.success(``);

      // Output additional helpful commands
      console.log('\nHelpful Commands:');
      console.log('------------------');
      if (category) {
        console.log('To get more detailed information about a specific template, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get templates --name <name-of-template> --info'));
        console.log('\n');
        console.log('To get the list of all available templates, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get templates'));
      } else if (name && info) {
        console.log('To get the list of all available templates, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get templates'));
        console.log('\n');
        console.log('To get the list of templates in a particular category, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get templates --category <name-of-category>'));
      } else {
        console.log('To get more detailed information about a specific template, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get templates --name <name-of-template> --info'));
        console.log('\n');
        console.log('To get the list of templates in a particular category, use the following command:');
        console.log(chalk.hex('#4AEEFF')('spheron compute get templates --category <name-of-category>'));
      }
      console.log('\n');

    } catch (error) {
      console.log(`✖️  Error while fetching compute templates`);
      throw error;
    } finally {
      spinner.stop();
    }
  }
  ,
};

export enum SiteResourceEnum {
  PROJECT = "project",
  PROJECTS = "projects",
  DEPLOYMENT = "deployment",
  DEPLOYMENTS = "deployments",
  ORGANIZATION = "organization",
  ORGANIZATIONS = "organizations",
  DOMAINS = "domains",
  DEPLOYMENT_ENVIRONMENTS = "deployment-environments",
}

export enum ComputeResourceEnum {
  ORGANIZATION = "organization",
  ORGANIZATIONS = "organizations",
  PLANS = "plans",
  REGIONS = "regions",
  CLUSTERS = "clusters",
  INSTANCE = "instance",
  INSTANCES = "instances",
  LOGS = "logs",
  TEMPLATES = "templates",
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

interface ComputePlanDTO {
  _id: string;
  name: string;
  cpu: number;
  storage: string;
  memory: string;
  dailyCost: string;
}

interface ComputeClusterDTO {
  _id: string;
  name: string;
  imageSource: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BasicComputeInstanceDTO {
  _id: string;
  state: string;
  name: string;
  versions: Array<string>;
  activeVersion: string;
  cluster: string;
  healthCheck: HealthCheck;
  cpu: number;
  memory: string;
  storage: string;
  image: string;
  tag: string;
  dailySpending?: number;
  alreadySpent?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SuperComputeInstanceDTO {
  _id: string;
  state: string;
  name: string;
  versions: Array<string>;
  activeVersionId: string;
  activeVersion: {
    env: any;
    configuration: {
      protocol: string;
      image: string;
      tag: string;
      instanceCount: number;
      ports: Array<Port>;
      env: Array<Env>;
      command: Array<string>;
      args: Array<string>;
      region: string;
      plan: string;
      agreementDate: number;
      cpu: number;
      memory: string;
      storage: string;
      persistentStorage?: PersistentStorage;
    };
    protocolData: any;
  } | null;
  cluster: string;
  healthCheck: HealthCheck;
  dailySpending?: number;
  alreadySpent?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ComputeTemplateDto {
  _id: string;
  name: string;
  metadata: {
    description: string;
    docsLink: string;
    category: string;
  };
  serviceData: {
    defaultPlan: string;
    image: string;
    tag: string;
    variables: MarketplaceAppVariable[];
    ports: MarketplaceAppPort[];
    commands: string[];
    args: string[];
  };
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

const toComputePlansDTO = function (
  computeMachine: ComputeMachine
): ComputePlanDTO {
  return {
    _id: computeMachine._id,
    name: computeMachine.name,
    cpu: computeMachine.cpu,
    storage: computeMachine.storage,
    memory: computeMachine.memory,
    dailyCost: computeMachine.defaultDailyTopUp.toFixed(3),
  };
};

const toComputeClusterDTO = function (cluster: Cluster): ComputeClusterDTO {
  return {
    _id: cluster._id,
    name: cluster.name,
    imageSource: cluster.url,
    createdBy: cluster.createdBy,
    createdAt: cluster.createdAt,
    updatedAt: cluster.updatedAt,
  };
};

const toBasicComputeInstanceDTO = function (
  instance: ExtendedInstance
): BasicComputeInstanceDTO {
  return {
    _id: instance._id,
    state: instance.state,
    name: instance.name,
    versions: instance.orders,
    activeVersion: instance.activeOrder,
    cluster: instance.cluster,
    healthCheck: instance.healthCheck,
    cpu: instance.cpu,
    memory: instance.memory,
    storage: instance.storage,
    image: instance.image,
    tag: instance.tag,
    dailySpending: instance.defaultDailyTopup,
    alreadySpent: instance.withdrawnAkt,
    createdAt: instance.createdAt,
    updatedAt: instance.updatedAt,
  };
};

const toSuperComputeInstanceDTO = function (
  instance: ExtendedInstance,
  order?: InstanceOrder
): SuperComputeInstanceDTO {
  const dto: SuperComputeInstanceDTO = {
    _id: instance._id,
    state: instance.state,
    name: instance.name,
    versions: instance.orders,
    activeVersionId: instance.activeOrder,
    activeVersion: order
      ? {
        env: order.env,
        configuration: {
          protocol: order.clusterInstanceConfiguration.protocol,
          image: order.clusterInstanceConfiguration.image,
          tag: order.clusterInstanceConfiguration.tag,
          instanceCount: order.clusterInstanceConfiguration.instanceCount,
          ports: order.clusterInstanceConfiguration.ports,
          env: order.clusterInstanceConfiguration.env,
          command: order.clusterInstanceConfiguration.command,
          args: order.clusterInstanceConfiguration.args,
          region: order.clusterInstanceConfiguration.region,
          plan: order.clusterInstanceConfiguration.agreedMachineImage
            .machineType,
          agreementDate:
            order.clusterInstanceConfiguration.agreedMachineImage
              .agreementDate,
          cpu: order.clusterInstanceConfiguration.agreedMachineImage.cpu,
          memory:
            order.clusterInstanceConfiguration.agreedMachineImage.memory,
          storage:
            order.clusterInstanceConfiguration.agreedMachineImage.storage,
          persistentStorage:
            order.clusterInstanceConfiguration.agreedMachineImage
              .persistentStorage,
        },
        protocolData: order.protocolData,
      }
      : null,
    cluster: instance.cluster,
    healthCheck: instance.healthCheck,
    dailySpending: instance.defaultDailyTopup,
    alreadySpent: instance.withdrawnAkt,
    createdAt: instance.createdAt,
    updatedAt: instance.updatedAt,
  };
  return dto;
};

const toComputeTemplateDTO = function (
  app: MarketplaceApp
): ComputeTemplateDto {
  const template: ComputeTemplateDto = {
    _id: app._id,
    name: app.name,
    metadata: {
      description: app.metadata.description,
      docsLink: app.metadata.docsLink,
      category: app.metadata.category,
    },
    serviceData: {
      defaultPlan: app.serviceData.defaultAkashMachineImageId,
      image: app.serviceData.dockerImage,
      tag: app.serviceData.dockerImageTag,
      variables: app.serviceData.variables,
      ports: app.serviceData.ports,
      commands: app.serviceData.commands,
      args: app.serviceData.args,
    },
  };
  return template;
};

const toSpheronComputeConfiguration = async function (
  instance: ExtendedInstance,
  order: InstanceOrder
): Promise<SpheronComputeConfiguration> {
  const configHealthCheck = instance.healthCheck?.url
    ? {
      path: instance.healthCheck.url,
      port: instance.healthCheck.port?.containerPort
        ? instance.healthCheck.port.containerPort
        : 80,
    }
    : undefined;

  const configEnvs = order.clusterInstanceConfiguration.env.map((x) => {
    return {
      name: x.value.split("=")[0],
      value: x.value.split("=")[1],
      hidden: x.isSecret,
    };
  });
  const plan =
    order.clusterInstanceConfiguration.agreedMachineImage.machineType;

  const customParams: CliCustomParams = {
    cpu:
      plan == AKASH_IMAGE_CUSTOM_PLAN
        ? order.clusterInstanceConfiguration.agreedMachineImage.cpu
        : undefined,
    memory:
      plan == AKASH_IMAGE_CUSTOM_PLAN
        ? order.clusterInstanceConfiguration.agreedMachineImage.memory
        : undefined,
    storage: order.clusterInstanceConfiguration.agreedMachineImage.storage,
    persistentStorage: order.clusterInstanceConfiguration.agreedMachineImage
      .persistentStorage
      ? {
        size: order.clusterInstanceConfiguration.agreedMachineImage
          .persistentStorage.size,
        class: toCliPersistentStorage(
          order.clusterInstanceConfiguration.agreedMachineImage
            .persistentStorage.class
        ),
        mountPoint:
          order.clusterInstanceConfiguration.agreedMachineImage
            .persistentStorage.mountPoint,
      }
      : undefined,
  };
  const cluster: Cluster = await SpheronApiService.getCluster(instance.cluster);
  const config: SpheronComputeConfiguration = {
    clusterName: cluster.name,
    region: order.clusterInstanceConfiguration.region,
    image: order.clusterInstanceConfiguration.image,
    tag: order.clusterInstanceConfiguration.tag,
    instanceCount: order.clusterInstanceConfiguration.instanceCount,
    ports: order.clusterInstanceConfiguration.ports.map((x) => {
      return { containerPort: x.containerPort, exposedPort: x.exposedPort };
    }),
    env: configEnvs,
    commands: order.clusterInstanceConfiguration.command,
    args: order.clusterInstanceConfiguration.args,
    type: instance.scalable
      ? CliComputeInstanceType.ON_DEMAND
      : CliComputeInstanceType.SPOT,
    plan: order.clusterInstanceConfiguration.agreedMachineImage.machineType,
    customParams: customParams,
    healthCheck: configHealthCheck,
    instanceId: instance._id,
    clusterId: instance.cluster,
    organizationId: cluster.organization,
    versionId: instance.activeOrder,
  };

  return config;
};

// Function to create and return a table from an array of compute plans
function createTable(headings: string[], data: (string | number)[][], colWidths: number[] = []) {
  const table = new Table({ head: headings, colWidths });
  data.forEach(item => {
    table.push(item);
  });
  return table.toString();
}

const AKASH_IMAGE_CUSTOM_PLAN = "Custom Plan";
