import { SpheronApi, TokenScope } from "@spheron/core";

class Utils {
  private spheronApi: SpheronApi;
  organizationId = "";

  constructor(spheronApi: SpheronApi) {
    this.spheronApi = spheronApi;

    this.organizationId = "";
  }

  async getOrganizationId() {
    if (!this.organizationId || this.organizationId === "") {
      const tokenScope: TokenScope = await this.spheronApi.getTokenScope();

      if (tokenScope.organizations.length != 1) {
        throw new Error(`Unsuported token! Please use single scope token.`);
      }

      this.organizationId = tokenScope.organizations[0].id;
    }

    return this.organizationId;
  }
}

export default Utils;
