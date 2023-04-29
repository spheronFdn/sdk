<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Compute SDK</h1>

<p align="center">
  This package provides support for working with Spheron Compute organization.
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

### Usage

The package exports `SpheronComputeClient` class, which includes methods for working with clusters, marketplace apps, cluster instances and their configurations. The constructor of `SpheronComputeClient` takes in one parameter `token`. Check the **Access Token** section for information on how to create a token.

```js
import SpheronComputeClient from "@spheron/compute";
...
const computeClient = new SpheronComputeClient({ token });
await computeClient.clusterInstance.create(
    {
    organizationId: "63612a842e50ee3ffbebcf06",
    configuration: {
      folderName: "",
      protocol: ClusterProtocolEnum.AKASH,
      image: dockerImage,
      tag: dockerImageTag,
      instanceCount: numberOfInstances,
      buildImage: false,
      ports: [{ containerPort: 8000, exposedPort: 8000 }],
      env: [{ value: "t=t", isSecret: false }],
      command: [],
      args: [],
      region: deployReegion,
      akashMachineImageName: machineType,
    },
    clusterUrl: dockerImage,
    clusterProvider: ProviderEnum.DOCKERHUB,
    clusterName: clusterName,
    healthCheckUrl: healthCheckPath,
    healthCheckPort: healthChekcPort,
  }
);
```

For more information about the Site methods, check out the [DOCS](https://docs.spheron.network/sdk/compute/)

## Access Token

To create the `token` that is used with the `SpheronComputeClient`, follow the instructions in the [DOCS](https://docs.spheron.network/rest-api/#creating-an-access-token). When you are creating the tokens, please choose **compute app** type in the dashboard.

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
