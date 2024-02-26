- This is an example on how you can use @spheron/storage SDK, to encrypt your file upload, and decrypt it afterwards.

- You will first need to run `npm install` to install all the packages.

# Encryption

- All the code is in the `./src/encrypt.js` file. To encrypt the data, run `npm run encrypt <filePath> <bucketName> <spheronToken> <walletPrivateKey>`. Replace the values with yours.
  - `filePath` the path to the file you want to encrypt
  - `bucketName` the bucket name to which you want to upload data.
  - `spheronToken` your Spheron API token. Make sure to use a token for the storage organization.
  - `walletPrivateKey` your wallet private key.
- In the console you will get the upload response.

# Decryption

- All the code is in the `./src/decrypt.js` file. To decrypt the data, run `npm run decrypt <filePath> <cid> <spheronToken> <walletPrivateKey>`. Replace the values with yours.
  Replace the values with yours.
  - `filePath` the path to the file that should be created with the decrypted data.
  - `cid` the cid of the encrypted data.
  - `spheronToken` your Spheron API token. Make sure to use a token for the storage organization.
  - `walletPrivateKey` your wallet private key.
- The decrypted data will be in the file path.
