import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import pLimit from "p-limit";
import { ProtocolEnum } from "./spheron-api/enums";
import { PinStatus } from "./spheron-api/interfaces";

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
  cid?: string;
}

class UploadManager {
  // private readonly spheronApiUrl: string = "https://api-v2.spheron.network";
  private readonly spheronApiUrl: string = "http://localhost:8002";

  public async initiateUpload(configuration: {
    protocol: ProtocolEnum;
    name: string;
    organizationId?: string;
    token: string;
    createSingleUseToken?: boolean;
  }): Promise<{
    uploadId: string;
    parallelUploadCount: number;
    payloadSize: number;
    singleUseToken?: string;
  }> {
    try {
      this.validateUploadConfiguration(configuration);

      let url = `${this.spheronApiUrl}/v1/upload/initiate?protocol=${configuration.protocol}&bucket=${configuration.name}`;

      if (configuration.organizationId) {
        url += `&organization=${configuration.organizationId}`;
      }

      if (configuration.createSingleUseToken) {
        url += `&create_single_use_token=${configuration.createSingleUseToken}`;
      }

      const response = await axios.post<{
        uploadId: string;
        parallelUploadCount: number;
        singleUseToken?: string;
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
  public async pinCID(configuration: {
    name: string;
    organizationId?: string;
    token: string;
    cid: string;
  }): Promise<{
    uploadId: string;
    bucketId: string;
    protocolLink: string;
    dynamicLinks: string[];
  }> {
    try {
      if (!configuration.name) {
        throw new Error("Bucket name is not provided.");
      }
      let url = `${this.spheronApiUrl}/v2/ipfs/pin/${configuration.cid}?bucket=${configuration.name}`;

      if (configuration.organizationId) {
        url += `&organization=${configuration.organizationId}`;
      }

      console.log(url);

      const response = await axios.post<{
        uploadId: string;
        bucketId: string;
        protocolLink: string;
        dynamicLinks: string[];
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

  public async getCIDStatus(CID: string): Promise<{ pinStatus: PinStatus }> {
    try {
      if (!CID) {
        throw new Error("CID is not provided.");
      }
      const url = `${this.spheronApiUrl}/v1/ipfs/pins/${CID}/status`;
      const response = await axios.get<{ pinStatus: PinStatus }>(url);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message;
      throw new Error(errorMessage);
    }
  }

  public async uploadPayloads(
    payloads: FormData[],
    configuration: {
      uploadId: string;
      token: string;
      parallelUploadCount: number;
      onChunkUploaded?: (uploadedSize: number) => void;
    }
  ): Promise<{ success: boolean; errorMessage: string }> {
    let errorMessage = "";
    const limit = pLimit(configuration.parallelUploadCount);

    const uploadPayload = async (payload: FormData, uploadId: string) => {
      try {
        if (errorMessage) {
          return;
        }
        const { data } = await axios.post<{ uploadSize: number }>(
          `${this.spheronApiUrl}/v1/upload/${uploadId}/data`,
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
        limit(() => uploadPayload(payload, configuration.uploadId))
      )
    );
    return { success: !errorMessage, errorMessage: errorMessage };
  }

  public async finalizeUpload(
    uploadId: string,
    upload: boolean,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    uploadId: string;
    bucketId: string;
    protocolLink: string;
    dynamicLinks: string[];
    cid: string;
  }> {
    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        uploadId: string;
        bucketId: string;
        protocolLink: string;
        dynamicLinks: string[];
        cid: string;
      }>(
        `${this.spheronApiUrl}/v1/upload/${uploadId}/finish?action=${
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
      throw new Error("Bucket name is not provided.");
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
