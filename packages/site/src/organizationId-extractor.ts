import { SpheronApi } from "@spheron/core";
import asyncLock from "async-lock";

abstract class OrganizationIdExtractor {
  private readonly api: SpheronApi;
  private organizationId = "";
  private lock: asyncLock;

  constructor(spheronApi: SpheronApi) {
    this.api = spheronApi;
    this.lock = new asyncLock();
  }

  protected async getOrganizationIdFromToken(): Promise<string> {
    if (!this.organizationId) {
      await this.lock.acquire("getOrganizationIdFromToken", async () => {
        if (!this.organizationId) {
          const scope = await this.api.getTokenScope();
          this.organizationId = scope.organizations[0].id;
        }
      });
    }

    return this.organizationId;
  }
}

export default OrganizationIdExtractor;
