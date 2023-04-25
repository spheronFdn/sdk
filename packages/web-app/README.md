<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Web-App SDK</h1>

<p align="center">
  This package provides support for working with Spheron Web-App organization.
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

The package exports `SpheronClient` class, which includes methods for working with organizations, projects, deployments and their configurations. The constructor of `SpheronClient` takes in one parameter `token`. Check the **Access Token** section for information on how to create a token.

```js
import { SpheronClient } from "@spheron/storage";

const client = new SpheronClient({ token });
```

### Methods

- `async getTokenScope(): Promise<TokenScope>`
  - returns the scope of the token that was used to initialize the `SpheronClient`.

```ts
interface TokenScope {
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  organizations: {
    id: string;
    name: string;
    username: string;
  }[];
}
```

#### Organization Methods

- `async getOrganization(organizationId: string): Promise<Organization>`
  - used to fetch an organization based on id.

```
interface Organization {
    _id: string;
    profile: {
        name: string;
        image: string;
        username: string;
    };
    users: [string];
    registries: string[];
    overdue: boolean;
    appType: AppTypeEnum;
}
```

- `async getOrganizationProjects( organizationId: string, options: { skip: number; limit: number; state?: ProjectStateEnum; } ): Promise<Project[]>`
  - used to fetch the projects of the organization

```ts
enum ProjectStateEnum {
  MAINTAINED = "MAINTAINED",
  ARCHIVED = "ARCHIVED",
}

interface Project {
  _id: string;
  name: string;
  type: ProjectTypeEnum;
  url: string;
  environmentVariables: EnvironmentVariable[];
  deploymentEnvironments: DeploymentEnvironment[];
  organization: string;
  state: ProjectStateEnum;
  hookId: string;
  provider: string;
  prCommentIds: {
    prId: string;
    commentId: string;
  }[];
  configuration: Configuration[];
  passwordProtection: PasswordProtection;
  createdAt: Date;
  updatedAt: Date;
  domains: Domain[];
}
```

- `async getOrganizationProjectCount( organizationId: string, options: { state?: ProjectStateEnum; }): Promise<number>`
  - used to get the number of projects for the organization.

## Access Token

To create the `token` that is used with the `SpheronClient`, follow the instructions in the [DOCS](https://docs.spheron.network/rest-api/#creating-an-access-token). When you are creating the tokens, please choose **web app** type in the dashboard.

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
