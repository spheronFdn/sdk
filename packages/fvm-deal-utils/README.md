<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Storage SDK</h1>

<p align="center">
  🧰 SDK for multi-chain storage, powered by Spheron.
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/@spheron/storage" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.19&color=green" />
  </a>
  <a href="https://github.com/spheronFdn/sdk/blob/main/LICENSE" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=license&message=Apache%202.0&color=red" />
  </a>
  <a href="https://discord.com/invite/ahxuCtm" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=community&message=discord&color=blue" />
  </a>
  <a href="https://twitter.com/SpheronFdn" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40SpheronFdn" />
  </a>
</p>

### Upload Example

In the example below you can see how to create an instance of `SpheronClient` and how to upload a file/directory to the specified protocol.

```js
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

const client = new SpheronClient({ token });
let currentlyUploaded = 0;
const { uploadId, bucketId, protocolLink, dynamicLinks, cid } =
  await client.upload(filePath, {
    protocol: ProtocolEnum.IPFS,
    name,
    onUploadInitiated: (uploadId) => {
      console.log(`Upload with id ${uploadId} started...`);
    },
    onChunkUploaded: (uploadedSize, totalSize) => {
      currentlyUploaded += uploadedSize;
      console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
    },
  });
```

- Function `upload` has two parameters `client.upload(filePath, configuration);`
  - `filePath` - the path to the file/directory that will be uploaded
  - `configuration` - an object with parameters:
    - `configuration.name` - represents the name of the bucket on which you are uploading the data.
    - `configuration.protocol` - a protocol on which the data will be uploaded. The supported protocols are [ `ARWEAVE`, `IPFS`, `FILECOIN`].
    - `configuration.onUploadInitiated` - **optional** - callback function `(uploadId: string) => void`. The function will be called once, when the upload is initiated, right before the data is uploaded. The function will be called with one parameter, `uploadId`, which represents the id of the started upload.
    - `configuration.onChunkUploaded` - **optional** - callback function `(uploadedSize: number, totalSize: number) => void`. The function will be called multiple times, depending on the upload size. The function will be called each time a chunk is uploaded, with two parameters. the first one `uploadedSize` represents the size in Bytes for the uploaded chunk. The `totalSize` represents the total size of the upload in Bytes.
  - The response of the upload function is an object with parameters:
    - `uploadId` - the id of the upload
    - `bucketId` - the id of the bucket
    - `protocolLink` - is the protocol link of the upload
    - `dynamicLinks` - are domains that you have setup for your bucket. When you upload new data to the same bucket, the domains will point to the new uploaded data.
    - `cid` - the CID of the uploaded data. Only exists for IPFS and Filecoin protocols.

### IPNS Example

In the example below you can see how to publish an upload to IPNS, update IPNS to another upload id and get all IPNS names for an organization.

```js
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

const client = new SpheronClient({ token });
let currentlyUploaded = 0;
const { uploadId, bucketId, protocolLink, dynamicLinks, cid } =
  await client.upload(filePath, {
    protocol: ProtocolEnum.IPFS, // Only works with IPFS and Filecoin uploads
    name,
    onUploadInitiated: (uploadId) => {
      console.log(`Upload with id ${uploadId} started...`);
    },
    onChunkUploaded: (uploadedSize, totalSize) => {
      currentlyUploaded += uploadedSize;
      console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
    },
  });

// Publish Upload to IPNS
const ipnsData: IPNSName = await client.publishIPNS(uploadId);

// Upload second file to Spheron
const uploadIdTwo = await client.upload(filePath2, { ...uploadDetails });

// Update IPNS Name to point to another upload
const ipnsData: IPNSName = await client.updateIPNSName(
  ipnsData.id,
  uploadIdTwo
);

// Get all published IPNS Names for organization
const orgIPNSNames: IPNSName[] = await client.getIPNSNamesForOrganization(
  organizationId
);
```

- Function `publishIPNS` has one parameter `client.upload(uploadId);`
  - `uploadId` - the upload id of file uploaded using Spheron SDK
- Function `updateIPNSName` has two parameters `client.updateIPNSName(ipnsNameId, uploadId);`
  - `ipnsNameId` - the IPNS name id of a previously published upload
  - `uploadId` - the new upload id you want IPNS Name to point to.
- Function `orgIPNSNames` has one parameter `client.upload(organizationId);`
  - `organizationId` - your organization id

---

### For more information about the Storage SDK, check out the [DOCS](https://docs.spheron.network/sdk/storage/)

## Access Token

To create the `token` that is used with the `SpheronClient`, follow the instructions in the [DOCS](https://docs.spheron.network/rest-api/#creating-an-access-token). When you are creating the tokens, please choose **web app** type in the dashboard.

## Notes

The package is only meant for Node.js environments and will not work in a browser or frontend apps.

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
