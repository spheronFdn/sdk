import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Upload from "./Upload";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Upload />
  </React.StrictMode>
);
