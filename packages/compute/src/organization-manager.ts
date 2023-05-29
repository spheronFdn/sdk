import { SpheronApi } from "@spheron/core";
import { Cluster, Organization, UsageWithLimits } from "./interfaces";
import Utils from "./utils";
import { mapOrganization, mapCluster, mapUsageWithLimits } from "./mappers";

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

    const pricePerToken = await this.spheronApi.getPriceForToken(7431);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { usedStorageSkynet, storageSkynetLimit, ...resultWithoutSkynet } =
      usage;
    return mapUsageWithLimits(resultWithoutSkynet, pricePerToken);
  }
}

export default OrganizationManager;
