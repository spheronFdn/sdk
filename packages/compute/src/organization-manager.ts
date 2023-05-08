import { SpheronApi, UsageWithLimits } from "@spheron/core";
import {
  Cluster,
  Organization,
  mapCluster,
  mapOrganization,
} from "./interfaces";
import Utils from "./utils";

class OrganizationManager {
  private readonly spheronApi: SpheronApi;
  private readonly utils: Utils;

  constructor(spheronApi: SpheronApi, utils: Utils) {
    this.spheronApi = spheronApi;
    this.utils = utils;
  }

  async get(): Promise<Organization> {
    const organizationId = await this.utils.getOrganizationId();
    const organization = await this.spheronApi.getOrganization(organizationId);

    return mapOrganization(organization);
  }

  async getClusters(options: {
    skip: number;
    limit: number;
  }): Promise<Cluster[]> {
    const organizationId = await this.utils.getOrganizationId();

    const clusters = await this.spheronApi.getOrganizationClusters(
      organizationId,
      options
    );

    return clusters.map((x) => mapCluster(x));
  }

  async getUsage(): Promise<UsageWithLimits> {
    const organizationId = await this.utils.getOrganizationId();

    const usage = await this.spheronApi.getOrganizationUsage(
      organizationId,
      "c-akash"
    );

    const { usedStorageSkynet, storageSkynetLimit, ...resultWithoutSkynet } =
      usage;
    return resultWithoutSkynet;
  }
}

export default OrganizationManager;