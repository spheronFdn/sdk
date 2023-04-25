import { MarketplaceApp } from "./interfaces";

interface ClusterInstanceResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  topic: string;
}
interface ClusterInstanceFromMarketplaceResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  template: MarketplaceApp;
  templateId: string;
  topic: string;
}

export { ClusterInstanceResponse, ClusterInstanceFromMarketplaceResponse };
