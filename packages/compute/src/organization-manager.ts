import { SpheronApi, UsageWithLimits } from "@spheron/core";
import {
  Cluster,
  Organization,
  mapCluster,
  mapOrganization,
} from "./interfaces";

class OrganizationManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async get(organizationId: string): Promise<Organization> {
    const organization = await this.spheronApi.getOrganization(organizationId);

    return mapOrganization(organization);
  }

  async getClusters(
    organisationId: string,
    options: {
      skip: number;
      limit: number;
    }
  ): Promise<Cluster[]> {
    const clusters = await this.spheronApi.getOrganizationClusters(
      organisationId,
      options
    );

    return clusters.map((x) => mapCluster(x));
  }

  async getUsage(organizationId: string): Promise<UsageWithLimits> {
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
