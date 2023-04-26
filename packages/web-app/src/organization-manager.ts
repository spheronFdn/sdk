import { ProjectStateEnum, SpheronApi, UsageWithLimits } from "@spheron/core";
import {
  Organization,
  Project,
  mapCoreOrganization,
  mapCoreProject,
} from "./interfaces";

class OrganizationManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async get(organizationId: string): Promise<Organization> {
    const organization = await this.spheronApi.getOrganization(organizationId);

    return mapCoreOrganization(organization);
  }

  async getProjects(
    organizationId: string,
    options: {
      skip: number;
      limit: number;
      state?: ProjectStateEnum;
    }
  ): Promise<Project[]> {
    const projects = await this.spheronApi.getOrganizationProjects(
      organizationId,
      options
    );

    return projects.map((x) => mapCoreProject(x));
  }

  async getProjectCount(
    organizationId: string,
    options?: {
      state?: ProjectStateEnum;
    }
  ): Promise<number> {
    return await this.spheronApi.getOrganizationProjectCount(
      organizationId,
      options ?? {}
    );
  }

  async getUsage(organizationId: string): Promise<UsageWithLimits> {
    const usage = await this.spheronApi.getOrganizationUsage(
      organizationId,
      "wa-global"
    );

    const { usedStorageSkynet, storageSkynetLimit, ...resultWithoutSkynet } =
      usage;
    return resultWithoutSkynet;
  }
}

export default OrganizationManager;
