const { signAuthMessage } = require("./utils");
const LitJsSdk = require("@lit-protocol/lit-node-client");
const { SpheronClient } = require("@spheron/storage");

const chain = "ethereum";

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

const main = async () => {
  const filePath = process.argv[2];
  const bucketName = process.argv[3];
  const spheronToken = process.argv[4];
  const walletPrivateKey = process.argv[5];

  const authSig = await signAuthMessage(walletPrivateKey);

  const client = new LitJsSdk.LitNodeClient({});
  await client.connect();

  const spheron = new SpheronClient({
    token: spheronToken,
  });

  const uploadResponse = await spheron.encryptUpload({
    authSig,
    accessControlConditions,
    chain,
    filePath,
    litNodeClient: client,
    configuration: {
      name: bucketName,
    },
  });

  console.log(uploadResponse);
};

main();
