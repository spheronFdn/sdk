import { MarketplaceApp } from "./interfaces";

interface InstanceResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  topic: string;
}
interface MarketplaceInstanceResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  template: MarketplaceApp;
  templateId: string;
  topic: string;
}

export { InstanceResponse, MarketplaceInstanceResponse };
