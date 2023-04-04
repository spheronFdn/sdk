<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Web Upload SDK</h1>

<p align="center">
  🧰 SDK support for multi-chain storage from browser, powered by Spheron.
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

## Description:

- This package support uploading data directly from the browser without exposing you Spheron API token.
- To use this package, you would first need to initiate an Upload from your Backend service. To initiate the request you would need to send a post request to
  `POST: /v1/upload-deployment?project=<project_name>&protocol=<'ipfs'|'ipfs-filecoin'|'arweave'>&create_single_deployment_token=true` with your API Spheron token.
  The response of this request will include the id of the initiated deployment and also a single use token that can be used to upload data only for that deployment.
  Response would look like:

```
{
  "deploymentId": <deploymentId>,
  "singleDeploymentToken": <token that can be used only to upload data for the specified deployment>
}
```

After you get the `singleDeploymentToken`, you should return it to the browser and use it with the **@spheron/web-upload** to upload the data from the browser to the specified protocol.

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
