import asyncLock from "async-lock";
import { ProjectStateEnum, SpheronApi } from "@spheron/core";
import {
  Organization,
  Project,
  UsageWithLimits,
  mapCoreOrganization,
  mapCoreProject,
  mapCoreUsageWithLimits,
} from "./interfaces";

class OrganizationManager {
  private readonly spheronApi: SpheronApi;
  private organizationId = "";
  private lock: asyncLock;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
    this.lock = new asyncLock();
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

  private async getOrganizationIdFromToken(): Promise<string> {
    if (!this.organizationId) {
      await this.lock.acquire("getOrganizationIdFromToken", async () => {
        if (!this.organizationId) {
          const scope = await this.spheronApi.getTokenScope();
          this.organizationId = scope.organizations[0].id;
        }
      });
    }

    return this.organizationId;
  }
}

export default OrganizationManager;
