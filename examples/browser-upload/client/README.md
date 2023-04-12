# Browser Upload Client Example

- A react web app that uses [@spheron/browser-upload](https://www.npmjs.com/package/@spheron/browser-upload) to upload the data directly from browser.
- It holds logic that will first send a request to the Backend Service ( which is in the **server** directory ) to get the `uploadToken`, and after it gets the response it will use the token to upload data.
- Checkout the `handleUpload` function in Upload.tsx, to see how to use the [@spheron/browser-upload](https://www.npmjs.com/package/@spheron/browser-upload).

To start the project:

1. execute `npm install`
2. execute `npm start`
