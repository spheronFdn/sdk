import { ClusterTemplate, SpheronApi } from "@spheron/core";

class ClusterTemplateManager {
  //marketplace
  private readonly spheronApi: SpheronApi;

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;
  }

  async getClusterTemplates(): Promise<{
    clusterTemplates: ClusterTemplate[];
  }> {
    return this.spheronApi.getClusterTemplates();
  }

  async getClusterTemplate(id: string): Promise<ClusterTemplate> {
    return this.spheronApi.getClusterTemplate(id);
  }

  async getClusterCategories(): Promise<string[]> {
    return this.spheronApi.getClusterCategories();
  }
}

export { ClusterTemplateManager };
