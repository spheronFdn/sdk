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

  const client = new LitJsSdk.LitNodeClient({});
  await client.connect();

  const authSig = await signAuthMessage(walletPrivateKey);

  const spheron = new SpheronClient({
    token: spheronToken,
  });

  let currentlyUploaded = 0;

  const uploadResponse = await spheron.encryptUpload({
    authSig,
    accessControlConditions,
    chain,
    filePath,
    litNodeClient: client,
    configuration: {
      name: bucketName,
      onUploadInitiated: (uploadId) => {
        console.log(`Upload with id ${uploadId} started...`);
      },
      onChunkUploaded: (uploadedSize, totalSize) => {
        currentlyUploaded += uploadedSize;
        console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
      },
    },
  });

  console.log(uploadResponse);
};

main();
