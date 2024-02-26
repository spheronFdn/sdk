import {
  AppTypeEnum,
  ComputeProject,
  ComputeMachine,
  Env,
  HealthCheck,
  Instance,
  ComputeDeployment,
  InstanceStateEnum,
  MarketplaceApp,
  MarketplaceAppPort,
  MarketplaceAppVariable,
  MarketplaceCategoryEnum,
  PersistentStorage,
  Port,
  User,
  ComputeTypeEnum,
  Gpu,
  InstancesInfo,
  AutoscalingRules,
  MasterOrganization,
  ComputeMetrics,
  ExtendedInstance,
} from "@spheron/core";
import Spinner from "../outputs/spinner";
import SpheronApiService, {
  toCliPersistentStorage,
} from "../services/spheron-api";
import MetadataService from "../services/metadata-service";
import {
  CliComputeInstanceType,
  CliCustomParams,
  InstanceVersionLogsTypeEnum,
  SpheronComputeConfiguration,
  SpheronComputeServiceConfiguration,
} from "./compute/interfaces";
import path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";

export const ResourceFetcher = {
  async getOrganization(id: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      if (!id) {
        const masterOrg = await MetadataService.getMaterOrgData();

        id = masterOrg?.organizationId;

        if (!id) {
          throw new Error("OrganizationId not provided");
        }
      }
      const organization: MasterOrganization =
        await SpheronApiService.getOrganization(id);
      console.log("Organization details:");
      const orgDTO = toOrganizationDTO(organization);

      printOrganizationDetails(orgDTO);

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

      const orgsWithCount: Array<MasterOrganizationWithCountDTO> =
        await Promise.all(
          user.organizations.map(async (org) => {
            const [bucketCount, projectsCount, computeProjectsCount] =
              await Promise.all([
                SpheronApiService.getBucketsCount(org.storage._id),
                SpheronApiService.getProjectsCount(org.site._id),
                SpheronApiService.getComputeProjectsCount(org.compute._id),
              ]);

            return toOrganizationWithCountDTO(
              org,
              bucketCount,
              projectsCount,
              computeProjectsCount
            );
          })
        );

      console.log("\nCheckout all the organizations that you have 🚀\n");
      const headers: string[] = [
        "ORGANIZATION ID",
        "NAME",
        "COMPUTE PROJECTS",
        "BUCKETS",
        "SITE PROJECTS",
      ];
      const tableRows: string[][] = orgsWithCount.map((org) => {
        return [
          org.masterOrganization._id,
          org.masterOrganization.profile.name,
          org.computeProjectsCount.toString(),
          org.bucketsCount.toString(),
          org.projectsCount.toString(),
        ];
      });

      printTableInFormat(tableRows, headers);

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching user organizations`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputePlans(name?: string, region?: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const computesPlans: ComputeMachine[] =
        await SpheronApiService.getComputePlans(name, region);
      const computePlansDtos: ComputePlanDTO[] = computesPlans.map((x) => {
        return toComputePlansDTO(x);
      });

      console.log(
        "\nHere are all the compute plans that we support at Spheron! 🚀\n\n"
      );

      const headers: string[] = [
        "PLAN ID",
        "PLAN NAME",
        "CPU",
        "RAM",
        "GPU",
        "MONTHLY PRICING",
        "HOURLY PRICING",
      ];
      const tableRows: string[][] = computePlansDtos.map((dto) => {
        const dailyCost = parseFloat(dto.dailyCost);
        return [
          dto._id,
          dto.name,
          `${dto.cpu}`,
          dto.memory,
          dto.gpu ? dto.gpu.model : "N.A.", // Replace with actual GPU info if available
          `$${(dailyCost * 30).toFixed(2)} / mo`,
          `$${(dailyCost / 24).toFixed(2)} / hr`,
        ];
      });

      printTableInFormat(tableRows, headers);

      console.log(
        "\nTo know more about each plan, please visit our documentation - https://docs.spheron.network/compute/plans/compute-plans/"
      );

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute plans`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeRegions() {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");
      const regions: string[] = await SpheronApiService.getComputeRegions();

      console.log("\nHere are all the regions that we support! 🚀\n");
      console.log("REGIONS");
      regions.forEach((region) => console.log(region));

      console.log(
        '\nShould you choose not to designate a specific region for your server deployment, selecting the "any" option is available. This option allows the system to autonomously select a region that has sufficient compute capacity to effectively manage your workload.'
      );

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute regions`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeProject(organizationId: string) {
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
      const projects: ComputeProject[] =
        await SpheronApiService.getComputeProjects(organizationId);
      const computeClusterDtos: ComputeProjectDTO[] = await Promise.all(
        projects.map(async (project) => {
          const instanceInfo = await SpheronApiService.getComputeProjectDetails(
            project._id
          );

          return toComputeClusterDTO(project, instanceInfo);
        })
      );

      console.log(
        `\nCheckout all the projects in your selected organization ${organizationId} 🚀\n`
      );
      const headers: string[] = [
        "PROJECT ID",
        "NAME",
        "INSTANCES",
        "PROVISIONED",
        "CLOSED",
        "FAILED",
      ];
      const tableRows: string[][] = computeClusterDtos.map((dto) => {
        return [
          dto._id,
          dto.name,
          dto.instanceInfo.total.toString(),
          dto.instanceInfo.active.toString(),
          dto.instanceInfo.closed.toString(),
          dto.instanceInfo.failedToStart.toString(),
        ];
      });

      printTableInFormat(tableRows, headers);

      console.log(
        `\nHelpful Commands:\n\nTo retrieve all the instances in your project, use this following command:\nspheron instances --project <PROJECT ID>`
      );
      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute clusters`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeInstances(
    computeProjectId?: string,
    state?: InstanceStateEnum
  ) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching ");

      const computeData = await MetadataService.getComputeData();
      const organizationId = computeData?.organizationId;
      if (!organizationId) {
        throw new Error("OrganizationId not provided");
      }

      const instances: ExtendedInstance[] =
        await SpheronApiService.getComputeInstances(
          organizationId,
          computeProjectId,
          state
        );
      const instancesDtos: BasicComputeInstanceDTO[] = instances.map((x) => {
        return toBasicComputeInstanceDTO(x);
      });

      console.log(
        "\nHere are all your instances that you have deployed 🚀\n\n"
      );

      const headers: string[] = [
        "INSTANCE ID",
        "PLAN USAGE",
        "PROJECT NAME",
        "STATUS",
        "TYPE",
        "UPDATED AT",
        "CREATED AT",
      ];
      const tableRows: string[][] = instancesDtos.map((dto) => {
        return [
          dto._id,
          dto.dailySpending ? `$${dto.dailySpending?.toFixed(2)} / mo` : `N.A.`,
          dto.computeProjectName as string,
          mapInstanceState(dto.state),
          dto.type ?? CliComputeInstanceType.ON_DEMAND,
          dto.updatedAt.toString(),
          dto.createdAt.toString(),
        ];
      });

      printTableInFormat(tableRows, headers);

      console.log(
        `\nHelpful Commands:\n\nTo retrieve more detailed information about a specific instance, use this following command:\nspheron instance --id <INSTANCE ID>`
      );

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute instances`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeInstance(id: string, downloadConfig: boolean) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      const instance: ExtendedInstance =
        await SpheronApiService.getComputeInstance(id);

      let deployment;
      if (instance) {
        deployment = await SpheronApiService.getComputeDeployment(
          instance.activeDeployment ?? instance.deployments[0]
        );
      }

      if (downloadConfig && deployment) {
        const config = await toSpheronComputeConfiguration(
          instance,
          deployment
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
      } else {
        console.log(
          "✖️ There is no active version for this instance, configuration file could not be downloaded."
        );
      }

      const dto: SuperComputeInstanceDTO = toSuperComputeInstanceDTO(
        instance,
        deployment
      );

      printInstanceDetails(dto);

      console.log(
        `\nHere are all your services that you have deployed in this instance! 🚀\n`
      );
      const headers: string[] = [
        "SERVICE NAME",
        "PLAN NAME",
        "REPLICAS",
        "IMAGE",
        "CONNECTION URL",
        "PORTS",
        "TYPE",
        "UPDATED AT",
      ];
      const tableRows: string[][] =
        dto.activeVersion?.services.map((service) => [
          service.name,
          service.plan,
          service.serviceCount.toString(),
          service.image,
          dto.activeVersion?.protocolData.providerHost,
          service.ports
            .map((port) => `${port.containerPort}:${port.exposedPort}`)
            .join(", "),
          instance.type
            ? instance.type == ComputeTypeEnum.ON_DEMAND
              ? service.autoscalingRules
                ? "Autoscale"
                : "On Demand"
              : "Spot"
            : "On Demand",
          new Date(instance.updatedAt).toISOString(), // Assuming this as the updated date
        ]) || [];

      printTableInFormat(tableRows, headers);

      console.log(
        `\nTo establish a connection with a specific service that is accessible via the internet, follow these steps:\n1. If the external port you have specified is 80, you can establish a connection using the service's connection URL.\n2. In cases where the port is randomly assigned, connect using the format <CONNECTION URL>:<EXTERNAL PORT>\nFor e.g. if your connection URL is "provider.us-east.spheron.wiki" and the Port is mapped as 3000:32575. \nYou can connect to Port 3000 using "http://provider.us-east.spheron.wiki:32575".`
      );

      console.log(
        `\nHelpful Commands:\n\nTo retrieve more detailed information about a specific service, use this following command:\nspheron service --instance <INSTANCE ID> --name <SERVICE_NAME>\n\nTo update your instance configuration, use this following command:\nspheron update --instance <INSTANCE ID> [--config <PATH TO CONFIG>]`
      );

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute instance`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeDeploymentService(serviceName: string, instanceId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      const instance: Instance = await SpheronApiService.getComputeInstance(
        instanceId
      );

      let deployment;
      if (instance) {
        deployment = await SpheronApiService.getComputeDeployment(
          instance.activeDeployment ?? instance.deployments[0]
        );
      }

      let service;
      if (deployment && deployment.services) {
        service = deployment.services.find((s) => s.name === serviceName);
        if (!service) {
          throw new Error(
            `Service with name ${serviceName} not found in instance with id${instanceId}`
          );
        }
      } else {
        throw new Error("Instance not found or no active version available");
      }

      console.log(
        `\nHere is the detailed view of your Service ${service.protocol}! 👇\n`
      );
      console.log(`Name: ${service.name}`);
      console.log(`Image: ${service.image}`);
      console.log(`Status: ${mapInstanceState(instance.state)}`);
      console.log(`Replicas: ${service.serviceCount}`);
      console.log(`Region: ${service.region}`);
      console.log(
        `Compute Type: ${
          instance.type
            ? instance.type == ComputeTypeEnum.ON_DEMAND
              ? service.autoscalingRules
                ? "Autoscale"
                : "On Demand"
              : "Spot"
            : "On Demand"
        }`
      );

      console.log(`\nPlan Name: ${service.agreedMachineImage.machineType}`);
      console.log(`CPU: ${service.agreedMachineImage.cpu}`);
      console.log(`RAM: ${service.agreedMachineImage.memory}`);
      console.log(`Storage: ${service.agreedMachineImage.storage}`);
      console.log(
        `Persistent: ${
          service.agreedMachineImage.persistentStorage?.size || "N/A"
        }`
      );

      const monthlyCost = 30 * service.agreedMachineImage.defaultDailyTopUp; // Assuming cost calculation based on CPU, modify as needed
      const hourlyCost = service.agreedMachineImage.defaultDailyTopUp / 24; // Assuming cost calculation based on CPU, modify as needed

      console.log(
        `Plan Usage: $${monthlyCost.toFixed(2)} / mo, $${hourlyCost.toFixed(
          2
        )} / hr`
      );

      console.log(`\nConnection URL: ${service.urlPrewiew}`); // Replace with actual value
      console.log(
        `Ports: ${service.ports
          .map((port) => `${port.containerPort}:${port.exposedPort}`)
          .join(", ")}`
      );

      const filteredEnv = service.env.filter(
        (env) => !env.value.startsWith("SPHERON_INSTANCE_ID")
      );

      console.log(`\nEnvironments:`);
      filteredEnv
        .filter((env) => !env.isSecret)
        .forEach((envVar) => console.log(`  ${envVar.value}`));
      console.log(`Secrets:`);
      filteredEnv
        .filter((env) => env.isSecret)
        .forEach((envVar) => console.log(`  ${envVar.value}`));

      console.log(`\nCommands:`);
      service.command.forEach((cmd) => console.log(`  ${cmd}`));
      console.log(`Arguments:`);
      service.args.forEach((arg) => console.log(`  ${arg}`));

      if (service.healthCheck && service.healthCheck.port?.containerPort) {
        console.log(`\nHealth Check:`);
        console.log(`  Port: ${service.healthCheck.port?.containerPort}`);
        console.log(`  Path: ${service.healthCheck.path}`);
        console.log(
          `  Status: ${
            service.healthCheck.status ? "✅ Healthy" : "❌ Unhealthy"
          }`
        );
      }

      console.log(`\nUpdated At: ${instance.updatedAt.toString()}`);
      console.log(`Created At: ${instance.createdAt.toString()}`);

      console.log(
        `\nTo establish a connection with a specific service that is accessible via the internet, follow these steps:\n1. If the external port you have specified is 80, you can establish a connection using the service's connection URL.\n2. In cases where the port is randomly assigned, connect using the format <CONNECTION URL>:<EXTERNAL PORT>\nFor e.g. if your connection URL is "provider.us-east.spheron.wiki" and the Port is mapped as 3000:32575. \nYou can connect to Port 3000 using "http://provider.us-east.spheron.wiki:32575".`
      );

      console.log(
        `\nHelpful Commands:\n\nTo retrieve more detailed information about a specific service, use this following command:\nspheron service --id <SERVICE ID>\n\nTo update your instance configuration, use this following command:\nspheron update --instance <INSTANCE ID> --config <PATH TO CONFIG>`
      );

      console.log(
        `\nTo retrieve logs of the service, use this following command:\nspheron log --service <SERVICE_NAME> --type <LOG TYPE>`
      );
      console.log(
        `\nTo connect shell of the service, use this following command:\nspheron shell --service <SERVICE_NAME>`
      );
      console.log(
        `\nTo view compute metrics of the service, use this following command:\nspheron metrics --service <SERVICE_NAME>`
      );

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute instance`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeServiceMetrics(serviceName: string, instanceId: string) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      const metrics: ComputeMetrics = await SpheronApiService.getComputeMetrics(
        instanceId,
        serviceName
      );

      console.log(`\nHere is the compute metric usage of your service! 👇\n`);
      console.log(`CPU: ${metrics.cpu}`);
      console.log(`RAM: ${metrics.memory}`);
      console.log(
        `\n\nTo access a detailed view of your compute metrics, please navigate to your service on the Spheron App using the following URL:\nhttps://app.spheron.network/compute/<project-id>/<service-id>/metrics.`
      );

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute metrics`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getComputeDeploymentLogs(
    instanceId: string,
    logType: InstanceVersionLogsTypeEnum,
    from: number,
    to: number,
    versionId?: string,
    search?: string,
    download?: boolean,
    outputFileName?: string, // Optional output file name parameter
    serviceName?: string
  ) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      const instance: Instance = await SpheronApiService.getComputeInstance(
        instanceId
      );
      let result;

      logType = logType ?? InstanceVersionLogsTypeEnum.LIVE;

      if (instance && instance.activeDeployment && !versionId) {
        result = await SpheronApiService.getComputeDeploymentLogs(
          instance.activeDeployment,
          logType,
          from,
          to,
          search
        );
      } else {
        const latestVersion = versionId
          ? versionId
          : instance.deployments[instance.deployments.length - 1];
        result = await SpheronApiService.getComputeDeploymentLogs(
          latestVersion,
          logType,
          from,
          to,
          search
        );
      }
      spinner.success(``);

      let filteredLogs: Array<string> = [];

      if (serviceName && logType == InstanceVersionLogsTypeEnum.LIVE) {
        filteredLogs = result.logs.filter((log) =>
          log.startsWith(`[${serviceName}]`)
        );
      } else {
        filteredLogs = result.logs;
      }

      if (download) {
        const fileName = outputFileName || `instance-${instanceId}-logs.txt`;
        console.log(`Downloading logs to ${fileName}...`);
        const logText = filteredLogs.join("\n"); // Combine logs into a string
        // Write the logText to the specified file
        fs.writeFileSync(fileName, logText);
        console.log(`Logs have been downloaded to ${fileName}`);
      } else {
        filteredLogs.forEach((log) => console.log(log));
      }
    } catch (error) {
      console.log(`✖️  Error while fetching compute instance`);
      throw error;
    } finally {
      spinner.stop();
    }
  },

  async getMarketplaceApps(category?: MarketplaceCategoryEnum) {
    const spinner = new Spinner();
    try {
      spinner.spin("Fetching");
      let templates: MarketplaceApp[] =
        await SpheronApiService.getMarketplaceApps();
      if (category) {
        if (
          !Object.values(MarketplaceCategoryEnum).find((x) => x == category)
        ) {
          throw new Error("Specified category does not exist");
        }
        templates = templates.filter((x) => x.metadata.category == category);
      }
      const templateDtos: ComputeTemplateDto[] = templates.map((x) => {
        return toComputeTemplateDTO(x);
      });

      console.log(
        "\nExplore our diverse range of marketplace apps, tailored for seamless deployment on Spheron 🚀\n\n"
      );

      const headers: string[] = ["APP ID", "NAME", "CATEGORY", "IMAGE", "DOCS"];
      const tableRows: string[][] = templateDtos.map((dto) => {
        return [
          dto._id,
          dto.name,
          dto.metadata.category,
          dto.serviceData.image,
          dto.metadata.docsLink,
        ];
      });

      printTableInFormat(tableRows, headers);

      console.log(`\nHelpful Commands:\n\n`);
      if (category) {
        console.log(
          `To retrieve comprehensive list of all the marketplace apps, use the following command:\nspheron marketplace-apps`
        );
      } else {
        console.log(
          `To retrieve the list of marketplace apps within a specific category, use the following command:\nspheron marketplace-apps --category [Node, Database, Tools, AI] `
        );
      }

      spinner.success(``);
    } catch (error) {
      console.log(`✖️  Error while fetching compute templates`);
      throw error;
    } finally {
      spinner.stop();
    }
  },
};

interface MasterOrganizationDTO {
  _id: string;
  profile: {
    name: string;
    image: string;
    username: string;
  };
  site: OrganizationDTO;
  compute: OrganizationDTO;
  storage: OrganizationDTO;
}

interface MasterOrganizationWithCountDTO {
  masterOrganization: MasterOrganizationDTO;
  bucketsCount: number;
  projectsCount: number;
  computeProjectsCount: number;
}

interface OrganizationDTO {
  _id: string;
  appType: AppTypeEnum;
  usersCount: number;
  overdue: boolean;
}

interface ComputePlanDTO {
  _id: string;
  name: string;
  cpu: number;
  storage: string;
  memory: string;
  dailyCost: string;
  gpu?: Gpu;
}

interface ComputeProjectDTO {
  _id: string;
  name: string;
  instanceInfo: InstancesInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface BasicComputeInstanceDTO {
  _id: string;
  state: InstanceStateEnum;
  name: string;
  versions: Array<string>;
  activeVersion: string;
  computeProjectId: string;
  computeProjectName?: string;
  type: ComputeTypeEnum;
  dailySpending?: number;
  alreadySpent?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SuperComputeInstanceDTO {
  _id: string;
  state: InstanceStateEnum;
  name: string;
  versions: Array<string>;
  activeVersionId: string;
  activeVersion: {
    env: any;
    region: string;
    services: Array<{
      name: string;
      protocol: string;
      image: string;
      tag: string;
      serviceCount: number;
      ports: Array<Port>;
      env: Array<Env>;
      command: Array<string>;
      args: Array<string>;
      plan: string;
      agreementDate: number;
      cpu: number;
      memory: string;
      storage: string;
      persistentStorage?: PersistentStorage;
      healthCheck: HealthCheck;
      autoscalingRules?: AutoscalingRules;
    }>;
    protocolData: any;
  } | null;
  type: ComputeTypeEnum;
  computeProject: string;
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
  organization: MasterOrganization
): MasterOrganizationDTO {
  const org: MasterOrganizationDTO = {
    _id: organization._id,
    profile: organization.profile,
    site: {
      _id: organization.site._id,
      appType: organization.site.appType,
      usersCount: organization.site.users?.length,
      overdue: organization.site.overdue,
    },
    compute: {
      _id: organization.site._id,
      appType: organization.site.appType,
      usersCount: organization.site.users?.length,
      overdue: organization.site.overdue,
    },
    storage: {
      _id: organization.site._id,
      appType: organization.site.appType,
      usersCount: organization.site.users?.length,
      overdue: organization.site.overdue,
    },
  };
  return org;
};

const toOrganizationWithCountDTO = function (
  organization: MasterOrganization,
  bucketsCount: number,
  projectsCount: number,
  computeProjectsCount: number
): MasterOrganizationWithCountDTO {
  return {
    masterOrganization: toOrganizationDTO(organization),
    bucketsCount,
    projectsCount,
    computeProjectsCount,
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
    gpu: computeMachine.gpu,
  };
};

const toComputeClusterDTO = function (
  cluster: ComputeProject,
  instanceInfo: InstancesInfo
): ComputeProjectDTO {
  return {
    _id: cluster._id,
    name: cluster.name,
    instanceInfo: instanceInfo,
    createdAt: cluster.createdAt,
    updatedAt: cluster.updatedAt,
  };
};

const toBasicComputeInstanceDTO = function (
  instance: any
): BasicComputeInstanceDTO {
  return {
    _id: instance._id,
    state: instance.state,
    name: instance.name,
    versions: instance.deployments,
    activeVersion: instance.activeDeployment,
    computeProjectId:
      typeof instance.computeProject === "string"
        ? instance.computeProject
        : instance.computeProject._id,
    computeProjectName:
      typeof instance.computeProject === "string"
        ? undefined
        : instance.computeProject.name,
    type: instance.type,
    dailySpending: instance.topupReport?.dailyUsage,
    alreadySpent: instance.topupReport?.usedTillNow,
    createdAt: instance.createdAt,
    updatedAt: instance.updatedAt,
  };
};

const toSuperComputeInstanceDTO = function (
  instance: ExtendedInstance,
  deployment?: ComputeDeployment
): SuperComputeInstanceDTO {
  const dto: SuperComputeInstanceDTO = {
    _id: instance._id,
    state: instance.state,
    name: instance.name,
    versions: instance.deployments,
    activeVersionId: instance.activeDeployment,
    activeVersion: deployment
      ? {
          env: deployment.env,
          region: deployment.services[0].region,
          services: deployment.services.map((service) => {
            return {
              name: service.name,
              protocol: service.protocol,
              image: service.image,
              tag: service.tag,
              serviceCount: service.serviceCount,
              ports: service.ports,
              env: service.env,
              command: service.command,
              args: service.args,
              plan: service.agreedMachineImage.machineType,
              agreementDate: service.agreedMachineImage.agreementDate,
              cpu: service.agreedMachineImage.cpu,
              memory: service.agreedMachineImage.memory,
              storage: service.agreedMachineImage.storage,
              persistentStorage: service.agreedMachineImage.persistentStorage,
              healthCheck: service.healthCheck,
            };
          }),
          protocolData: deployment.protocolData,
        }
      : null,
    type: instance.type,
    computeProject: instance.computeProject,
    dailySpending: instance.topupReport?.dailyUsage,
    alreadySpent: instance.topupReport?.usedTillNow,
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
  instance: Instance,
  deployment: ComputeDeployment
): Promise<SpheronComputeConfiguration> {
  const cluster: ComputeProject = await SpheronApiService.getComputeProject(
    instance.computeProject
  );

  const config: SpheronComputeConfiguration = {
    projectName: cluster.name,
    services: deployment.services.map((service) => {
      const configHealthCheck = service.healthCheck?.path
        ? {
            path: service.healthCheck.path,
            port: service.healthCheck.port?.containerPort
              ? service.healthCheck.port.containerPort
              : 80,
          }
        : undefined;

      const configEnvs = service.env.map((x) => {
        return {
          name: x.value.split("=")[0],
          value: x.value.split("=")[1],
          hidden: x.isSecret,
        };
      });
      const plan = service.agreedMachineImage.machineType;

      const customParams: CliCustomParams = {
        cpu:
          plan == AKASH_IMAGE_CUSTOM_PLAN
            ? service.agreedMachineImage.cpu
            : undefined,
        memory:
          plan == AKASH_IMAGE_CUSTOM_PLAN
            ? service.agreedMachineImage.memory
            : undefined,
        storage: service.agreedMachineImage.storage,
        persistentStorage: service.agreedMachineImage.persistentStorage
          ? {
              size: service.agreedMachineImage.persistentStorage.size,
              class: toCliPersistentStorage(
                service.agreedMachineImage.persistentStorage.class
              ),
              mountPoint:
                service.agreedMachineImage.persistentStorage.mountPoint,
            }
          : undefined,
      };

      return {
        name: cluster.name,
        region: service.region,
        image: service.image,
        tag: service.tag,
        count: service.serviceCount,
        ports: service.ports.map((x) => {
          return { containerPort: x.containerPort, exposedPort: x.exposedPort };
        }),
        env: configEnvs,
        commands: service.command,
        args: service.args,
        plan: service.agreedMachineImage.machineType,
        customParams: customParams,
        healthCheck: configHealthCheck,
      } as SpheronComputeServiceConfiguration;
    }),
    region: instance.region,
    type:
      instance.type == ComputeTypeEnum.ON_DEMAND
        ? CliComputeInstanceType.ON_DEMAND
        : CliComputeInstanceType.SPOT,
    instanceId: instance._id,
    projectId: instance.computeProject,
    organizationId: cluster.organization,
    versionId: instance.activeDeployment,
  };

  return config;
};

function printTableInFormat(data: string[][], columnHeaders: string[]): void {
  // Determine the maximum width for each column
  const columnWidths: number[] = columnHeaders.map((header) => header.length);
  data.forEach((row) => {
    row.forEach((item, index) => {
      columnWidths[index] = Math.max(columnWidths[index], item.length);
    });
  });

  // Function to pad each item in the row
  const padItem = (item: string, index: number): string =>
    item.padEnd(columnWidths[index] + 2); // +2 for extra spacing

  // Create the header row
  const headerRow: string = columnHeaders.map(padItem).join("");
  const separatorRow: string = columnWidths
    .map((width) => "-".repeat(width + 2))
    .join("");

  // Create each data row
  const rows: string[] = data.map((row) => row.map(padItem).join(""));

  // Print the table
  console.log(headerRow);
  console.log(separatorRow);
  rows.forEach((row) => console.log(row));
}

function printInstanceDetails(
  instance: SuperComputeInstanceDTO,
  deployment?: ComputeDeployment
): void {
  console.log(
    `Here is the detailed view of your Instance ${instance._id}! 👇\n`
  );
  console.log(`Name: ${instance.name}`);
  console.log(`Status: ${mapInstanceState(instance.state)}`);
  const monthlyCost = instance.dailySpending
    ? `$${(instance.dailySpending * 30).toFixed(2)} / mo`
    : "N.A.";
  const hourlyCost = instance.dailySpending
    ? `$${(instance.dailySpending / 24).toFixed(2)} / hr`
    : "N.A.";

  console.log(`Monthly Plan Usage: ${monthlyCost}, ${hourlyCost}`);
  console.log(
    `Total Spent: ${
      instance.alreadySpent ? `$${instance.alreadySpent.toFixed(2)}` : "N.A."
    }`
  );
  // Assuming region information is available in the 'deployments' array or elsewhere
  if (deployment) {
    console.log(`Region: ${deployment.services[0].region}`);
  }
  console.log(
    `Compute Type: ${
      instance.type == ComputeTypeEnum.ON_DEMAND ? "On Demand" : "Spot"
    }`
  );
  console.log(`Updated At: ${instance.updatedAt.toString()}`);
  console.log(`Created At: ${instance.createdAt.toString()}`);
}

function printOrganizationDetails(org: MasterOrganizationDTO): void {
  console.log(`Here are the detailes of your current organization! 👇\n`);

  console.log(`ID: ${org._id}`);
  console.log(`Name: ${org.profile.name}`);
}

function mapInstanceState(state: InstanceStateEnum): string {
  switch (state) {
    case InstanceStateEnum.ACTIVE:
      return `✅ Provisioned`;
    case InstanceStateEnum.STARTING:
      return `⚪ Provisioning`;
    case InstanceStateEnum.CLOSED:
      return `❌ Closed`;
    case InstanceStateEnum.FAILED_START:
      return `❌ Failed`;
    default:
      return `❌ Closed`;
  }
}

const AKASH_IMAGE_CUSTOM_PLAN = "Custom Plan";
