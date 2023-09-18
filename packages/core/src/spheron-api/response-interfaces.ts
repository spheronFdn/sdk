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

interface ShellExecutionResponse {
  logs: string[];
}

export {
  InstanceResponse,
  MarketplaceInstanceResponse,
  ShellExecutionResponse,
};
