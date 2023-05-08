import { MarketplaceApp } from "./interfaces";

interface InstanceResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  topic: string;
}
interface MarketplaceInstanceResponse extends InstanceResponse {
  template: MarketplaceApp;
  templateId: string;
}

export { InstanceResponse, MarketplaceInstanceResponse };
