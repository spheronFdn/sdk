import React, { useRef, useState } from "react";
import logo from "../logo.svg";
import { upload } from "@spheron/web-upload";

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLink, setUploadLink] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");

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

  const handleUpload = () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    setIsLoading(true);
    fetch("http://localhost:8111/initiate-upload", {
      method: "POST",
    })
      .then((res) => res.json()) // Parse response as JSON
      .then(async (res) => {
        const uploadResult = await upload([file], {
          uploadId: res.uploadId,
          token: res.uploadToken,
        });
        setUploadLink(uploadResult.protocolLink);
        setDynamicLink(uploadResult.dynamicLinks[0]);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      </header>
    </div>
  );
}

export default Home;
