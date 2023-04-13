<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>

<h1 align="center">Storage SDK</h1>

<p align="center">
  🧰 SDK for multi-chain storage, powered by Spheron.
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/@spheron/storage" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.13&color=green" />
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

### Upload Example

In the example below you can see how to create an instance of `SpheronClient` and how to upload a file/directory to the specified protocol.

```js
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

const client = new SpheronClient({ token });
let currentlyUploaded = 0;
const { uploadId, bucketId, protocolLink, dynamicLinks } = await client.upload(
  filePath,
  {
    protocol: ProtocolEnum.IPFS,
    name,
    onUploadInitiated: (uploadId) => {
      console.log(`Upload with id ${uploadId} started...`);
    },
    onChunkUploaded: (uploadedSize, totalSize) => {
      currentlyUploaded += uploadedSize;
      console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
    },
  }
);
```

- Function `upload` has two parameters `client.upload(filePath, configuration);`
  - `filePath` - the path to the file/directory that will be uploaded
  - `configuration` - an object with parameters:
    - `configuration.name` - represents the name of the bucket on which you are uploading the data.
    - `configuration.protocol` - a protocol on which the data will be uploaded. The supported protocols are [ `ARWEAVE`, `IPFS`, `FILECOIN`].
    - `configuration.onUploadInitiated` - **optional** - callback function `(uploadId: string) => void`. The function will be called once, when the upload is initiated, right before the data is uploaded. The function will be called with one parameter, `uploadId`, which represents the id of the started upload.
    - `configuration.onChunkUploaded` - **optional** - callback function `(uploadedSize: number, totalSize: number) => void`. The function will be called multiple times, depending on the upload size. The function will be called each time a chunk is uploaded, with two parameters. the first one `uploadedSize` represents the size in Bytes for the uploaded chunk. The `totalSize` represents the total size of the upload in Bytes.
  - The response of the upload function is an object with parameters:
    - `uploadId` - the id of the upload
    - `bucketId` - the id of the bucket
    - `protocolLink` - is the protocol link of the upload
    - `dynamicLinks` - are domains that you have setup for your bucket. When you upload new data to the same bucket, the domains will point to the new uploaded data.

### IPNS Example

In the example below you can see how to publish an upload to IPNS, update IPNS to another upload id and get all IPNS names for an organization.

```js
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

const client = new SpheronClient({ token });
let currentlyUploaded = 0;
const { uploadId, bucketId, protocolLink, dynamicLinks } = await client.upload(
  filePath,
  {
    protocol: ProtocolEnum.IPFS, // Only works with IPFS and Filecoin uploads
    name,
    onUploadInitiated: (uploadId) => {
      console.log(`Upload with id ${uploadId} started...`);
    },
    onChunkUploaded: (uploadedSize, totalSize) => {
      currentlyUploaded += uploadedSize;
      console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
    },
  }
);

// Publish Upload to IPNS
const ipnsData: IPNSName = await client.publishIPNS(uploadId);

// Upload second file to Spheron
const uploadIdTwo = await client.upload(filePath2, { ...uploadDetails });

// Update IPNS Name to point to another upload
const ipnsData: IPNSName = await client.updateIPNSName(
  ipnsData.id,
  uploadIdTwo
);

// Get all published IPNS Names for organization
const orgIPNSNames: IPNSName[] = await client.getIPNSNamesForOrganization(
  organizationId
);
```

- Function `publishIPNS` has one parameter `client.upload(uploadId);`
  - `uploadId` - the upload id of file uploaded using Spheron SDK
- Function `updateIPNSName` has two parameters `client.updateIPNSName(ipnsNameId, uploadId);`
  - `ipnsNameId` - the IPNS name id of a previously published upload
  - `uploadId` - the new upload id you want IPNS Name to point to.
- Function `orgIPNSNames` has one parameter `client.upload(organizationId);`
  - `organizationId` - your organization id

---

The `SpheronClient` instance provides several methods for working with buckets. The supported methods are:

- `async getBucket(bucketId: string): Promise<Bucket>`
  - used to get the bucket information for the specified `bucketId`.
- `async  getBucketDomains(bucketId: string): Promise<Domain[]>`
  - used to get the domains that are attached to the specified `bucketId`.
- `async  getBucketDomain(bucketId: string, domainIdentifier: string): Promise<Domain>`
  - used to get the information about the specific domain. The `domainIdentifier` can ether be the id of the domain, or the name of the domain.
