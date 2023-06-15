const { signAuthMessage } = require("./utils");
const LitJsSdk = require("@lit-protocol/lit-node-client");
const { SpheronClient } = require("@spheron/storage");
const fs = require("fs");

const main = async () => {
  const filePath = process.argv[2];
  const cid = process.argv[3];
  const spheronToken = process.argv[4];
  const walletPrivateKey = process.argv[5];

  const authSig = await signAuthMessage(walletPrivateKey);

  const client = new LitJsSdk.LitNodeClient({});
  await client.connect();

  const spheron = new SpheronClient({
    token: spheronToken,
  });

  const decryptedData = await spheron.decryptUpload({
    authSig,
    ipfsCid: cid,
    litNodeClient: client,
  });

  fs.promises.writeFile(filePath, Buffer.from(decryptedData));
};

main();
