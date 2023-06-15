import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { encryptUpload, decryptUpload } from "@spheron/browser-upload";

const client = new LitJsSdk.LitNodeClient({});
const chain = "ethereum";

// Checks if the user has at least 0 ETH
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "0",
    },
  },
];

class Lit {
  litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptFile(file: any, configuration: any) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const uploadRes = encryptUpload({
      authSig,
      accessControlConditions,
      chain,
      file,
      litNodeClient: this.litNodeClient,
      configuration,
    });
    return uploadRes;
  }

  async decryptFile(ipfsCid: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const decryptedFile = await decryptUpload({
      authSig,
      ipfsCid,
      litNodeClient: this.litNodeClient,
    });

    return decryptedFile;
  }
}
const lit = new Lit();

export default lit;
