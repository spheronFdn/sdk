const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8111;
const SPHERON_TOKEN = process.env.SPHERON_TOKEN;

app.use(cors());

app.post("/initiate-upload", async (req, res, next) => {
  try {
    const response = await axios.post(
      `http://localhost:8002/v1/upload-deployment?project=example-webpackage&protocol=ipfs&create_single_deployment_token=true`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SPHERON_TOKEN}`,
        },
      }
    );
    res.status(200).json({
      uploadId: response.data.deploymentId,
      uploadToken: response.data.singleDeploymentToken,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
