import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import pLimit from "p-limit";
import config from "../config/env";
import { ProtocolEnum } from "../enums";
import PayloadCreator from "./upload-context";

export interface UploadMangerConfiguration {
  token: string;
}

export interface UploadConfiguration {
  path: string;
  protocol: ProtocolEnum;
  name: string;
  onUploadInitiated?: (uploadId: string) => void;
  onChunkUploaded?: (uploadedSize: number, totalSize: number) => void;
}

export interface UploadResult {
  uploadId: string;
  bucketId: string;
  protocolLink: string;
  dynamicLinks: string[];
}

class UploadManager {
  private readonly configuration: UploadMangerConfiguration;

  constructor(configuration: UploadMangerConfiguration) {
    this.configuration = configuration;
  }

  public async upload(
    configuration: UploadConfiguration
  ): Promise<UploadResult> {
    this.validateUploadConfiguration(configuration);

    const { deploymentId, payloadSize, parallelUploadCount } =
      await this.startDeployment(configuration.protocol, configuration.name);

    configuration.onUploadInitiated &&
      configuration.onUploadInitiated(deploymentId);

    const payloadCreator = new PayloadCreator(configuration.path, payloadSize);
    const { payloads, totalSize } = await payloadCreator.createPayloads();

    const uploadPayloadsResult = await this.uploadPayloads(
      deploymentId,
      payloads,
      parallelUploadCount,
      totalSize,
      configuration.onChunkUploaded
    );

    const result = await this.finalizeUploadDeployment(
      deploymentId,
      uploadPayloadsResult.success
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
    projectName: string
  ): Promise<{
    deploymentId: string;
    parallelUploadCount: number;
    payloadSize: number;
  }> {
    try {
      const response = await axios.post<{
        deploymentId: string;
        parallelUploadCount: number;
        payloadSize: number;
      }>(
        `${config.spheronApiUrl}/v1/upload-deployment?protocol=${protocol}&project=${projectName}`,
        {},
        this.getAxiosRequestConfig()
      );
      return response.data;
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  private async uploadPayloads(
    deploymentId: string,
    payloads: FormData[],
    parallelUploadCount: number,
    totalSize: number,
    onChunkUploaded?: (uploadedSize: number, totalSize: number) => void
  ): Promise<{ success: boolean }> {
    let errorFlag = false;
    const limit = pLimit(parallelUploadCount);

    const uploadPayload = async (payload: FormData, deploymentId: string) => {
      try {
        if (errorFlag) {
          return;
        }
        const { data } = await axios.post<{ uploadSize: number }>(
          `${config.spheronApiUrl}/v1/upload-deployment/${deploymentId}/data`,
          payload,
          this.getAxiosRequestConfig()
        );
        onChunkUploaded && onChunkUploaded(data.uploadSize, totalSize);
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
    upload: boolean
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
          config.spheronApiUrl
        }/v1/upload-deployment/${deploymentId}/finish?action=${
          upload ? "UPLOAD" : "CANCEL"
        }`,
        {},
        this.getAxiosRequestConfig()
      );
      return response.data;
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message;
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

  private getAxiosRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this.configuration.token}`,
      },
    };
  }
}

export default UploadManager;
