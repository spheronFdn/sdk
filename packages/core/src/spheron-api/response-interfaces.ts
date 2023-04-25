import { ClusterTemplate } from "./interfaces";

interface ClusterInstanceResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  topic: string;
}
interface ClusterInstanceFromTemplateResponse {
  clusterId: string;
  clusterInstanceId: string;
  clusterInstanceOrderId: string;
  template: ClusterTemplate;
  templateId: string;
  topic: string;
}

export { ClusterInstanceResponse, ClusterInstanceFromTemplateResponse };
