import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import pLimit from "p-limit";
import { ProtocolEnum } from "../enums";
import PayloadCreator from "./upload-context";

export interface UploadMangerConfiguration {
  token: string;
}

export interface UploadConfiguration {
  path: string;
  protocol: ProtocolEnum;
  name: string;
}

export interface UploadResult {
  uploadId: string;
  bucketId: string;
  protocolLink: string;
  dynamicLinks: string[];
}

class UploadManager {
  // private readonly uploadApiUrl = "https://api-dev.spheron.network";
  private readonly uploadApiUrl: string = "http://localhost:8002";

  private readonly MAX_PAYLOAD_SIZE = 1024 * 1024 * 6;
  private readonly PARALLEL_UPLOAD_COUNT = 5;
  private readonly configuration: UploadMangerConfiguration;

  constructor(configuration: UploadMangerConfiguration) {
    this.configuration = configuration;
  }

  public async upload(
    configuration: UploadConfiguration
  ): Promise<UploadResult> {
    this.validateUploadConfiguration(configuration);

    const payloadCreator = new PayloadCreator(
      configuration.path,
      this.MAX_PAYLOAD_SIZE
    );
    const payloads = await payloadCreator.createPayloads();

    const { deploymentId } = await this.startDeployment(
      configuration.protocol,
      configuration.name
    );

    const uploadPayloadsResult = await this.uploadPayloads(
      deploymentId,
      payloads
    );

    const result = await this.finalizeUploadDeployment(
      deploymentId,
      uploadPayloadsResult.success
    );

    if (!result.success) {
      throw new Error(result.message);
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
  ): Promise<{ deploymentId: string }> {
    try {
      const response = await axios.post<{ deploymentId: string }>(
        `${this.uploadApiUrl}/v1/upload-deployment?protocol=${protocol}&project=${projectName}`,
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
    payloads: FormData[]
  ): Promise<{ success: boolean }> {
    let errorFlag = false;
    const limit = pLimit(this.PARALLEL_UPLOAD_COUNT);

    const uploadPayload = async (payload: FormData, deploymentId: string) => {
      try {
        if (errorFlag) {
          return;
        }
        await axios.post(
          `${this.uploadApiUrl}/v1/upload-deployment/${deploymentId}/data`,
          payload,
          this.getAxiosRequestConfig()
        );
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
          this.uploadApiUrl
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
