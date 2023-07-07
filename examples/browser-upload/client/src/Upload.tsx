import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import { upload } from "@spheron/browser-upload";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLink, setUploadLink] = useState("");
  const [bucketId, setBucketId] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");

  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [aRecord, setARecord] = useState("N.A");
  const [cnameRecord, setCnameRecord] = useState("N.A");
  const [verified, setVerified] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    setUploadLink("");
    setDynamicLink("");
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8111/initiate-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketName: "abcdf",
        }),
      });
      const responseJson = await response.json();
      const uploadResult = await upload([file], {
        token: responseJson.uploadToken,
      });

      setUploadLink(uploadResult.protocolLink);
      setBucketId(uploadResult.bucketId);
      setDynamicLink(uploadResult.dynamicLinks[0]);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!uploadLink) {
      alert("No file uploaded, please upload a file first!");
      return;
    }

    try {
      setIsAddLoading(true);
      const response = await fetch("http://localhost:8111/add-domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId,
          link: uploadLink,
          type: "subdomain",
          name: domainName,
        }),
      });
      const resJson = await response.json();
      console.log(resJson);
      setARecord(resJson.cdnARecords);
      setCnameRecord(resJson.cdnCnameRecords);
    } catch (err) {
      alert(err);
    } finally {
      setIsAddLoading(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!domainName) {
      alert("No domain added, please provide a domain first!");
      return;
    }

    try {
      setIsVerifyLoading(true);
      const response = await fetch("http://localhost:8111/verify-domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId,
          name: domainName,
        }),
      });
      const resJson = await response.json();
      console.log(resJson);
      setVerified(resJson.verified);
    } catch (err) {
      alert(err);
    } finally {
      setIsVerifyLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {isLoading ? (
          <>Uploading...</>
        ) : (
          <>
            <p>Upload Content to IPFS</p>
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
                  onClick={handleUpload}
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
        <div className="mt-8">
          <input
            type="text"
            name="domain"
            id="domain"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <div className="button-con button-53 h-12" onClick={handleAddDomain}>
            {isAddLoading ? "Adding" : "Add"}
          </div>
        </div>
        <div className="mt-8">
          <div>Records - A - {aRecord}</div>
          <div>Records - CNAME - {cnameRecord}</div>
          <div
            className="button-con button-53 h-12"
            onClick={handleVerifyDomain}
          >
            {isVerifyLoading ? "Verifying" : verified ? "Verified" : "Verify"}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Upload;
