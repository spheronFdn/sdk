import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import "./Upload.css";
import lit from "./lit";

function UploadEncrypt() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLink, setUploadLink] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");
  const [decryptIpfs, setDecryptIpfs] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    setFileType(selectedFile!.name);
    setUploadLink("");
    setDynamicLink("");
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEncryptUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8111/initiate-upload");
      const responseJson = await response.json();
      const uploadResult = await lit.encryptFile(file, {
        token: responseJson.uploadToken,
      });

      setUploadLink(uploadResult.protocolLink);
      setDynamicLink(uploadResult.dynamicLinks[0]);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecryptDownload = async () => {
    if (!decryptIpfs) {
      alert("No ipfs entered");
      return;
    }

    try {
      setIsLoading(true);

      const fileBlob = await lit.decryptFile(decryptIpfs);
      generateFileFromUint8Array(fileBlob, `abcd-${fileType}`);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  function generateFileFromUint8Array(
    uint8Array: string | Uint8Array,
    fileName: string
  ) {
    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array]);

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Append the link to the document body
    document.body.appendChild(link);

    // Simulate a click on the link to trigger the download
    link.click();

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {isLoading ? (
          <>Uploading...</>
        ) : (
          <>
            <p>Upload Encrypted Content to IPFS</p>
            <div className="flex gap-32">
              <div className="">
                <div
                  className="button-con button-53"
                  onClick={handleSelectFile}
                >
                  Select File
                  <input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full h-full"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="flex-1 flex items-center pl-4 text-sm -rotate-2">
                  {file ? file?.name : "No file selected"}
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className="button-con button-53 h-12"
                  onClick={handleEncryptUpload}
                >
                  Upload
                </div>
                {uploadLink && (
                  <a
                    className="text-sm mt-4 -rotate-2"
                    href={uploadLink}
                    target="__blank"
                  >
                    {uploadLink}
                  </a>
                )}
                {dynamicLink && (
                  <a
                    className="text-sm mt-4 -rotate-2"
                    href={`https://${dynamicLink}`}
                    target="__blank"
                  >
                    {dynamicLink}
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {!isLoading && (
          <>
            <p>Decrypt Content from IPFS</p>
            <div className="flex gap-32">
              <div className="flex flex-col mt-12">
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={decryptIpfs}
                  onChange={(e) => setDecryptIpfs(e.target.value)}
                />
                <div
                  className="button-con button-53 h-12"
                  onClick={handleDecryptDownload}
                >
                  Decrypt
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default UploadEncrypt;
