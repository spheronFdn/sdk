<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/landing-site/blob/main/assets/logo_dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/landing-site/blob/main/assets/logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/landing-site/blob/main/assets/logo_dark.svg" width="250">
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
  <a href="https://twitter.com/SpheronHQ" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40SpheronHQ" />
  </a>
</p>

# Spheron Storage SDK

## Installation
**Using NPM**
```
npm install @spheron/storage
```
**Using Yarn**
```
yarn add @spheron/storage
```

### Usage:

In the example below you can see how to create an instance of `SpheronClient` and how to upload a file/directory to the specified protocol.

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

## Contribution Guidelines

We welcome contributions from anyone interested in helping us improve the Spheron SDK. If you have ideas for new features, bug fixes, and improvements to the documentation, please follow the guidelines below to get started.

### Code of Conduct
Please be respectful and professional when contributing to the Spheron SDK. We expect all the contributors to follow our code of conduct, which can be found in the code-of-conduct.md file.

### Communication
If you have any questions or need clarification on an issue, please contact the maintainers through Discord.

### Forking and Branching
Before making any changes, please fork the SDK repository and create a new branch for your changes. There are two ways to name a branch: feat/your-branch-name: for new features fix/your-branch-name: for bug fixes.

Use a descriptive branch name that reflects the changes you plan to make.

### Coding Standards
Please follow the Spheron SDK coding standards below. It is recommended to use prettier to format the code for all the files. Add appropriate comment lines where necessary, explaining what you intend to do properly.

### Pull Requests
When you are ready to make changes, please create a pull request on GitHub. Provide a detailed description of what you have done and why. Maintainers will review your changes and provide you with feedback.

### Keeping Up-to-Date
After submitting your changes, please keep your fork up to date with the latest changes made to the SDK repository. This will ensure that your contributions are compatible with the project's latest version.

## Support
You can support Spheron SDK in many different ways:

- Create new features and fix bugs.
- Report bugs or missing features by creating an issue.
- Review and comment on existing pull requests and issues.
- Join our Discord and help new users contribute to the Spheron SDK.
- Give us Feedback. Tell us what we are doing well and where we can improve. Please upvote the issue that you are most interested in seeing solved.
