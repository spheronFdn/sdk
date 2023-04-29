import { MarketplaceApp, SpheronApi } from "@spheron/core";

class ClusterMarketplaceManager {
  //marketplace
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getAll(): Promise<{
    clusterTemplates: MarketplaceApp[];
  }> {
    return this.spheronApi.getClusterTemplates();
  }

  async get(id: string): Promise<MarketplaceApp> {
    return this.spheronApi.getClusterTemplate(id);
  }

  async getCategories(): Promise<string[]> {
    return this.spheronApi.getClusterCategories();
  }
}

export { ClusterMarketplaceManager };
