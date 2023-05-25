import { SpheronApi } from "@spheron/core";
import { MarketplaceApp } from "./interfaces";
import { mapMarketplaceApp } from "./mappers";

class ComputeMarketplaceManager {
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getAll(): Promise<MarketplaceApp[]> {
    const marketplaceApps = await this.spheronApi.getClusterTemplates();

    return marketplaceApps.map((x) => mapMarketplaceApp(x));
  }

  async get(id: string): Promise<MarketplaceApp> {
    const marketplaceApp = await this.spheronApi.getClusterTemplate(id);

    return mapMarketplaceApp(marketplaceApp);
  }

  async getCategories(): Promise<string[]> {
    return this.spheronApi.getClusterCategories();
  }
}

export { ComputeMarketplaceManager };
