<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Storage SDK</h1>

<p align="center">
  🧰 SDK for multi-chain storage, powered by Spheron.
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/@spheron/storage" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.3&color=green" />
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

In the example below you can see how to create an instance of `SpheronClient` and how to upload a file/directory to the specified protocol.

```js
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

---

The `SpheronClient` instance also provides methods for working with buckets. The supported methods are:

- `async getBucket(bucketId: string): Promise<Bucket>` - used to get the bucket information for the specified `bucketId`.
- `async  getBucketDomains(bucketId: string): Promise<{ domains: Domain[] }>` - used to get the domains that are attached to the specified `bucketId`.
- `async  getBucketDomain(bucketId: string, domainIdentifier: string): Promise<{ domain: Domain }>` - used to get the information about the specific domain. The `domainIdentifier` can ether be the id of the domain, or the name of the domain.
- `async  addBucketDomain(bucketId: string, { link:  string; type: DomainTypeEnum; name: string; }): Promise<{ domain: Domain }>` - used to attach a new domain to the specified bucket. The `link` property needs to have the `protocolLink` value of an existing bucket id.
- `async  updateBucketDomain(bucketId: string, domainIdentifier: string, options: { link: string; name: string; }): Promise<{ domain: Domain }>` - used to update an existing domain of the Bucket.
- `async  verifyBucketDomain(bucketId: string, domainIdentifier: string): Promise<{ domain: Domain }>` - used to verify the domain, after which the content behind the domain will be cached on CDN.
- `async  deleteBucketDomain(bucketId: string, domainIdentifier: string): Promise<{ success: boolean }>` - used to delete the domain of the Bucket.
- `async  archiveBucket(bucketId: string): Promise<void>` - used to archive a Bucket.
- `async  unarchiveBucket(bucketId: string): Promise<void>` - used to unarchive a Bucket.
- `async  getBucketUploadCount(bucketId: string): Promise<{total: number; successful: number; failed: number;pending: number; }>` - used to get the number of uploads for the specified bucket.
- `async  getBucketUploads(bucketId: string, options: { skip: number; limit: number; }): Promise<{ uploads: Upload[] }>`- used to get the uploads of the bucket.

Interfaces:

```js
interface  Domain {
	_id: string;
	name: string;
	link: string;
	verified: boolean;
	bucketId: string;
	type: DomainTypeEnum;
}

enum  BucketStateEnum {
	MAINTAINED = "MAINTAINED",
	ARCHIVED = "ARCHIVED",
}

interface  Bucket {
	_id: string;
	name: string;
	organizationId: string;
	state: BucketStateEnum;
	domains: Domain[];
}

enum UploadStatusEnum {
  PENDING = "Pending",
  CANCELED = "Canceled",
  DEPLOYED = "Deployed",
  FAILED = "Failed",
  TIMED_OUT = "TimedOut",
}

interface  Upload {
	_id: string;
	protocolLink: string;
	buildDirectory: string[];
	status: UploadStatusEnum;
	memoryUsed: number;
	bucketId: string;
	protocol: string;
}
```

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
