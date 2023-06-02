import { ProjectStateEnum, SpheronApi } from "@spheron/core";
import { Organization, Project, UsageWithLimits } from "./interfaces";
import OrganizationIdExtractor from "./organizationId-extractor";
import {
  mapCoreProject,
  mapCoreOrganization,
  mapCoreUsageWithLimits,
} from "./interface-mappers";

class OrganizationManager extends OrganizationIdExtractor {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    super(spheronApi);
    this.spheronApi = spheronApi;
  }

  async get(): Promise<Organization> {
    const organizationId = await this.getOrganizationIdFromToken();
    const organization = await this.spheronApi.getOrganization(organizationId);

    return mapCoreOrganization(organization);
  }

  async getProjects(options: {
    skip: number;
    limit: number;
    state?: ProjectStateEnum;
  }): Promise<Project[]> {
    const organizationId = await this.getOrganizationIdFromToken();
    const projects = await this.spheronApi.getOrganizationProjects(
      organizationId,
      options
    );

    return projects.map((x) => mapCoreProject(x));
  }

  async getProjectCount(options?: {
    state?: ProjectStateEnum;
  }): Promise<number> {
    const organizationId = await this.getOrganizationIdFromToken();
    return await this.spheronApi.getOrganizationProjectCount(
      organizationId,
      options ?? {}
    );
  }

  async getUsage(): Promise<UsageWithLimits> {
    const organizationId = await this.getOrganizationIdFromToken();
    const usage = await this.spheronApi.getOrganizationUsage(
      organizationId,
      "wa-global"
    );

    const { usedStorageSkynet, storageSkynetLimit, ...resultWithoutSkynet } =
      usage;
    return mapCoreUsageWithLimits(resultWithoutSkynet);
  }
}

export default OrganizationManager;
