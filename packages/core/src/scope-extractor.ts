import asyncLock from "async-lock";
import SpheronApi from "./spheron-api";
import { TokenScope } from "./spheron-api/interfaces";
import { AppTypeEnum } from "./spheron-api/enums";

abstract class ScopeExtractor {
  private readonly api: SpheronApi;
  private scope: TokenScope | null = null;
  private lock: asyncLock;

  constructor(spheronApi: SpheronApi) {
    this.api = spheronApi;
    this.lock = new asyncLock();
  }

  protected async getScopeFromToken(): Promise<TokenScope> {
    if (!this.scope) {
      await this.lock.acquire("getScopeFromToken", async () => {
        if (!this.scope) {
          this.scope = await this.api.getTokenScope();
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.scope!;
  }

  protected async getOrganizationIdFromToken(): Promise<string> {
    const scope = await this.getScopeFromToken();
    return scope.organizations[0].id;
  }

  protected async getOrganizationTypeFromToken(): Promise<AppTypeEnum> {
    const scope = await this.getScopeFromToken();
    return scope.organizations[0].appType;
  }
}

export { ScopeExtractor };
