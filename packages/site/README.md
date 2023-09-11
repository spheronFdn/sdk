<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Site SDK</h1>

<p align="center">
  This package provides support for working with Spheron Web-App organization.
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/@spheron/storage" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.2&color=green" />
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

### Usage

The package exports `SpheronClient` class, which includes methods for working with organizations, projects, deployments and their configurations. The constructor of `SpheronClient` takes in one parameter `token`. Check the **Access Token** section for information on how to create a token.

```js
import { SpheronClient } from "@spheron/site";

...

const spheron = new SpheronClient({ token });

await spheron.deployments.deploy({
  gitUrl, // the url of the repository
  projectName, // if the project for the repository does not exists, a new project will be created with this name
  environmentVariables: {
    KEY_1: "value1",
  },
  provider: ProviderEnum.GITHUB, // the provider of the git url
  branch: "main", // the branch name that should be deployed
  protocol: ProtocolEnum.IPFS, // the protocol on which the deployment should be uploaded
  configuration: {
    framework: FrameworkEnum.REACT,
    workspace: "",
    installCommand: "yarn install",
    buildCommand: "yarn build",
    publishDir: "build",
    nodeVersion: NodeVersionEnum.V_16,
  },
});
```

For more information about the Site methods, check out the [DOCS](https://docs.spheron.network/sdk/site/)

## Access Token

To create the `token` that is used with the `SpheronClient`, follow the instructions in the [DOCS](https://docs.spheron.network/rest-api/#creating-an-access-token). When you are creating the tokens, please choose **web app** type in the dashboard.

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