- `async  addBucketDomain(bucketId: string, { link:  string; type: DomainTypeEnum; name: string; }): Promise<Domain>`
  - used to add a new domain to the specified bucket. The `link` property needs to have the `protocolLink` value of an existing bucket id. After adding a new domain, you will need to setup the record on your DNS provider:
    - **domain**: you should create a **A** type record with value `13.248.203.0`, and the same name as the domain you have added.
    - **subdomain** : you should create a **CNAME** type record with value `cname.spheron.io`, and the same name as the domain you have added.
    - **handshake-domain**: you should create a **A** type record with value `ipfs.namebase.io`, and `@` for name. Also you should create a **TXT** type record with `link` for a value, and `_contenthash` for name.
    - **handshake-subdomain**: you should create a **A** type record with value `ipfs.namebase.io`, and the same name as the domain you have added. Also you should create a **TXT** type record with `link` for a value, and `_contenthash.<name_of_the_domain>` for name.
    - **ens-domain**: you should create a **CONTENT** type record with `link` for a value, and the same name as the domain you have added.
  - After you have setup the record on your DNS provider, then you should call the `verifyBucketDomain` method to verify your domain on Spheron. After the domain is verified, the data behind the link will be cached on the Spheron CDN.
- `async  updateBucketDomain(bucketId: string, domainIdentifier: string, options: { link: string; name: string; }): Promise<Domain>`
  - used to update an existing domain of the Bucket.
- `async  verifyBucketDomain(bucketId: string, domainIdentifier: string): Promise<Domain>`
  - used to verify the domain, after which the content behind the domain will be cached on CDN.
- `async  deleteBucketDomain(bucketId: string, domainIdentifier: string): Promise<void>`
  - used to delete the domain of the Bucket.
- `async  archiveBucket(bucketId: string): Promise<void>`
  - used to archive the Bucket. New uploads cannot be created for an archived bucket.
- `async  unarchiveBucket(bucketId: string): Promise<void>`
  - used to unarchive the Bucket.
- `async  getBucketUploadCount(bucketId: string): Promise<{total: number; successful: number; failed: number; pending: number; }>`
  - used to get the number of uploads for the specified bucket.
- `async  getBucketUploads(bucketId: string, options: { skip: number; limit: number; }): Promise<Upload[]>`
  - used to get the uploads of the bucket. The default value for `skip` is 0. The default value for `limit` is 6.
- `async  getUpload(uploadId: string): Promise<Upload>`
  - used to get the upload by its id.
- `async  getOrganizationUsage(organizationId: string): Promise<UsageWithLimits>`
  - used to get the usage of the current active subscription of the organization.
- `async getTokenScope(): Promise<TokenScope>`
  - used to get the scope of the token.
- `async publishIPNS(uploadId: string): Promise<IPNSName>`
  - used to publish IPFS Upload to IPNS
- `async updateIPNSName(ipnsNameId: string, uploadId: string): Promise<IPNSName>`
  - used to update IPNS name to new upload id
- `async getIPNSName(ipnsNameId: string): Promise<IPNSName>`
  - get IPNS name data by id
- `async getIPNSNamesForUpload(uploadId: string): Promise<IPNSName[]>`
  - get all IPNS names for an upload id
- `async getIPNSNamesForOrganization(organizationId: string): Promise<IPNSName[]>`
  - get all IPNS names for an organization
- `async createSingleUploadToken(configuration: { name: string; protocol: ProtocolEnum; }): Promise<{ uploadToken: string }>`
  - used to create a token for the **@spheron/browser-upload** package. The token can be used by your web app to enable users to directly upload their data from their browser to the specified protocol. Checkout the [@spheron/browser-upload](https://www.npmjs.com/package/@spheron/browser-upload) package for more information.

Interfaces:

```js
enum DomainTypeEnum {
  DOMAIN = "domain",
  SUBDOMAIN = "subdomain",
  HANDSHAKE_DOMAIN = "handshake-domain",
  HANDSHAKE_SUBDOMAIN = "handshake-subdomain",
  ENS_DOMAIN = "ens-domain",
}

interface  Domain {
  id: string;
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
  id: string;
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
  id: string;
  protocolLink: string;
  buildDirectory: string[];
  status: UploadStatusEnum;
  memoryUsed: number;
  bucketId: string;
  protocol: string;
}

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

interface IPNSName {
  id: string;
  publishedUploadId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  ipnsHash: string;
  ipnsLink: string;
}
```

---

The package also provides a couple of methods for transforming CID from V0 to V1 and vice verse.

```js
import { ipfs } from "@spheron/storage";

const cid = <CID_VALUE>;

const v1 = ipfs.utils.toV1(cid);
console.log("CID V1", v1);

const v0 = ipfs.utils.toV0(cid);
console.log("CID V0", v0);
```

## Access Token

To create the `token` that is used with the `SpheronClient`, follow the instructions in the [DOCS](https://docs.spheron.network/rest-api/#creating-an-access-token). When you are creating the tokens, please choose **web app** type in the dashboard.

## Notes

The package is only meant for Node.js environments and will not work in a browser or frontend apps.

## Learn More

You can learn more about Spheron and Storage SDK here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)
- [Spheron Twitter](https://twitter.com/SpheronFdn)
