import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import pLimit from "p-limit";
import { ProtocolEnum } from "../spheron-api";

export interface UploadMangerConfiguration {
  token: string;
}

export interface UploadConfiguration {
  protocol: ProtocolEnum;
  name: string;
  organizationId?: string;
  onUploadInitiated?: (uploadId: string) => void;
  onChunkUploaded?: (uploadedSize: number) => void;
}

export interface UploadResult {
  uploadId: string;
  bucketId: string;
  protocolLink: string;
  dynamicLinks: string[];
}

class UploadManager {
  private readonly uploadApiUrl = "http://localhost:8002";

  private readonly configuration: UploadMangerConfiguration;

  constructor(configuration: UploadMangerConfiguration) {
    this.configuration = configuration;
  }

  public async initiateDeployment(configuration: {
    protocol: ProtocolEnum;
    name: string;
    organizationId?: string;
  }): Promise<{
    deploymentId: string;
    parallelUploadCount: number;
    payloadSize: number;
    singleDeploymentToken?: string;
  }> {
    this.validateUploadConfiguration(configuration);

    return await this.startDeployment(
      configuration.protocol,
      configuration.name,
      configuration.organizationId
    );
  }

  public async uploadPayloadsForDeployment(
    payloads: FormData[],
    configuration: {
      deploymentId: string;
      parallelUploadCount: number;
      singleDeploymentToken: string;
      onChunkUploaded?: (uploadedSize: number) => void;
    }
  ): Promise<UploadResult> {
    const uploadPayloadsResult = await this.uploadPayloads(
      configuration.deploymentId,
      payloads,
      configuration.singleDeploymentToken,
      configuration.parallelUploadCount,
      configuration.onChunkUploaded
    );

    const result = await this.finalizeUploadDeployment(
      configuration.deploymentId,
      uploadPayloadsResult.success,
      configuration.singleDeploymentToken
    );

    if (!result.success) {
      throw new Error(`Upload failed. ${result.message}`);
    }

    return {
      uploadId: result.deploymentId,
      bucketId: result.projectId,
      protocolLink: result.sitePreview,
      dynamicLinks: result.affectedDomains,
    };
  }

  private async startDeployment(
    protocol: string,
    projectName: string,
    organizationId?: string,
    createSingleDeploymentToken = false
  ): Promise<{
    deploymentId: string;
    parallelUploadCount: number;
    payloadSize: number;
    singleDeploymentToken?: string;
  }> {
    try {
      let url = `${this.uploadApiUrl}/v1/upload-deployment?protocol=${protocol}&project=${projectName}`;

      if (organizationId) {
        url += `&organization=${organizationId}`;
      }

      if (createSingleDeploymentToken) {
        url += `&create_single_deployment_token=${createSingleDeploymentToken}`;
      }

      const response = await axios.post<{
        deploymentId: string;
        parallelUploadCount: number;
        singleDeploymentToken?: string;
        payloadSize: number;
      }>(url, {}, this.getAxiosRequestConfig(this.configuration.token));
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  private async uploadPayloads(
    deploymentId: string,
    payloads: FormData[],
    singleDeploymentToken: string,
    parallelUploadCount: number,
    onChunkUploaded?: (uploadedSize: number) => void
  ): Promise<{ success: boolean }> {
    let errorFlag = false;
    const limit = pLimit(parallelUploadCount);

    const uploadPayload = async (payload: FormData, deploymentId: string) => {
      try {
        if (errorFlag) {
          return;
        }
        const { data } = await axios.post<{ uploadSize: number }>(
          `${this.uploadApiUrl}/v1/upload-deployment/${deploymentId}/data`,
          payload,
          this.getAxiosRequestConfig(singleDeploymentToken)
        );
        onChunkUploaded && onChunkUploaded(data.uploadSize);
      } catch (error) {
        errorFlag = true;
      }
    };

    await Promise.all(
      payloads.map((payload) =>
        limit(() => uploadPayload(payload, deploymentId))
      )
    );
    return { success: !errorFlag };
  }

  private async finalizeUploadDeployment(
    deploymentId: string,
    upload: boolean,
    singleDeploymentToken: string
  ): Promise<{
    success: boolean;
    message: string;
    deploymentId: string;
    projectId: string;
    sitePreview: string;
    affectedDomains: string[];
  }> {
    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        deploymentId: string;
        projectId: string;
        sitePreview: string;
        affectedDomains: string[];
      }>(
        `${
          this.uploadApiUrl
        }/v1/upload-deployment/${deploymentId}/finish?action=${
          upload ? "UPLOAD" : "CANCEL"
        }`,
        {},
        this.getAxiosRequestConfig(singleDeploymentToken)
      );
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  private validateUploadConfiguration(
    configuration: UploadConfiguration
  ): void {
    const supportedProtocols = Object.values(ProtocolEnum);
    if (supportedProtocols.indexOf(configuration.protocol) === -1) {
      throw new Error(
        `Protocol '${
          configuration.protocol
        }' is not supported. Supported protocols are [${supportedProtocols.join(
          ", "
        )}].`
      );
    }

    if (!configuration.name) {
      throw new Error("Name is not provided.");
    }
  }

  private getAxiosRequestConfig(token: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}

export { UploadManager };
