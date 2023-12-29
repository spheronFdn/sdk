import { MarketplaceApp } from "./interfaces";

interface InstanceResponse {
  computeProjectId: string;
  computeInstanceId: string;
  computeDeploymentId: string;
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
