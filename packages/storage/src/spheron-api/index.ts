import axios, { AxiosRequestConfig } from "axios";
import { TokenScope } from "./interfaces";

class SpheronApi {
  private readonly spheronApiUrl = "https://api-v2.spheron.network";
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getTokenScope(): Promise<TokenScope> {
    const { data } = await axios.get<TokenScope>(
      `${this.spheronApiUrl}/v1/api-keys/scope`,
      this.getAxiosRequestConfig()
    );
    return data;
  }

  async getProject(projectId: string): Promise<void> {
    const { data } = await axios.get(
      `${this.spheronApiUrl}/v1/project/${projectId}`,
      this.getAxiosRequestConfig()
    );
    console.log(data);
  }

  private getAxiosRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }
}

export default SpheronApi;
