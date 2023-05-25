<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Browser Upload</h1>

<p align="center">  
  <a href="https://www.npmjs.com/package/@spheron/storage" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.1&color=green" />
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

## Usage:

This package adds support to upload files directly from browser to IPFS, Filecoin or Arweave via Spheron.
The general usage flow would be as:

1. Send a request from your web app to your BE service to generate a token that can be used only for a single upload. In this request you can check if the user of you app has all the requirements to upload data.

```js
// Send a request to your Backend endpoint to create a token that will be used with the @spheron/browser-upload
const response = await fetch(`<BACKEND_URL>/initiate-upload`);
```

2. On your BE service, use the method `createSingleUploadToken` from [@spheron/storage](https://www.npmjs.com/package/@spheron/storage) package. This method will provide you with a unique token that can only be used for a single upload with the `upload` function from [@spheron/browser-upload](https://www.npmjs.com/package/@spheron/browser-upload), and this token has a expiration of 10 minutes.

```js
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

...

app.get("/initiate-upload", async (req, res, next) => {
  try {
    const bucketName = "example-browser-upload"; // use which ever name you prefer
    const protocol = ProtocolEnum.IPFS; // use which ever protocol you prefer

    const client = new SpheronClient({
      token: <SPHERON_TOKEN>,
    });

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
```

3. Return to your web app the token you got from `createSingleUploadToken`, and using `upload` method from [@spheron/browser-upload](https://www.npmjs.com/package/@spheron/browser-upload), upload files directly from the Browser to the specified protocol.

```js
import { upload } from "@spheron/browser-upload";

...

const response = await fetch(`<BACKEND_URL>/initiate-upload`); // from step 1
const resJson = await response.json();
const token =  resJson.uploadToken;
const uploadResult = await upload(<FILES_YOU_WANT_TO_UPLOAD>, { token });

...
```

Using this flow, you can control who can use you API token and upload data from your web app.

> Checkout the [LINK](https://github.com/spheronFdn/sdk/tree/main/examples/browser-upload) for a working example.

## Example:

```js
import { upload } from "@spheron/browser-upload";

const uploadToken = /* logic that would send a request to your BE and return a token that can be used only for a single upload */

let currentlyUploaded = 0;
const uploadResult = await upload(files, {
  token: res.uploadToken,
  onChunkUploaded: (uploadedSize, totalSize) => {
    currentlyUploaded += uploadedSize;
    console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
  },
});

```

- The package exports one function `upload(files: File[], configuration: { token: string; onChunkUploaded?: (uploadedSize: number, totalSize: number) => void; }): Promise<UploadResult>`
  - Function `upload` has two parameters `client.upload(filePath, configuration);`
    - `files` - files that will be uploaded.
    - `configuration` - an object with parameters:
      - `configuration.token` - a token used for a single upload. Check the **Access Token** section bellow for more information.
      - `configuration.onChunkUploaded` - **optional** - callback function `(uploadedSize: number, totalSize: number) => void`. The function will be called multiple times, depending on the upload size. The function will be called each time a chunk is uploaded, with two parameters. the first one `uploadedSize` represents the size in Bytes for the uploaded chunk. The `totalSize` represents the total size of the upload in Bytes.
  - The response of the upload function is an object with parameters:
    - `uploadId` - the id of the upload.
    - `bucketId` - the id of the bucket.
    - `protocolLink` - the protocol link of the upload.
    - `dynamicLinks` - domains that you have setup for your bucket. When you upload new data to the same bucket, the domains will point to the new uploaded data.

## Access Token

To create a token you should use the method `createSingleUploadToken` from [@spheron/storage](https://www.npmjs.com/package/@spheron/storage) package on you Backend service. This method will generate a unique token that can be used only for a single upload.

## Notes

The package is only meant for Browser environments.

## Learn More

You can learn more about Spheron and browser-upload package here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
