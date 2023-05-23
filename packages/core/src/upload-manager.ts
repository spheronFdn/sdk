import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import pLimit from "p-limit";
import { ProtocolEnum } from "./spheron-api/enums";

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
  private readonly spheronApiUrl: string = "https://api-v2.spheron.network";

  public async initiateDeployment(configuration: {
    protocol: ProtocolEnum;
    name: string;
    organizationId?: string;
    token: string;
    createSingleDeploymentToken?: boolean;
  }): Promise<{
    deploymentId: string;
    parallelUploadCount: number;
    payloadSize: number;
    singleDeploymentToken?: string;
  }> {
    try {
      this.validateUploadConfiguration(configuration);

      let url = `${this.spheronApiUrl}/v1/upload-deployment?protocol=${configuration.protocol}&project=${configuration.name}`;

      if (configuration.organizationId) {
        url += `&organization=${configuration.organizationId}`;
      }

      if (configuration.createSingleDeploymentToken) {
        url += `&create_single_deployment_token=${configuration.createSingleDeploymentToken}`;
      }

      const response = await axios.post<{
        deploymentId: string;
        parallelUploadCount: number;
        singleDeploymentToken?: string;
        payloadSize: number;
      }>(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${configuration.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  public async uploadPayloads(
    payloads: FormData[],
    configuration: {
      deploymentId: string;
      token: string;
      parallelUploadCount: number;
      onChunkUploaded?: (uploadedSize: number) => void;
    }
  ): Promise<{ success: boolean; errorMessage: string }> {
    let errorMessage = "";
    const limit = pLimit(configuration.parallelUploadCount);

    const uploadPayload = async (payload: FormData, deploymentId: string) => {
      try {
        if (errorMessage) {
          return;
        }
        const { data } = await axios.post<{ uploadSize: number }>(
          `${this.spheronApiUrl}/v1/upload-deployment/${deploymentId}/data`,
          payload,
          this.getAxiosRequestConfig(configuration.token)
        );
        configuration.onChunkUploaded &&
          configuration.onChunkUploaded(data.uploadSize);
      } catch (error) {
        errorMessage = error?.response?.data?.message || error?.message;
      }
    };

    await Promise.all(
      payloads.map((payload) =>
        limit(() => uploadPayload(payload, configuration.deploymentId))
      )
    );
    return { success: !errorMessage, errorMessage: errorMessage };
  }

  public async finalizeUploadDeployment(
    deploymentId: string,
    upload: boolean,
    token: string
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
          this.spheronApiUrl
        }/v1/upload-deployment/${deploymentId}/finish?action=${
          upload ? "UPLOAD" : "CANCEL"
        }`,
        {},
        this.getAxiosRequestConfig(token)
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
