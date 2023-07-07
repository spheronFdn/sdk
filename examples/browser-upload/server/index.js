const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8111;
const SPHERON_TOKEN = process.env.SPHERON_TOKEN;

app.use(cors());
app.use(express.json());

const client = new SpheronClient({
  token: SPHERON_TOKEN,
});

app.post("/initiate-upload", async (req, res, next) => {
  try {
    const bucketName = req.body.bucketName;
    const protocol = ProtocolEnum.IPFS;

    const { uploadToken } = await client.createSingleUploadToken({
      name: bucketName,
      protocol,
    });

    res.status(200).json({
      uploadToken,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/add-domain", async (req, res, next) => {
  try {
    const { bucketId, link, type, name } = req.body;
    const bucketDomain = await client.addBucketDomain(bucketId, {
      link,
      type,
      name,
    });
    const { cdnARecords, cdnCnameRecords } = await client.getCdnDnsRecords();

    res.status(200).json({
      bucketDomain,
      cdnARecords,
      cdnCnameRecords,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/verify-domain", async (req, res, next) => {
  try {
    const { bucketId, name } = req.body;

    const domainStatus = await client.verifyBucketDomain(bucketId, name);

    res.status(200).json({
      verified: domainStatus.verified,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
