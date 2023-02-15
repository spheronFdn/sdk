//TODO: Use spheron sdk to upload files
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { configuration } = require("./configuration");

const { configFileExists, readFromConfigFile } = require("./utils");

async function uploadDir(
  directory,
  rootPath,
  protocol,
  organizationId,
  projectName
) {
  const { jwtToken, orgId } = await checkUploadConstraint(organizationId);
  console.log("Upload in progress...");
  const data = new FormData();
  fillDirectoryFormData(directory, rootPath, data);
  const response = await axios.post(
    `${configuration.upload_api_address}/v1/deployment/upload?protocol=${protocol}&organization=${orgId}&project=${projectName}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (response.data.success == true) {
    console.log(
      `Upload was succesfull\nSite preview: ${response.data.sitePreview}\nDomains: ${response.data.affectedDomains}`
    );
  } else {
    console.log("Upload failed");
  }
}

async function uploadFile(
  rootPath,
  protocol,
  organizationId,
  projectName
) {
  const { jwtToken, orgId } = await checkUploadConstraint(organizationId);
  console.log("Upload in progress...");
  const data = new FormData();
  data.append("files", fs.createReadStream(rootPath), {
    filepath: rootPath,
  });
  const response = await axios.post(
    `${configuration.upload_api_address}/v1/deployment/upload?protocol=${protocol}&organization=${orgId}&project=${projectName}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  if (response.data.success == true) {
    console.log(
      `Upload was succesfull\nSite preview: ${response.data.sitePreview}\nDomains: ${response.data.affectedDomains}`
    );
  } else {
    console.log("Upload failed");
  }
}

async function checkUploadConstraint(organizationId) {
  if (!(await configFileExists())) {
    throw new Error("config file not present");
  }
  const jwtToken = await readFromConfigFile("jwtToken");
  if (!jwtToken) {
    throw new Error("JWT token not present. Execute login command");
  }
  let orgId = organizationId;
  if (!orgId) {
    orgId = await readFromConfigFile("organization");
    if (!orgId) {
      throw new Error("Organization is not provided");
    }
  }
  return { jwtToken, orgId };
}

function fillDirectoryFormData(dir, rootPath, formData) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const path = dir + "/" + file;
    const filePath = rootPath + file;
    if (fs.statSync(path).isDirectory()) {
      fillDirectoryFormData(path, filePath + "/", formData);
    } else {
      formData.append("files", fs.createReadStream(path), {
        filepath: filePath,
      });
    }
  }
}


module.exports = {
  uploadDir,
  uploadFile
};
