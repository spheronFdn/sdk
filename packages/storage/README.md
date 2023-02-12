# Spheron Storage SDK

### Usage:

In the example bellow you can see how to create an instance of `SpheronClient` and how to upload a file/directory to the specified protocol.

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
    - `configuarion.protocol` - a protocol on which the data will be uploaded. The supported protocols are [ `ARWEAVE`, `IPFS`, `FILECOIN`].
  - The response of the upload function is an object with parameters:
    - `uploadId` - the id of the upload
    - `bucketId` - the id of the bucket
    - `protocolLink` - is the protocol link of the upload
    - `dynamicLinks` - are domains that you have setup for your bucket. When you upload new data to the same bucket, the domains will point to the new uploaded data.
