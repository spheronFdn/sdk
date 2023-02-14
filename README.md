<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/aayush/sph-1148/.github/assets/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/aayush/sph-1148/.github/assets/logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/aayush/sph-1148/.github/assets/logo-dark.svg" width="250">
  </picture>
</p>

<p align="center">
  🧰 Developer toolkits for web3 cloud infrastructure, powered by Spheron.
</p>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=npm&message=v14.0.0&color=green" />
  <img src="https://img.shields.io/static/v1?label=license&message=Apache%202.0&color=red" />
  <a href="https://discord.com/invite/ahxuCtm" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=community&message=discord&color=blue" />
  </a>
  <a href="https://twitter.com/SpheronFdn" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40SpheronFdn" />
  </a>
</p>

## Spheron Storage SDK

### Installation
Using NPM
```
npm install @spheron/storage
```
Using Yarn
```
yarn add @spheron/storage
```

### Usage

In the example below, you can see how to create an instance of `SpheronClient` and how to upload a file/directory to the specified protocol.

```
import SpheronClient, { ProtocolEnum } from "@spheron/storage";

...
const client = new SpheronClient({ token });
const { uploadId, bucketId, protocolLink, dynamicLinks } = await client.upload(filePath, { protocol: ProtocolEnum.IPFS, name });
...
```

- The `SpheronClient` constructor takes an object that has one property `token`.
- Function `upload` has two parameters `client.upload(filePath, configuration);`
  - `filePath` - the path to the file/directory that will be uploaded
  - `configuration` - an object with two parameters:
    - `configuration.name` - represents the name of the bucket on which you are uploading the data.
    - `configuration.protocol` - a protocol on which the data will be uploaded. The supported protocols are [ `ARWEAVE`, `IPFS`, `FILECOIN`].
  - The response of the upload function is an object with parameters:
    - `uploadId` - the id of the upload
    - `bucketId` - the id of the bucket
    - `protocolLink` - is the protocol link of the upload
    - `dynamicLinks` - are domains that you have setup for your bucket. When you upload new data to the same bucket, the domains will point to the new uploaded data.

## Contribution
We encourage you to read the [contribution guidelines](https://github.com/spheronFdn/sdk/blob/aayush/sph-1148/.github/contribution-guidelines.md) to learn about our development process and how to propose bug fixes and improvements before submitting a pull request.

The Spheron community extends beyond issues and pull requests! You can support Spheron [in many other ways](https://github.com/spheronFdn/sdk/blob/aayush/sph-1148/.github/support.md) as well.

## Community
For help, discussions or any other queries: [Join us on Discord](https://discord.com/invite/ahxuCtm)
