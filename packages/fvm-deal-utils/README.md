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

### getPrepData Example

In the example below you can see how to create an instance of `SpheronDealClient` and how to generate the metadata required for creating a storage deal on FVM.

```js
const { SpheronDealClient } = require("@spheron/fvm-deal-utils");
const path = require("path");

const client = new SpheronDealClient({ token });

const dealData = await client.getPrepData(fileName, bucketName);
console.log(dealData);
```

- Function `getprepData` has two parameters `client.getPrepData(fileName, bucketName);`

  - `fileName` - the path to the file/directory that we are trying to create a deal for
  - `bucketName` - a name of the storage bucket
    <br/><br/>

  Below is a sample response

  ```
  Upload with id 64bb907ca22cea001258f651 started...
  Uploaded 3031 of 3031 Bytes.
  {
    pieceSize: 4096,
    size: 2839,
    pieceCid: '0x0181e20392202058c13b2fb8dd4631cc7af7ae78b1a211024a8688a1253919ede23c6fd016931e',
    dataCid: 'bafybeiepi7yb6ei4thaevbs4h7bw6jf6ttlzpvs75y6jkxhierck26gtgi',
    carLink: 'https://bafybeidk3zuybfr4vulrkjubilgaynixxj4cui6fkpdc6xvsalgaegenr4.ipfs.sphn.link'
  }
  ```

  - The response of the `getPrepData` function is an object with the following properties:
    - `pieceSize` - the size of the file in bytes
    - `size` - the size of the CAR file in bytes
    - `pieceCid` - hash of the piece in hex
    - `dataCid` - IPFS hash of the car file
    - `carLink` - the IPFS URL of the generated car file.
