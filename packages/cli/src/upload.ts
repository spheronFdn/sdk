//TODO: Use spheron sdk to upload files
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import configuration from "./configuration";

import { fileExists, readFromJsonFile } from "./utils";

export async function uploadDir(
  rootPath: string,
  protocol: string,
  organizationId: string,
  projectName: string
) {
  const { jwtToken, orgId } = await checkUploadConstraint(organizationId);
  console.log("Upload in progress...");
  const data = new FormData();
  fillDirectoryFormData(rootPath, data);
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

export async function uploadFile(
  rootPath: string,
  protocol: string,
  organizationId: string,
  projectName: string
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

async function checkUploadConstraint(organizationId: string) {
  if (!(await fileExists(configuration.configFilePath))) {
    throw new Error("config file not present");
  }
  const jwtToken = await readFromJsonFile(
    "jwtToken",
    configuration.configFilePath
  );
  if (!jwtToken) {
    throw new Error("JWT token not present. Execute login command");
  }
  let orgId = organizationId;
  if (!orgId) {
    orgId = await readFromJsonFile(
      "organization",
      configuration.configFilePath
    );
    if (!orgId) {
      throw new Error("Organization is not provided");
    }
  }
  return { jwtToken, orgId };
}

function fillDirectoryFormData(rootPath: string, formData: any) {
  const files = fs.readdirSync(rootPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(rootPath, file.name);
    if (file.isDirectory()) {
      fillDirectoryFormData(filePath, formData);
    } else {
      formData.append("files", fs.createReadStream(filePath), {
        filepath: filePath.slice(rootPath.length),
      });
    }
  }
}
