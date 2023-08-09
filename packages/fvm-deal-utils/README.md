<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">FVM Deal Utils SDK</h1>

<p align="center">
  🧰 SDK to create storage deals on FVM, powered by Spheron.
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/@spheron/storage" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.0&color=green" />
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

### getFvmMetadata Example

In the example below you can see how to create an instance of `SpheronDealClient` and how to generate the metadata required for creating a storage deal on FVM.

```ts
const client = new SpheronDealClient({ token });

let currentlyUploaded = 0;
const result: DealDataResult = await client.getFvmMetadata(filePath, {
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

- The response of the `getFvmMetadata` function is an object with the following properties:
  - `pieceSize` - the size of the file in bytes
  - `size` - the size of the CAR file in bytes
  - `pieceCid` - hash of the piece in hex
  - `dataCid` - IPFS hash of the car file
  - `carLink` - the IPFS URL of the generated car file.
  - `carName` - the name of the car
  - `uploadId` - the id of the upload on which the car was uploaded

```

```
