import { MarketplaceApp, SpheronApi } from "@spheron/core";

class ClusterMarketplaceManager {
  //marketplace
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getMarketplaceApps(): Promise<{
    clusterTemplates: MarketplaceApp[];
  }> {
    return this.spheronApi.getClusterTemplates();
  }

  async getMarketplaceApp(id: string): Promise<MarketplaceApp> {
    return this.spheronApi.getClusterTemplate(id);
  }

  async getMarketplaceCategories(): Promise<string[]> {
    return this.spheronApi.getClusterCategories();
  }
}

export { ClusterMarketplaceManager };
